import Header from '@/components/Header';
import PromptPlayground from '@/components/PromptPlayground';

export default function PromptLabPage() {
  return (
    <>
      <Header />
      <PromptPlayground />
      <footer className="border-t border-hdfc-line bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 text-[10px] text-hdfc-slate text-center">
          HDFC Retail Assets GenAI Playground &middot; Prompt Engineering Lab &middot; Synthetic Data Only &middot; Powered by Gen-AI
        </div>
      </footer>
    </>
  );
}
