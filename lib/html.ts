import sanitizeHtml from 'sanitize-html';

const allowedTags = [
  'p',
  'br',
  'strong',
  'b',
  'em',
  'i',
  'u',
  's',
  'blockquote',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'ul',
  'ol',
  'li',
  'a',
  'img',
  'code',
  'pre',
  'hr',
  'span',
  'div',
  'section',
  'article',
  'header',
  'footer',
  'nav',
  'aside',
  'main',
  'table',
  'thead',
  'tbody',
  'tfoot',
  'tr',
  'th',
  'td',
  'caption',
];

const allowedAttributes: sanitizeHtml.IOptions['allowedAttributes'] = {
  a: ['href', 'name', 'target', 'rel', 'title'],
  img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
  '*': ['style', 'class', 'id'],
};

// Whitelist safe CSS properties only - prevents XSS via CSS injection
const allowedStyles: sanitizeHtml.IOptions['allowedStyles'] = {
  '*': {
    // Safe color values only (no javascript: URIs, no arbitrary values)
    color: [/^#[0-9a-fA-F]{3,8}$/, /^rgb(a)?\(\s*\d+\s*,\s*\d+\s*,\s*\d+/, /^hsl(a)?\(\s*\d+/, /^(red|blue|green|black|white|gray|transparent)$/i],
    'background-color': [/^#[0-9a-fA-F]{3,8}$/, /^rgb(a)?\(\s*\d+\s*,\s*\d+\s*,\s*\d+/, /^hsl(a)?\(\s*\d+/, /^(red|blue|green|black|white|gray|transparent)$/i],
    background: [/^#[0-9a-fA-F]{3,8}$/, /^rgb(a)?\(\s*\d+\s*,\s*\d+\s*,\s*\d+/, /^hsl(a)?\(\s*\d+/, /^(red|blue|green|black|white|gray|transparent)$/i],
    // Text styling only - safe properties
    'text-align': [/^(left|right|center|justify)$/],
    'font-size': [/^\d+(\.\d+)?(px|rem|em|%)$/],
    'font-weight': [/^(normal|bold|[1-9]00)$/],
    'font-style': [/^(normal|italic|oblique)$/],
    'text-decoration': [/^(none|underline|overline|line-through)$/],
    'text-transform': [/^(none|uppercase|lowercase|capitalize)$/],
    'line-height': [/^(normal|\d+(\.\d+)?(px|rem|em|%)?)$/],
    'letter-spacing': [/^\d+(\.\d+)?(px|em|rem)$/],
    // Margin and padding - safe numeric values only (including negative values and auto/inherit)
    margin: [/^(-?\d+(\.\d+)?(px|rem|em|%)|auto|inherit)(\s+(-?\d+(\.\d+)?(px|rem|em|%)|auto|inherit)){0,3}$/],
    padding: [/^\d+(\.\d+)?(px|rem|em|%|auto|inherit)(\s+\d+(\.\d+)?(px|rem|em|%|auto|inherit)){0,3}$/],
    'margin-top': [/^(-?\d+(\.\d+)?(px|rem|em|%)|auto|inherit)$/],
    'margin-right': [/^(-?\d+(\.\d+)?(px|rem|em|%)|auto|inherit)$/],
    'margin-bottom': [/^(-?\d+(\.\d+)?(px|rem|em|%)|auto|inherit)$/],
    'margin-left': [/^(-?\d+(\.\d+)?(px|rem|em|%)|auto|inherit)$/],
    'padding-top': [/^\d+(\.\d+)?(px|rem|em|%|auto|inherit)$/],
    'padding-right': [/^\d+(\.\d+)?(px|rem|em|%|auto|inherit)$/],
    'padding-bottom': [/^\d+(\.\d+)?(px|rem|em|%|auto|inherit)$/],
    'padding-left': [/^\d+(\.\d+)?(px|rem|em|%|auto|inherit)$/],
    // Sizing - safe numeric values
    width: [/^\d+(\.\d+)?(px|rem|em|%|auto)$/],
    height: [/^\d+(\.\d+)?(px|rem|em|%|auto)$/],
    'min-width': [/^\d+(\.\d+)?(px|rem|em|%)$/],
    'min-height': [/^\d+(\.\d+)?(px|rem|em|%)$/],
    'max-width': [/^\d+(\.\d+)?(px|rem|em|%)$/],
    'max-height': [/^\d+(\.\d+)?(px|rem|em|%)$/],
    // Border styling - safe values
    border: [/^\d+(\.\d+)?(px|rem|em)\s+(solid|dashed|dotted|double)\s+#[0-9a-fA-F]{3,8}$/],
    'border-width': [/^\d+(\.\d+)?(px|rem|em)(\s+\d+(\.\d+)?(px|rem|em)){0,3}$/],
    'border-radius': [/^\d+(\.\d+)?(px|rem|em|%)(\s+\d+(\.\d+)?(px|rem|em|%))?(\s+\d+(\.\d+)?(px|rem|em|%))?(\s+\d+(\.\d+)?(px|rem|em|%))?$/],
    // Opacity - safe numeric
    opacity: [/^(0|0\.\d+|1)$/],
    // Display - safe values only
    display: [/^(block|inline|inline-block|flex|grid|none)$/],
    // Flexbox alignment properties
    'align-items': [/^(flex-start|flex-end|center|stretch|baseline|space-between|space-around)$/],
    'justify-content': [/^(flex-start|flex-end|center|space-between|space-around|space-evenly)$/],
    'flex-direction': [/^(row|column|row-reverse|column-reverse)$/],
    'flex-wrap': [/^(nowrap|wrap|wrap-reverse)$/],
    gap: [/^\d+(\.\d+)?(px|rem|em|%)$/],
    'row-gap': [/^\d+(\.\d+)?(px|rem|em|%)$/],
    'column-gap': [/^\d+(\.\d+)?(px|rem|em|%)$/],
    // Overflow properties
    overflow: [/^(visible|hidden|clip|scroll|auto)$/],
    'overflow-x': [/^(visible|hidden|clip|scroll|auto)$/],
    'overflow-y': [/^(visible|hidden|clip|scroll|auto)$/],
  },
};

export function sanitizeBlogHtml(html: string): string {
  if (!html) return '';

  return sanitizeHtml(html, {
    allowedTags,
    allowedAttributes,
    allowedStyles,
    allowedSchemes: ['http', 'https', 'mailto'],
    allowedSchemesByTag: {
      img: ['http', 'https'],
    },
    transformTags: {
      a: (tagName, attribs) => {
        const target = attribs.target || undefined;
        return {
          tagName,
          attribs: {
            ...attribs,
            rel: 'noopener noreferrer',
            ...(target === '_blank' ? { target: '_blank' } : {}),
          },
        };
      },
    },
    parser: {
      lowerCaseTags: true,
      lowerCaseAttributeNames: true,
    },
  });
}

export function stripHtmlTags(html: string): string {
  if (!html) return '';
  // Use sanitize-html to remove all tags but preserve text content
  return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} }).trim();
}
