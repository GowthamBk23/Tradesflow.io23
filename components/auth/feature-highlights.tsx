import { Brain, Calendar, Users, FileText } from "lucide-react"

const features = [
  {
    icon: <Calendar className="h-8 w-8 text-blue-500" />,
    title: "Smart Scheduling",
    description: "AI-powered scheduling that optimizes your team's time and location.",
  },
  {
    icon: <Users className="h-8 w-8 text-teal-400" />,
    title: "Real-time Task Management",
    description: "Assign, track, and complete tasks with your team in real-time.",
  },
  {
    icon: <FileText className="h-8 w-8 text-blue-500" />,
    title: "Client Portal & Invoicing",
    description: "Give clients access to projects and send professional invoices.",
  },
  {
    icon: <Brain className="h-8 w-8 text-teal-400" />,
    title: "AI Tools to Save Time",
    description: "Automate repetitive tasks and get insights to grow your business.",
  },
]

export function FeatureHighlights() {
  return (
    <div className="space-y-8">
      <div className="relative">
        <div className="aspect-[16/9] rounded-2xl overflow-hidden border border-border/40 bg-card/30 backdrop-blur-sm shadow-xl">
          <div className="h-full w-full p-6 flex items-center justify-center">
            {/* Dashboard Preview */}
            <div className="w-full h-full rounded-xl bg-card/80 border border-border/40 shadow-inner flex flex-col p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="w-32 h-6 bg-muted/50 rounded-md"></div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-muted/50"></div>
                  <div className="w-8 h-8 rounded-full bg-muted/50"></div>
                </div>
              </div>
              <div className="flex gap-4 flex-1">
                <div className="w-1/3 bg-muted/30 rounded-lg p-3">
                  <div className="w-full h-4 bg-muted/50 rounded-md mb-3"></div>
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-full h-10 bg-muted/50 rounded-md"></div>
                    ))}
                  </div>
                </div>
                <div className="flex-1 bg-muted/30 rounded-lg p-3">
                  <div className="w-full h-4 bg-muted/50 rounded-md mb-3"></div>
                  <div className="grid grid-cols-2 gap-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="aspect-video bg-muted/50 rounded-md"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-5 -right-5 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl" />
        <div className="absolute -bottom-5 -left-5 w-24 h-24 bg-teal-400/20 rounded-full blur-2xl" />
      </div>

      <h2 className="text-2xl font-bold mt-8">Everything you need in one place</h2>

      <div className="grid grid-cols-1 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex items-start gap-4 p-4 rounded-xl bg-card/30 backdrop-blur-sm border border-border/40"
          >
            <div className="bg-background/50 p-2 rounded-lg">{feature.icon}</div>
            <div>
              <h3 className="font-medium">{feature.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
