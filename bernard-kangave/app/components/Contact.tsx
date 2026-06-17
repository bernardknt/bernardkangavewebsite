export default function Contact() {
    return (
        <section id="contact" className="py-20 px-6">
            <div className="max-w-3xl mx-auto text-center space-y-8">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">
                    Get in Touch
                </h2>
                <p className="text-lg text-muted-foreground">
                    I&apos;m currently open to new opportunities and collaborations. Whether you have a question or just want to say hi, feel free to reach out!
                </p>
                <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                    <a
                        href="mailto:bernardkangave@businesspilotapp.com"
                        className="px-8 py-3 text-base font-medium text-primary-foreground bg-primary rounded-full hover:bg-primary/90 transition-colors w-full md:w-auto"
                    >
                        Send Email
                    </a>
                    <a
                        href="https://www.linkedin.com/in/bernard-kangave-a2b67370/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-8 py-3 text-base font-medium text-foreground border border-border rounded-full hover:bg-muted transition-colors w-full md:w-auto"
                    >
                        LinkedIn
                    </a>
                    <a
                        href="https://x.com/bernardknt"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-8 py-3 text-base font-medium text-foreground border border-border rounded-full hover:bg-muted transition-colors w-full md:w-auto"
                    >
                        X (Twitter)
                    </a>
                </div>
                <footer className="pt-20 text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} Bernard Kangave. All rights reserved.</p>
                </footer>
            </div>
        </section>
    );
}
