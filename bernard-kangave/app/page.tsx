import Header from "./components/Header";
import Hero from "./components/Hero";
import Bio from "./components/Bio";
import Impact from "./components/Impact"; // Added Impact import
import VideoSection from "./components/VideoSection";
import Work from "./components/Work";
import Author from "./components/Author";
import Framework from "./components/Framework";
import Services from "./components/Services";
import Testimonials from "./components/Testimonials";
import Community from "./components/Community";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <Header />
      <Hero />
      <Bio />
      <VideoSection />
      <Impact /> {/* Added Impact component */}
      <Work />
      <Author />
      <Framework />
      <Services />
      <Testimonials />
      <Community />
      <Footer />
    </main>
  );
}