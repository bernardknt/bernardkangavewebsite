import Header from "@/app/components/Header";
import BlogList from "@/app/components/blog/BlogList";
import Footer from "@/app/components/Footer";
import UploadBlogModal from "@/app/components/blog/UploadBlogModal";
import VideoSection from "@/app/components/VideoSection";

export default function BlogsPage() {
    return (
        <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
            <Header />

            {/* Spacer for fixed header */}
            <div className="h-24 md:h-32" />

            <div className="relative z-10">
                <BlogList />
            </div>

            {/* Background decorations */}
            <div className="fixed top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-secondary/10 to-transparent pointer-events-none -z-0" />
            <div className="fixed bottom-0 right-0 w-[50vw] h-[50vh] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-0" />

            <div className="container mx-auto px-6 pb-4 flex justify-end">
                <UploadBlogModal />
            </div>
            <VideoSection />
            <Footer />
        </main>
    );
}
