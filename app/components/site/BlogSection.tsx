import Link from "next/link";
import { BookOpen } from "lucide-react";
import { BlogCard } from "@/app/components/blog/BlogCard";
import { Button } from "@/components/ui/button";
import { getLatestBlogPosts } from "@/lib/blog";

const BlogSection = () => {
  const latest = getLatestBlogPosts(3);

  return (
    <section id="blog" className="relative py-14 md:py-20 bg-muted/35 overflow-hidden">
      <div
        className="pointer-events-none absolute -top-32 right-[-20%] h-[420px] w-[420px] rounded-full bg-primary/10 blur-[120px]"
        aria-hidden
      />
      <div className="container relative mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background px-4 py-1.5 text-[10px] md:text-xs font-bold uppercase tracking-[0.18em] text-primary-deep">
            <BookOpen className="h-3.5 w-3.5" />
            Advice & guides
          </span>
          <h2 className="mt-5 md:mt-6 font-display text-3xl font-extrabold leading-tight text-primary-deep md:text-4xl lg:text-5xl text-balance">
            Tips for hiring <span className="text-gradient-brand">trusted home help</span> in Mumbai
          </h2>
          <p className="mt-4 text-base md:text-lg text-foreground/70 leading-relaxed">
            Practical reads on verification, budgeting, and what domestic services cover across South Mumbai
            — so you can choose with clarity before you enquire.
          </p>
        </div>

        <div className="mx-auto mt-10 md:mt-14 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {latest.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>

        <div className="mt-10 flex justify-center md:mt-12">
          <Button variant="hero" size="lg" className="group" asChild>
            <Link href="/blog">
              View all articles
              <span className="ml-2 transition-transform group-hover:translate-x-0.5" aria-hidden>
                →
              </span>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
