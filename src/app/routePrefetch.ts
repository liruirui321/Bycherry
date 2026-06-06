const prefetchedRouteKinds = new Set<string>();

export function preloadWorkDetailRoute() {
  if (prefetchedRouteKinds.has("work")) return;
  prefetchedRouteKinds.add("work");
  void import("./components/WorkDetailPage");
}

export function preloadArticleDetailRoute() {
  if (prefetchedRouteKinds.has("article")) return;
  prefetchedRouteKinds.add("article");
  void import("./components/ArticleDetailPage");
}

export function preloadArticleLibraryRoute() {
  if (prefetchedRouteKinds.has("article-library")) return;
  prefetchedRouteKinds.add("article-library");
  void import("./components/ArticleLibraryPage");
}

export function preloadRouteForHref(href: string | undefined) {
  if (!href) return;
  if (href.startsWith("/works/")) preloadWorkDetailRoute();
  if (href === "/reading") preloadArticleLibraryRoute();
  if (href.startsWith("/notes/") || href.startsWith("/research/")) preloadArticleDetailRoute();
}
