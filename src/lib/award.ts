// ⛔ DO NOT EDIT for routine content updates.
// Paints "Best Paper Award"-type phrases red wherever they appear (news items,
// the awards list). Matches "Best Paper Award", "Best Long Paper Award",
// "Best Poster Award" (with or without the trailing "Award"), "SAC Highlight
// (Paper) Award" and "Outstanding Paper Award".

const AWARD_RE = /(?:Best (?:Long |Short )?(?:Paper|Poster)(?: Award)?|SAC Highlight(?: Paper)? Award|Outstanding Paper Award)/g;

export type AwardPart = { text: string; award: boolean };

/** Split plain text into parts, flagging the award phrases (for Astro templates). */
export function splitAward(text: string): AwardPart[] {
  const out: AwardPart[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  AWARD_RE.lastIndex = 0;
  while ((m = AWARD_RE.exec(text)) !== null) {
    if (m.index > last) out.push({ text: text.slice(last, m.index), award: false });
    out.push({ text: m[0], award: true });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last), award: false });
  return out;
}

/** Wrap award phrases in an already-rendered HTML string (for set:html). */
export function markAwardHtml(html: string): string {
  return html.replace(AWARD_RE, (m) => `<span class="award-red">${m}</span>`);
}
