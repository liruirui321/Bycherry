import type { MouseEvent } from "react";

export function shouldUseClientNavigation(event: MouseEvent<HTMLAnchorElement>) {
  if (event.defaultPrevented) return false;
  if (event.button !== 0) return false;
  if (event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) return false;

  const target = event.currentTarget.getAttribute("target");
  return !target || target === "_self";
}

export function navigateClient(href: string) {
  window.history.pushState(null, "", href);
  window.dispatchEvent(new PopStateEvent("popstate"));
}
