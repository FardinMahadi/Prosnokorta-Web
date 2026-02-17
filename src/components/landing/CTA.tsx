'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function CallToAction() {
  return (
    <section className="py-20 bg-primary overflow-hidden relative">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-blue-400/10 rounded-full blur-2xl" />

      <div className="container px-4 mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl mb-6">
            Ready to transform your learning experience?
          </h2>
          <p className="text-xl text-blue-50/90 mb-10 max-w-2xl mx-auto">
            Join thousands of students and educators who are already using Prosnokorta to master their subjects.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="bg-white text-primary hover:bg-blue-50 px-10 rounded-full font-bold h-14 text-lg">
                Sign Up Now
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="border-white text-black/50 hover:bg-white/10 px-10 rounded-full font-bold h-14 text-lg">
                Student Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
