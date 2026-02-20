import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, CheckCircle, Smartphone, Globe, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 px-4 text-center bg-gradient-to-b from-background to-secondary/20">
          <div className="container mx-auto max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
              Master Your Knowledge with{" "}
              <span className="bg-gradient-to-r from-primary to-teal-400 bg-clip-text text-transparent">
                Prosnokorta
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              A premium online quiz management system designed for students and educators. 
              Create, take, and analyze quizzes with ease.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="rounded-full text-lg px-8" asChild>
                <Link href="/register">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full text-lg px-8" asChild>
                <Link href="/login">Explore Quizzes</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 bg-background">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl border bg-card hover:shadow-lg transition-shadow">
                <Shield className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-2">Secure & Reliable</h3>
                <p className="text-muted-foreground">
                  Role-based access control ensuring students and admins have the right permissions.
                </p>
              </div>
              <div className="p-6 rounded-2xl border bg-card hover:shadow-lg transition-shadow">
                <Smartphone className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-2">Mobile Ready</h3>
                <p className="text-muted-foreground">
                  Take quizzes on any device with our fully responsive design.
                </p>
              </div>
              <div className="p-6 rounded-2xl border bg-card hover:shadow-lg transition-shadow">
                <CheckCircle className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-2">Instant Results</h3>
                <p className="text-muted-foreground">
                  Get immediate feedback and detailed Performance breakdowns after every quiz.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 bg-card">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2026 Prosnokorta. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
