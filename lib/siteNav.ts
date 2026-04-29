/**
 * Homepage section anchors usable from **any route** (e.g. Nav on `/services/...`).
 * Plain `#services` resolves on the **current URL** only and breaks away from `/`.
 */
export function homeSection(fragment: string): string {
  const id = fragment.replace(/^#/, "");
  if (!id || id === "top") {
    return "/";
  }
  return `/#${id}`;
}
