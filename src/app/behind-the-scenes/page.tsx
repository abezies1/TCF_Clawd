"use client";

import Link from "next/link";

interface ContentItem {
  id: string;
  type: "video" | "article" | "photo";
  title: string;
  description: string;
  date: string;
  duration?: string;
  image: string;
}

const behindContent: ContentItem[] = [
  {
    id: "bts-bean-journey",
    type: "video",
    title: "From Bean to Bar: Our Process",
    description: "Follow the complete journey of a cacao bean as it transforms into one of our signature chocolate bars. From sorting and roasting to conching and tempering — every step is done by hand in our Tucson workshop.",
    date: "2026-02-01",
    duration: "8 min",
    image: "/images/bts-process.jpg",
  },
  {
    id: "bts-ecuador",
    type: "article",
    title: "Visiting Our Cacao Farm in Ecuador",
    description: "Our founder recently traveled to Hacienda Victoria in Ecuador's Esmeraldas province to meet the families who grow the Nacional cacao we use in our signature dark truffles. Here's what she discovered.",
    date: "2026-01-15",
    image: "/images/bts-ecuador.jpg",
  },
  {
    id: "bts-tempering",
    type: "video",
    title: "The Art of Tempering Chocolate",
    description: "Why does our chocolate have that satisfying snap? It's all in the tempering. Watch our head chocolatier demonstrate the marble slab technique that gives our bars their perfect texture.",
    date: "2026-01-28",
    duration: "5 min",
    image: "/images/bts-temper.jpg",
  },
  {
    id: "bts-prickly-pear",
    type: "photo",
    title: "Prickly Pear Harvest 2025",
    description: "Every September, our team heads into the Sonoran Desert to forage prickly pear fruit. See the gorgeous magenta fruit that gives our signature truffles their stunning natural color.",
    date: "2025-09-20",
    image: "/images/bts-prickly.jpg",
  },
  {
    id: "bts-mole-collab",
    type: "article",
    title: "Creating Our Oaxacan Mole Bar",
    description: "How a two-week trip to Oaxaca and collaboration with a mole master inspired our most complex chocolate creation ever. The story behind the limited-edition Mole Bar.",
    date: "2026-02-10",
    image: "/images/bts-mole.jpg",
  },
  {
    id: "bts-sustainability",
    type: "article",
    title: "Our Commitment to Sustainability",
    description: "From direct-trade cacao sourcing to compostable packaging, here's how we're working to make every box of chocolate a force for good.",
    date: "2025-12-01",
    image: "/images/bts-sustain.jpg",
  },
];

export default function BehindTheScenesPage() {
  return (
    <div className="bts-page">
      <div className="hero">
        <h1>Behind the Scenes</h1>
        <p>Discover the stories, people, and craft behind every piece of chocolate we make.</p>
      </div>

      {/* Featured content */}
      <div className="bts-featured">
        <div className="bts-featured-image">
          <span className="bts-type-badge">{behindContent[0].type === "video" ? "Video" : "Article"}</span>
          {behindContent[0].duration && (
            <span className="bts-duration">{behindContent[0].duration}</span>
          )}
          <div className="bts-featured-placeholder">{"\u{1F3AC}"}</div>
        </div>
        <div className="bts-featured-info">
          <h2>{behindContent[0].title}</h2>
          <p>{behindContent[0].description}</p>
          <span className="bts-date">
            {new Date(behindContent[0].date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Content grid */}
      <div className="bts-grid">
        {behindContent.slice(1).map((item) => (
          <div key={item.id} className="bts-card">
            <div className="bts-card-image">
              <span className="bts-type-badge">
                {item.type === "video" ? "Video" : item.type === "photo" ? "Photos" : "Article"}
              </span>
              {item.duration && <span className="bts-duration">{item.duration}</span>}
              <div className="bts-card-placeholder">
                {item.type === "video" ? "\u{1F3AC}" : item.type === "photo" ? "\u{1F4F8}" : "\u{1F4DD}"}
              </div>
            </div>
            <div className="bts-card-info">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <span className="bts-date">
                {new Date(item.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="bts-cta">
        <h2>Want to see it in person?</h2>
        <p>Book a tasting or workshop and see our chocolate-making process live.</p>
        <Link href="/events" className="btn btn-primary">
          View Events
        </Link>
      </div>
    </div>
  );
}
