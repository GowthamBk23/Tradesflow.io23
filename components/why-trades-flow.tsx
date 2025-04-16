import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Clock, DollarSign, Smartphone } from "lucide-react"

const benefits = [
  {
    icon: <Clock className="h-10 w-10 text-blue-500" />,
    title: "Save 10+ Hours Per Week",
    description:
      "Automate scheduling, invoicing, and client communication to free up time for what matters most—growing your business.",
  },
  {
    icon: <DollarSign className="h-10 w-10 text-teal-400" />,
    title: "Increase Revenue by 25%",
    description:
      "Optimize your team's schedule, reduce downtime between jobs, and never miss a billable hour with accurate time tracking.",
  },
  {
    icon: <Smartphone className="h-10 w-10 text-blue-500" />,
    title: "Manage Everything On-The-Go",
    description:
      "Access your business from anywhere with our mobile-friendly platform. Perfect for tradespeople who are always on the move.",
  },
  {
    icon: <CheckCircle className="h-10 w-10 text-teal-400" />,
    title: "Improve Client Satisfaction",
    description:
      "Provide a professional experience with online quotes, invoices, and a client portal that keeps everyone informed.",
  },
]

export default function WhyTradesFlow() {
  return (
    <section id="why" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <header className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Trade Businesses Choose TradesFlow</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of trade professionals who've transformed their business operations
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {benefits.map((benefit, index) => (
            <Card key={index} className="border-border/40 bg-card/50 backdrop-blur-sm rounded-2xl">
              <CardContent className="p-8">
                <div className="bg-background/50 p-4 rounded-xl inline-block mb-4" aria-hidden="true">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <blockquote className="mt-16 text-center">
          <p className="text-xl font-medium mb-2">
            "TradesFlow has completely transformed how we manage our plumbing business. We've cut admin time in half and
            increased our bookings by 30%."
          </p>
          <footer className="text-muted-foreground">— Mike Johnson, Johnson Plumbing Services</footer>
        </blockquote>
      </div>
    </section>
  )
}
