"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Menu, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false)
    const element = document.getElementById(sectionId)
    if (element) {
      // Add a small delay to ensure smooth scrolling after menu closes
      setTimeout(() => {
        const headerOffset = 80
        const elementPosition = element.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        })
      }, 100)
    }
  }

  const handleLogin = () => {
    toast({
      title: "Redirecting to login",
      description: "Taking you to the authentication page...",
      duration: 2000,
    })
  }

  const handleStartTrial = () => {
    toast({
      title: "Starting your free trial",
      description: "Taking you to the registration page...",
      duration: 2000,
    })
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/80 backdrop-blur-md py-3 shadow-md" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">
            TradesFlow
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
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
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <ModeToggle />
          <Link href="/auth" onClick={handleLogin}>
            <Button variant="ghost" size="sm">
              Login
            </Button>
          </Link>
          <Link href="/auth" onClick={handleStartTrial}>
            <Button size="sm">Start Free Trial</Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4 md:hidden">
          <ModeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
            <span className="sr-only">{mobileMenuOpen ? "Close menu" : "Open menu"}</span>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div id="mobile-menu" className="md:hidden bg-background/95 backdrop-blur-md p-4 shadow-lg">
          <nav className="flex flex-col gap-4 py-4" aria-label="Mobile navigation">
            <button
              className="text-lg px-4 py-2 hover:bg-accent rounded-xl transition-colors text-left"
              onClick={() => scrollToSection("features")}
            >
              Features
            </button>
            <button
              className="text-lg px-4 py-2 hover:bg-accent rounded-xl transition-colors text-left"
              onClick={() => scrollToSection("why")}
            >
              Why TradesFlow
            </button>
            <button
              className="text-lg px-4 py-2 hover:bg-accent rounded-xl transition-colors text-left"
              onClick={() => scrollToSection("pricing")}
            >
              Pricing
            </button>
            <div className="flex flex-col gap-2 mt-2 px-4">
              <Link href="/auth" onClick={handleLogin}>
                <Button variant="outline" className="w-full">
                  Login
                </Button>
              </Link>
              <Link href="/auth" onClick={handleStartTrial}>
                <Button className="w-full">Start Free Trial</Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
