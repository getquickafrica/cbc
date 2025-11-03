import Hero from '@/components/Hero';
import WhatWeDo from '@/components/WhatWeDo';
import HowToEarn from '@/components/HowToEarn';
import Testimonials from '@/components/Testimonials';

export default function Home() {
  return (
    <main>
      <Hero />
      <WhatWeDo />
      <HowToEarn />
      <Testimonials />
    </main>
  );
}