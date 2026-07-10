export default function cleanMessage(raw?: string): string {
  if (!raw) return "The transfer couldn't be completed.";
  const json = raw.match(/\{[\s\S]*\}/);   // grab the {...} part
  if (json) {
    try {
      const parsed = JSON.parse(json[0]);
      if (typeof parsed.message === "string") return parsed.message.trim();
    } catch {
      /* not valid JSON — fall through */
    }
  }
  return raw;
}