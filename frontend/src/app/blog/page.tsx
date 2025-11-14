import Header from "@/components/sections/header"
import Blog from "@/components/sections/blog"
import Footer from "@/components/sections/footer"

export default function BlogPage() {
  return (
    <main className="bg-background text-foreground transition-colors duration-500 min-h-screen">
  <Header />
  <Blog />
  <Footer />
</main>

  )
}
