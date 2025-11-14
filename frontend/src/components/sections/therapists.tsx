const team = [
  {
    name: "Founder & Director",
    specialty: "Community Leadership",
    image: "/community-leader.jpg",
  },
  {
    name: "Program Manager",
    specialty: "Youth Development",
    image: "/youth-program-manager.jpg",
  },
  {
    name: "Community Coordinator",
    specialty: "Interfaith Relations",
    image: "/community-coordinator.jpg",
  },
  {
    name: "Wellness Specialist",
    specialty: "Health & Counseling",
    image: "/wellness-specialist.jpg",
  },
]

export default function Therapists() {
  return (
    <section id="team" className="py-16 md:py-24 bg-white">
      <div className="section-container">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Meet Our Team</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Dedicated professionals committed to making a difference in our communities.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <div key={index} className="text-center">
              <div className="mb-4 overflow-hidden rounded-xl">
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className="w-full h-64 object-cover hover:scale-105 transition-transform"
                />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-1">{member.name}</h3>
              <p className="text-primary font-semibold mb-3">{member.specialty}</p>
              <button className="text-accent hover:text-accent-dark font-semibold transition">Learn More →</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
