import { Queue, Worker, type Job } from "bullmq";
import { Redis } from "ioredis";
import { airtimeSupplier } from "./airtime/vtpass";
import { sendReceiptEmail } from "./resend";

let _connection: Redis | null = null;
let _airtimeQueue: Queue<AirtimeJobData> | null = null;

export function getRedisConnection(): Redis {
  if (!_connection) {
    _connection = new Redis(process.env.UPSTASH_REDIS_URL ?? "redis://localhost:6379", {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      lazyConnect: true,
      tls: process.env.UPSTASH_REDIS_URL?.startsWith("rediss://") ? {} : undefined,
    });

    _connection.on("error", (err) => {
      // Prevent unhandled exception logs during build or when Redis is offline
      if (process.env.NODE_ENV !== "production") {
        console.warn("[Redis] connection warning:", err.message);
      }
    });
  }
  return _connection;
}

export function getAirtimeQueue(): Queue<AirtimeJobData> {
  if (!_airtimeQueue) {
    _airtimeQueue = new Queue<AirtimeJobData>("airtime-fulfillment", {
      connection: getRedisConnection(),
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: "exponential", delay: 10_000 },
        removeOnComplete: { count: 100 },
        removeOnFail: { count: 100 },
      },
    });
  }
  return _airtimeQueue;
}

// Proxy for lazy initialization to prevent connection attempts during build/module collection
export const airtimeQueue = new Proxy({} as Queue<AirtimeJobData>, {
  get(_target, prop) {
    if (prop === "then") return undefined;
    const q = getAirtimeQueue();
    return (q as unknown as Record<string | symbol, unknown>)[prop];
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
  return getAirtimeQueue().add("fulfill", data, { jobId: `order-${data.orderId}` });
}

/**
 * Worker — runs in a long-lived process (not Next.js edge / serverless).
 * Start this separately: `ts-node src/lib/worker.ts`
 */
export function startAirtimeWorker() {
  const connection = getRedisConnection();

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
