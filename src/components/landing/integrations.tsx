import { Workflow } from 'lucide-react'

export function Integrations() {
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden bg-gradient-to-b from-background via-primary/5 to-background border-y border-border">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex flex-col items-center text-center mb-16">
          <span className="px-3 py-1 text-sm font-medium text-gray-800 bg-primary rounded-full mb-4 flex items-center gap-2 shadow-md">
            <Workflow className="h-4 w-4" />
            Integrations
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 tracking-tight text-foreground relative">
            Connect TurboForm to Your Favorite Tools
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto mt-3"></div>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Supercharge your workflow by integrating with the apps you already use. Automate notifications, streamline
            data, and never miss a response.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {/* Slack */}
          <div className="flex flex-col items-center bg-card rounded-xl p-8 shadow-sm border border-border text-center hover:shadow-md transition-shadow">
            <div className="h-16 w-16 flex items-center justify-center mb-6">
              <img src="/logos/slack.png" alt="Slack logo" className="w-full h-auto object-contain" />
            </div>
            <span className="font-semibold text-lg mb-2">Slack</span>
            <span className="text-sm text-muted-foreground">Get instant notifications in your team channels.</span>
          </div>
          {/* Telegram */}
          <div className="flex flex-col items-center bg-card rounded-xl p-8 shadow-sm border border-border text-center hover:shadow-md transition-shadow">
            <div className="h-16 w-16 flex items-center justify-center mb-6">
              <img src="/logos/telegram.png" alt="Telegram logo" className="w-full h-auto object-contain" />
            </div>
            <span className="font-semibold text-lg mb-2">Telegram</span>
            <span className="text-sm text-muted-foreground">Receive real-time updates directly in Telegram.</span>
          </div>
          {/* Zapier */}
          <div className="flex flex-col items-center bg-card rounded-xl p-8 shadow-sm border border-border text-center hover:shadow-md transition-shadow">
            <div className="h-16 w-16 flex items-center justify-center mb-6">
              <img src="/logos/zapier.png" alt="Zapier logo" className="w-full h-auto object-contain" />
            </div>
            <span className="font-semibold text-lg mb-2">Zapier</span>
            <span className="text-sm text-muted-foreground">Automate workflows with 5,000+ connected apps.</span>
          </div>
          {/* Make.com */}
          <div className="flex flex-col items-center bg-card rounded-xl p-8 shadow-sm border border-border text-center hover:shadow-md transition-shadow">
            <div className="h-16 w-16 flex items-center justify-center mb-6">
              <img src="/logos/make.png" alt="Make.com logo" className="w-full h-auto object-contain" />
            </div>
            <span className="font-semibold text-lg mb-2">Make.com</span>
            <span className="text-sm text-muted-foreground">Build custom automations with visual scenarios.</span>
          </div>
          {/* Webhooks */}
          <div className="flex flex-col items-center bg-card rounded-xl p-8 shadow-sm border border-border text-center hover:shadow-md transition-shadow">
            <div className="h-16 w-16 flex items-center justify-center mb-6">
              <img src="/logos/webhook.png" alt="Webhook icon" className="w-full h-auto object-contain" />
            </div>
            <span className="font-semibold text-lg mb-2">Webhooks</span>
            <span className="text-sm text-muted-foreground">Connect to any service with custom webhooks.</span>
          </div>
          {/* Email */}
          <div className="flex flex-col items-center bg-card rounded-xl p-8 shadow-sm border border-border text-center hover:shadow-md transition-shadow">
            <div className="h-16 w-16 flex items-center justify-center mb-6">
              <img src="/logos/email.png" alt="Email icon" className="w-full h-auto object-contain" />
            </div>
            <span className="font-semibold text-lg mb-2">Email</span>
            <span className="text-sm text-muted-foreground">Get form responses delivered to your inbox.</span>
          </div>
        </div>
      </div>
    </section>
  )
}
