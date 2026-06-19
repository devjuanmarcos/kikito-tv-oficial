import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitiza HTML básico — permite formatação inline e links.
 * Usar para conteúdo de usuário simples (comentários, bio, etc.)
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "ul", "ol", "li", "p", "br", "span"],
    ALLOWED_ATTR: ["href", "target", "rel", "class"],
    FORCE_BODY: true,
    // Garante rel="noopener noreferrer" em todos os links externos
    ADD_ATTR: ["target"],
  });
}

/**
 * Sanitiza HTML rico — para conteúdo do Tiptap/WYSIWYG.
 * Permite mais tags mas bloqueia scripts e event handlers.
 */
export function sanitizeRichText(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "b",
      "i",
      "em",
      "strong",
      "u",
      "s",
      "mark",
      "a",
      "ul",
      "ol",
      "li",
      "p",
      "br",
      "span",
      "div",
      "blockquote",
      "code",
      "pre",
      "img",
      "figure",
      "figcaption",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
      "sub",
      "sup",
    ],
    ALLOWED_ATTR: ["href", "target", "rel", "class", "src", "alt", "width", "height", "style"],
    FORBID_TAGS: ["script", "iframe", "object", "embed", "form", "input"],
    FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover", "onfocus", "onblur"],
  });
}

/**
 * Remove TODO HTML — retorna apenas texto puro.
 * Usar quando HTML não é permitido.
 */
export function sanitizeStrict(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
}
