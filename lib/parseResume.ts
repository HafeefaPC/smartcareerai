export function parseResume(rawText: string): string {
  // Simple cleanup and keyword filtering (you can improve this)
  return rawText
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}
