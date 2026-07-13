interface PageMetadata {
  title: string;
  description: string;
  path: string;
}

export const setPageMetadata = ({ title, description, path }: PageMetadata) => {
  document.title = title;

  let descriptionMeta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
  if (!descriptionMeta) {
    descriptionMeta = document.createElement("meta");
    descriptionMeta.name = "description";
    document.head.appendChild(descriptionMeta);
  }
  descriptionMeta.content = description;

  let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }
  canonical.href = `https://florianbeermann.com${path}`;
};
