import { Hero } from "@/components/home/hero"
import { ColorSystem } from "@/components/home/color-system"
import { CapabilitiesPreview } from "@/components/home/capabilities-preview"
import { ApplicationsPreview } from "@/components/home/applications-preview"
import { ProcessSection } from "@/components/home/process"
import { FactorySection } from "@/components/home/factory"
import { FaqSection } from "@/components/home/faq"
import { NewsPreview } from "@/components/home/news-preview"
import { QuoteCta } from "@/components/quote-cta"

export default function HomePage() {
  return (
    <>
      <Hero />
      <ColorSystem />
      <CapabilitiesPreview />
      <ApplicationsPreview />
      <ProcessSection />
      <FactorySection />
      <FaqSection />
      <NewsPreview />
      <QuoteCta />
    </>
  )
}
