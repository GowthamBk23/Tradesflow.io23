"use client"

import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { useToast } from "@/hooks/use-toast"

export default function Footer() {
  const { toast } = useToast()

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const headerOffset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }

  const handleLogin = () => {
    toast({
      title: "Redirecting to login",
      description: "Taking you to the authentication page...",
      duration: 2000,
    })
  }

  const handleLegalClick = (type: string) => {
    toast({
      title: `Viewing ${type}`,
      description: `Opening ${type} in a new tab...`,
      duration: 2000,
    })
  }

  return (
    <footer className="bg-background border-t border-border/40 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">
                TradesFlow
              </span>
            </Link>
            <p className="text-muted-foreground mt-2 text-sm">Powerful software for trade businesses</p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12">
            <nav className="flex gap-6" aria-label="Footer navigation">
              <button
                onClick={() => scrollToSection("features")}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("why")}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Why TradesFlow
              </button>
              <button
                onClick={() => scrollToSection("pricing")}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Pricing
              </button>
              <Link
                href="/auth"
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={handleLogin}
              >
                Login
              </Link>
            </nav>

            <ModeToggle />
          </div>
        </div>

        <div className="border-t border-border/40 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} TradesFlow. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <button
              onClick={() => handleLegalClick("Privacy Policy")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => handleLegalClick("Terms of Service")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
