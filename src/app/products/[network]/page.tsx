import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RefillDetailsView from "@/components/RefillDetailsView";
import { OPERATORS } from "@/lib/operators";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ network: string }> | { network: string };
};

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(props.params);
  const network = resolvedParams?.network;
  const operator = network ? OPERATORS[network.toLowerCase()] : null;
  if (!operator) return { title: "Refill — Bitbundle" };

  return {
    title: `${operator.fullName} with Crypto — Bitbundle`,
    description: `Refill ${operator.name} prepaid mobile airtime and data with USDT, Bitcoin, Ethereum, and more instantly.`,
  };
}

export default async function ProductDetailPage(props: any) {
  const params = await props.params;
  const network = params?.network;
  const normalized = (network || "").toLowerCase();
  const operator = OPERATORS[normalized] || OPERATORS.mtn;

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-between">
      <Header />
      <div className="pt-20">
        <main id="main-content" className="flex-1">
          <RefillDetailsView operatorId={operator.id} />
        </main>
      </div>
      <Footer />
    </div>
  );
}
