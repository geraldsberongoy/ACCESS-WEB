import Navbar from "@/components/ui/Navbar"
import ContributorsSection from "@/components/marketing/ContributorsSection"
import FooterSection from "@/components/marketing/FooterSection"

export default function ContributorsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="relative z-10">
        <Navbar />
      </div>

      <main className="flex-1">
        <ContributorsSection />
      </main>

      <FooterSection />
    </div>
  )
}

