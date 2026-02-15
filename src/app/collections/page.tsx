"use client";

import Link from "next/link";
import { collections } from "@/lib/catalog";

export default function CollectionsPage() {
  const featured = collections.filter((c) => c.featured);
  const other = collections.filter((c) => !c.featured);

  return (
    <div className="collections-page">
      <div className="hero">
        <h1>Curated Collections</h1>
        <p>Explore our handpicked chocolate collections, each telling a unique story.</p>
      </div>

      <div className="collections-grid">
        {featured.map((col) => (
          <Link
            key={col.id}
            href={`/collections/${col.slug}`}
            className="collection-card featured"
          >
            <div className="collection-card-image">
              <div className="collection-card-overlay">
                <h2>{col.name}</h2>
                <p>{col.description}</p>
                <span className="collection-count">
                  {col.productIds.length} items
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {other.length > 0 && (
        <>
          <h2 className="section-title">More Collections</h2>
          <div className="collections-list">
            {other.map((col) => (
              <Link
                key={col.id}
                href={`/collections/${col.slug}`}
                className="collection-list-item"
              >
                <div>
                  <h3>{col.name}</h3>
                  <p>{col.description}</p>
                </div>
                <span className="collection-count">{col.productIds.length} items</span>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
