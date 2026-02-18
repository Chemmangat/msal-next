import Hero from '@/components/Hero';
import Features from '@/components/Features';
import CodeExample from '@/components/CodeExample';
import ProblemSolution from '@/components/ProblemSolution';
import QuickStart from '@/components/QuickStart';
import CTA from '@/components/CTA';

export default function Home() {
  return (
    <>
      <Hero />
      <ProblemSolution />
      <Features />
      <CodeExample />
      <QuickStart />
      <CTA />
    </>
  );
}
