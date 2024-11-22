export function formatDate(input: string): string {
  const date = new Date(input);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function absoluteUrl(input: string) {
  return `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${input}`;
}

export function truncateString(fullString: string, maxLength: number): string {
  const index = fullString.indexOf(" ", maxLength);
  return index === -1 ? fullString : fullString.substring(0, index) + "..."
}
