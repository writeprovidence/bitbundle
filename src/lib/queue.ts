import { Queue, Worker, type Job } from "bullmq";
import { Redis } from "ioredis";
import { airtimeSupplier } from "./airtime/vtpass";
import { sendReceiptEmail } from "./resend";

// Redis connection (Upstash compatible via ioredis)
const connection = new Redis(process.env.UPSTASH_REDIS_URL ?? "redis://localhost:6379", {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  tls: process.env.UPSTASH_REDIS_URL?.startsWith("rediss://") ? {} : undefined,
});

export const airtimeQueue = new Queue<AirtimeJobData>("airtime-fulfillment", {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 10_000 },
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 100 },
  },
});

export interface AirtimeJobData {
  orderId: string;
  network: string;
  phoneNumber: string;
  amountNgn: number;
  amountUsdt: number;
  txHash: string;
  userEmail?: string;
}

/**
 * Enqueue an airtime fulfillment job after payment is confirmed.
 */
export async function enqueueAirtimeFulfillment(data: AirtimeJobData) {
  return airtimeQueue.add("fulfill", data, { jobId: `order-${data.orderId}` });
}

/**
 * Worker — runs in a long-lived process (not Next.js edge / serverless).
 * Start this separately: `ts-node src/lib/worker.ts`
 */
export function startAirtimeWorker() {
  const worker = new Worker<AirtimeJobData>(
    "airtime-fulfillment",
    async (job: Job<AirtimeJobData>) => {
      const { orderId, network, phoneNumber, amountNgn, amountUsdt, txHash, userEmail } =
        job.data;

      console.log(`[Worker] Processing order ${orderId}`);

      // Purchase airtime
      const result = await airtimeSupplier.purchase({
        network: network as import("./airtime/types").Network,
        phoneNumber,
        amountNgn,
      });

      if (!result.success) {
        throw new Error(`Airtime purchase failed: ${result.message}`);
      }

      console.log(`[Worker] Airtime delivered for order ${orderId}. Ref: ${result.reference}`);

      // Send receipt email if we have one
      if (userEmail) {
        await sendReceiptEmail({
          to: userEmail,
          orderRef: orderId,
          network,
          phone: phoneNumber,
          amountNgn,
          amountUsdt,
          txHash,
        });
      }

      return { reference: result.reference };
    },
    { connection, concurrency: 5 },
  );

  worker.on("completed", (job) => {
    console.log(`[Worker] Job ${job.id} completed`);
  });

  worker.on("failed", (job, err) => {
    console.error(`[Worker] Job ${job?.id} failed: ${err.message}`);
  });

  return worker;
}
