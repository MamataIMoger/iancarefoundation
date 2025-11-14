export default function HealingJourney() {
  return (
    <section className="py-16 md:py-24 bg-white
">
      <div className="section-container">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="rounded-2xl overflow-hidden shadow-lg h-96 md:h-full min-h-96">
            <img
              src="/yoga-meditation-peaceful-healing-mindfulness.jpg"
              alt="Healing Journey - Meditation and Wellness"
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Your Healing Journey Starts Here</h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              At Ian Cares Foundation, we understand that recovery is a personal journey. Our compassionate team
              combines evidence-based treatment with holistic wellness practices to support your transformation.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">Personalized Treatment Plans</h3>
                  <p className="text-muted-foreground">Tailored to your unique needs and circumstances</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">Holistic Wellness Programs</h3>
                  <p className="text-muted-foreground">Yoga, meditation, and mindfulness practices included</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">Ongoing Support & Community</h3>
                  <p className="text-muted-foreground">Connect with others on similar healing paths</p>
                </div>
              </div>
            </div>

            <button className="btn-primary">Start Your Recovery Today</button>
          </div>
        </div>
      </div>
    </section>
  )
}
