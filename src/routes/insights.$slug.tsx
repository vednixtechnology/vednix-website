import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Clock } from "lucide-react";
import { Section, BackgroundGlow, Eyebrow } from "@/components/site/primitives";
import { getPublishedBlogBySlug } from "@/lib/admin/blogs";
import type { BlogPost } from "@/lib/admin/types";

import { sanitizeHtml } from "@/lib/sanitize";

export const Route = createFileRoute("/insights/$slug")({
  component: BlogPostPage,
  head: ({ params }) => ({
    meta: [{ title: `${params.slug} | Vednix Technology` }],
  }),
});

function BlogPostPage() {
  const { slug } = Route.useParams();
  const [post, setPost] = useState<BlogPost | null | undefined>(undefined);

  useEffect(() => {
    getPublishedBlogBySlug(slug).then(setPost);
  }, [slug]);

  useEffect(() => {
    if (!post) return;
    // Set SEO tags dynamically once the post loads (client-rendered content,
    // same approach as the rest of the site's `head()` metadata).
    document.title = post.seoTitle || `${post.title} | Vednix Technology`;
    const setMeta = (name: string, content: string, property = false) => {
      const selector = property
        ? `meta[property="${name}"]`
        : `meta[name="${name}"]`;
      let tag = document.querySelector(selector) as HTMLMetaElement | null;
      if (!tag) {
        tag = document.createElement("meta");
        if (property) tag.setAttribute("property", name);
        else tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };
    setMeta("description", post.seoDescription || post.excerpt);
    setMeta("og:title", post.seoTitle || post.title, true);
    setMeta("og:description", post.seoDescription || post.excerpt, true);
    if (post.ogImageUrl || post.coverImageUrl) {
      setMeta("og:image", post.ogImageUrl || post.coverImageUrl || "", true);
    }
    let canonical = document.querySelector(
      'link[rel="canonical"]',
    ) as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute(
      "href",
      post.canonicalUrl || `https://vednix.com/insights/${post.slug}`,
    );

    const schema = document.createElement("script");
    schema.type = "application/ld+json";
    schema.id = "blog-post-schema";
    schema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.excerpt,
      image: post.ogImageUrl || post.coverImageUrl || undefined,
      author: { "@type": "Person", name: post.author },
      datePublished: post.publishDate?.toDate().toISOString(),
      dateModified: post.updatedAt?.toDate().toISOString(),
    });
    document.head.appendChild(schema);
    return () => {
      document.getElementById("blog-post-schema")?.remove();
    };
  }, [post]);

  if (post === undefined) {
    return (
      <Section>
        <div className="mx-auto h-96 max-w-3xl animate-pulse rounded-2xl border border-border/60 bg-surface/40" />
      </Section>
    );
  }

  if (post === null) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center container-px">
        <h1 className="font-display text-3xl font-semibold">
          Article not found
        </h1>
        <p className="mt-3 text-muted-foreground">
          This article may have been unpublished or doesn't exist.
        </p>
        <Link
          to="/insights"
          className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-electric"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Insights
        </Link>
      </div>
    );
  }

  return (
    <>
      <section className="relative overflow-hidden pt-16 md:pt-24">
        <BackgroundGlow />
        <div className="container-px relative mx-auto max-w-3xl text-center">
          <Eyebrow>{post.category}</Eyebrow>
          <h1 className="mt-5 font-display text-3xl font-bold sm:text-4xl md:text-5xl">
            {post.title}
          </h1>
          <div className="mt-5 flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span>{post.author}</span>
            <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {post.readingTimeMinutes} min read
            </span>
            {post.publishDate && (
              <>
                <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
                <span>{post.publishDate.toDate().toLocaleDateString()}</span>
              </>
            )}
          </div>
        </div>
      </section>

      <Section className="max-w-3xl">
        {post.coverImageUrl && (
          <img
            src={post.coverImageUrl}
            alt={post.title}
            className="mb-10 aspect-video w-full rounded-2xl object-cover"
          />
        )}
        <div
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
        />
        {post.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2 border-t border-border/60 pt-6">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
        <Link
          to="/insights"
          className="mt-10 inline-flex items-center gap-1.5 text-sm font-semibold text-electric"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Insights
        </Link>
      </Section>
    </>
  );
}
