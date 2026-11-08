import xss, { type IFilterXSSOptions } from "xss";

const allowedTags = [
  "a",
  "b",
  "blockquote",
  "br",
  "div",
  "em",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "i",
  "li",
  "ol",
  "p",
  "span",
  "strong",
  "u",
  "ul",
];

const allowedAttributes = ["href", "rel", "style", "target"];

const richTextConfig: IFilterXSSOptions = {
  whiteList: Object.fromEntries(
    allowedTags.map((tag) => [tag, allowedAttributes])
  ),
  stripIgnoreTag: true,
  stripIgnoreTagBody: ["script", "style"],
};

export function sanitizeRichText(html: string | null | undefined) {
  return xss(html ?? "", richTextConfig).trim();
}

export function stripRichText(html: string | null | undefined) {
  return sanitizeRichText(html)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|h1|h2|h3|h4|h5|h6|li)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function isRichTextBlank(html: string | null | undefined) {
  return stripRichText(html).length === 0;
}
