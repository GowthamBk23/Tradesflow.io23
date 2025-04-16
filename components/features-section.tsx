import { Calendar, MessageSquare, FileText, Users, MapPin, Brain } from "lucide-react"

const features = [
  {
    icon: <Calendar className="h-10 w-10 text-blue-500" />,
    title: "Project & Task Management",
    description: "Organize projects, assign tasks, and track progress in real-time.",
  },
  {
    icon: <Brain className="h-10 w-10 text-teal-400" />,
    title: "AI Scheduling",
    description: "Optimize schedules automatically based on location and availability.",
  },
  {
    icon: <Users className="h-10 w-10 text-blue-500" />,
    title: "Client Portal",
    description: "Give clients access to project updates, documents, and communication.",
  },
  {
    icon: <FileText className="h-10 w-10 text-teal-400" />,
    title: "Invoicing & Contracts",
    description: "Create, send, and track invoices and contracts from anywhere.",
  },
  {
    icon: <MessageSquare className="h-10 w-10 text-blue-500" />,
    title: "Real-Time Chat",
    description: "Communicate with your team and clients in one secure platform.",
  },
  {
    icon: <MapPin className="h-10 w-10 text-teal-400" />,
    title: "Clock-in/out with GPS",
    description: "Track work hours and locations for accurate time management.",
  },
]

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 md:py-32 bg-accent/30">
      <div className="container mx-auto px-4">
        <header className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">All-in-One Trade Business Management</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to run your trade business efficiently
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <article
              key={index}
              className="bg-card/50 backdrop-blur-sm border border-border/40 p-8 rounded-2xl hover:shadow-lg transition-all duration-300 hover:translate-y-[-4px]"
            >
              <div className="bg-background/50 p-4 rounded-xl inline-block mb-4" aria-hidden="true">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
