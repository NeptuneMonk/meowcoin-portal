/**
 * Pictures picked in the demo stay in the browser as object URLs.
 * Nothing is uploaded, pinned, or written to disk.
 */
export function localImageUrl(file: File): string {
  return URL.createObjectURL(file);
}
