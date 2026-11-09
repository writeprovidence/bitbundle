import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RefillDetailsView from "@/components/RefillDetailsView";
import { OPERATORS } from "@/lib/operators";

type PageProps = {
  params: Promise<{ network: string }> | { network: string };
  searchParams?: Promise<{ phone?: string; country?: string }> | { phone?: string; country?: string };
};

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(props.params);
  const network = resolvedParams?.network;
  const operator = network ? OPERATORS[network.toLowerCase()] : null;
  if (!operator) return { title: "Top Up — Bitbundle" };

  return {
    title: `${operator.fullName} — Bitbundle`,
    description: `Top up ${operator.name} prepaid mobile airtime and data instantly.`,
  };
}

export default async function ProductDetailPage(props: any) {
  const params = await Promise.resolve(props.params);
  const searchParams = props.searchParams ? await Promise.resolve(props.searchParams) : undefined;
  const network = params?.network;
  const normalized = (network || "").toLowerCase();
  const operator = OPERATORS[normalized] || OPERATORS.mtn;

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      {/* Dark navy strip behind the transparent header — matches landing page */}
      <div className="fixed top-0 inset-x-0 h-20 bg-[#010C24] z-40 pointer-events-none" />
      <Header />
      <main id="main-content" className="flex-1 pt-20">
        <RefillDetailsView
          isModal={false}
          isOpen={true}
          operatorId={operator.id as any}
          initialPhone={searchParams?.phone}
          countryCode={searchParams?.country}
        />
      </main>
      <Footer />
    </div>
  );
}
