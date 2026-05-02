import Header from '@/components/Header';
import DocIntelligenceHub from '@/components/DocIntelligenceHub';

export default function DocIntelligencePage() {
  return (
    <>
      <Header />
      <DocIntelligenceHub />
      <footer className="border-t border-hdfc-line bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 text-[10px] text-hdfc-slate text-center">
          HDFC Retail Assets GenAI Playground &middot; Document Intelligence & Visualization &middot; Synthetic Data Only &middot; Subject to Bank Policy Approval
        </div>
      </footer>
    </>
  );
}
