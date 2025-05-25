export function UseCases() {
  return (
    <section className="py-16 mb-20 bg-secondary/5 border-y border-border">
      <div className="flex flex-col items-center text-center mb-12">
        <h2 className="text-3xl font-bold mb-3">Popular Use Cases</h2>
        <p className="text-lg text-muted-foreground max-w-2xl">
          TurboForm is flexible enough for teams, creators, and businesses of all sizes. Here are just a few ways our
          users get value every day.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mx-auto max-w-6xl">
        <div className="flex flex-col items-center bg-card rounded-xl p-6 border border-border shadow-sm text-center">
          <div className="bg-secondary/15 p-3 rounded-full mb-4">
            <span className="text-2xl">📝</span>
          </div>
          <span className="font-semibold text-lg mb-1">Lead Capture</span>
          <span className="text-base text-muted-foreground">
            Create beautiful forms to collect leads and grow your audience—no code required.
          </span>
        </div>
        <div className="flex flex-col items-center bg-card rounded-xl p-6 border border-border shadow-sm text-center">
          <div className="bg-secondary/15 p-3 rounded-full mb-4">
            <span className="text-2xl">📋</span>
          </div>
          <span className="font-semibold text-lg mb-1">Event Registration</span>
          <span className="text-base text-muted-foreground">
            Easily manage RSVPs and attendee info for webinars, workshops, and meetups.
          </span>
        </div>
        <div className="flex flex-col items-center bg-card rounded-xl p-6 border border-border shadow-sm text-center">
          <div className="bg-secondary/15 p-3 rounded-full mb-4">
            <span className="text-2xl">💡</span>
          </div>
          <span className="font-semibold text-lg mb-1">Feedback & Surveys</span>
          <span className="text-base text-muted-foreground">
            Collect actionable feedback from your users or team with shareable forms.
          </span>
        </div>
      </div>
    </section>
  )
}
