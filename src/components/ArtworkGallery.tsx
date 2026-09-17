import { useEffect, useRef } from "react";
import { initArtworkSlideshow } from "@/lib/artwork-slideshow";

const artworks = [
  {
    file: "artwork-marbling-02",
    extension: "png",
    width: 1632,
    height: 942,
    sizes: "max(100vw, 174vh)",
    caption: "A study in colour.",
    alt: "Abstract marbling in turquoise and deep green, with pale blue swirls and yellow droplets.",
    shade: true,
  },
  {
    file: "artwork-study-03",
    extension: "jpg",
    width: 1920,
    height: 1280,
    sizes: "max(100vw, 150vh)",
    caption: "Selected artwork.",
    alt: "Blue sky in the artistic impressions slideshow.",
    shade: false,
  },
  {
    file: "artwork-gallery-04",
    extension: "png",
    width: 1980,
    height: 1320,
    sizes: "max(100vw, 150vh)",
    caption: "Inside the gallery.",
    alt: "Art gallery with framed paintings, blue-grey walls, wooden floors and a central doorway.",
    shade: true,
  },
  {
    file: "artwork-hamburg-night-05",
    extension: "png",
    width: 2000,
    height: 1281,
    sizes: "max(100vw, 157vh)",
    caption: "Hamburg after dark.",
    alt: "Hamburg at night, with illuminated church spires and the Elbphilharmonie across the water.",
    shade: false,
  },
] as const;

export function ArtworkGallery() {
  const gallery = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!gallery.current) throw new Error("The slideshow must be mounted before it is initialised.");
    const slideshow = initArtworkSlideshow(gallery.current);
    return () => slideshow.destroy();
  }, []);

  return (
    <figure
      ref={gallery}
      className="artwork-gallery"
      data-artwork-slideshow=""
      data-interval="4000"
      data-fade-duration="1200"
      aria-label="Artistic impressions"
      aria-roledescription="slideshow"
      aria-live="off"
    >
      <div className="artwork-stage">
        {artworks.map((artwork, index) => (
          <div
            key={artwork.file}
            className={`artwork-slide${index === 0 ? " is-active" : ""}`}
            data-caption={artwork.caption}
            data-shade={artwork.shade ? "" : undefined}
            aria-hidden={index !== 0}
            hidden={index !== 0}
          >
            <picture>
              <source
                type="image/webp"
                srcSet={`/boutique/${artwork.file}-768.webp 768w, /boutique/${artwork.file}-${artwork.width}.webp ${artwork.width}w`}
                sizes={artwork.sizes}
              />
              <img
                ref={(image) => { if (image) image.fetchPriority = index === 0 ? "high" : "auto"; }}
                src={`/boutique/${artwork.file}.${artwork.extension}`}
                alt={artwork.alt}
                width={artwork.width}
                height={artwork.height}
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
              />
            </picture>
          </div>
        ))}
      </div>
      <figcaption className="artwork-caption">
        <span className="artwork-caption-label" data-artwork-caption="">{artworks[0].caption}</span>
        <span className="artwork-status" data-artwork-status="" role="status" hidden />
      </figcaption>
    </figure>
  );
}
