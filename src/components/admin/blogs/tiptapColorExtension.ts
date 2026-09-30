import { Mark, mergeAttributes } from "@tiptap/core";

export const ALLOWED_CMS_COLORS = [
  "emerald",
  "electric",
  "foreground",
  "muted",
] as const;

export type CmsColor = (typeof ALLOWED_CMS_COLORS)[number];

export const ALLOWED_CMS_HIGHLIGHTS = ["emerald", "electric"] as const;
export type CmsHighlight = (typeof ALLOWED_CMS_HIGHLIGHTS)[number];

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    cmsColor: {
      setCmsColor: (color: CmsColor) => ReturnType;
      unsetCmsColor: () => ReturnType;
    };
    cmsHighlight: {
      setCmsHighlight: (highlight: CmsHighlight) => ReturnType;
      unsetCmsHighlight: () => ReturnType;
    };
  }
}

export const CmsColorMark = Mark.create({
  name: "cmsColor",

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      color: {
        default: null,
        parseHTML: (element: HTMLElement) => {
          const className = element.getAttribute("class") || "";
          const match = className.match(
            /\bcms-color-(emerald|electric|foreground|muted)\b/,
          );
          return match ? match[1] : null;
        },
        renderHTML: (attributes: { color?: string }) => {
          if (
            !attributes.color ||
            !ALLOWED_CMS_COLORS.includes(attributes.color as CmsColor)
          ) {
            return {};
          }
          return {
            class: `cms-color-${attributes.color}`,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[class*="cms-color-"]',
        getAttrs: (element: HTMLElement | string) => {
          if (typeof element === "string") return false;
          const className = element.getAttribute("class") || "";
          const match = className.match(
            /\bcms-color-(emerald|electric|foreground|muted)\b/,
          );
          return match ? { color: match[1] } : false;
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },

  addCommands() {
    return {
      setCmsColor:
        (color: CmsColor) =>
        ({ chain }) => {
          if (!ALLOWED_CMS_COLORS.includes(color)) {
            return chain().unsetMark(this.name).run();
          }
          return chain().setMark(this.name, { color }).run();
        },
      unsetCmsColor:
        () =>
        ({ chain }) => {
          return chain().unsetMark(this.name).run();
        },
    };
  },
});

export const CmsHighlightMark = Mark.create({
  name: "cmsHighlight",

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      highlight: {
        default: null,
        parseHTML: (element: HTMLElement) => {
          const className = element.getAttribute("class") || "";
          const match = className.match(/\bcms-highlight-(emerald|electric)\b/);
          return match ? match[1] : null;
        },
        renderHTML: (attributes: { highlight?: string }) => {
          if (
            !attributes.highlight ||
            !ALLOWED_CMS_HIGHLIGHTS.includes(
              attributes.highlight as CmsHighlight,
            )
          ) {
            return {};
          }
          return {
            class: `cms-highlight-${attributes.highlight}`,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[class*="cms-highlight-"]',
        getAttrs: (element: HTMLElement | string) => {
          if (typeof element === "string") return false;
          const className = element.getAttribute("class") || "";
          const match = className.match(/\bcms-highlight-(emerald|electric)\b/);
          return match ? { highlight: match[1] } : false;
        },
      },
      {
        tag: 'mark[class*="cms-highlight-"]',
        getAttrs: (element: HTMLElement | string) => {
          if (typeof element === "string") return false;
          const className = element.getAttribute("class") || "";
          const match = className.match(/\bcms-highlight-(emerald|electric)\b/);
          return match ? { highlight: match[1] } : false;
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },

  addCommands() {
    return {
      setCmsHighlight:
        (highlight: CmsHighlight) =>
        ({ chain }) => {
          if (!ALLOWED_CMS_HIGHLIGHTS.includes(highlight)) {
            return chain().unsetMark(this.name).run();
          }
          return chain().setMark(this.name, { highlight }).run();
        },
      unsetCmsHighlight:
        () =>
        ({ chain }) => {
          return chain().unsetMark(this.name).run();
        },
    };
  },
});
