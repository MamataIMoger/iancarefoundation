// File: frontend/src/app/page.tsx
import Header from "@/components/sections/header"
import Hero from "@/components/sections/hero"
import WhyUs from "@/components/sections/why-us"
import WhatWeOffer from "@/components/sections/whatweoffer"
import CallToAction from "@/components/sections/CallToAction";
import Footer from "@/components/sections/footer"


export default function HomePage() {
  return (
    <main>
      <Header />
      <Hero />
      
      <WhyUs />
      <WhatWeOffer />
       {/* 👈 Add this line here */}
         
         <CallToAction />

         
      <Footer />
    </main>
  )
}

