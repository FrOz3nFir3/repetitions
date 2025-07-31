import { Extension, Mark } from "@tiptap/core";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight, common } from "lowlight";
import { createLanguageLabel } from "../../../utils/syntax-languages";

export const lowlight = createLowlight(common);

export const InlineCode = Mark.create({
  name: "inlineCode",

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  parseHTML() {
    return [
      {
        tag: "span.inline-code",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      {
        ...this.options.HTMLAttributes,
        ...HTMLAttributes,
        class: "inline-code",
      },
      0,
    ];
  },

  addCommands() {
    return {
      toggleInlineCode:
        () =>
        ({ commands }) => {
          return commands.toggleMark(this.name);
        },
    };
  },
});

export const CustomKeyboardShortcuts = Extension.create({
  name: "customKeyboardShortcuts",

  addKeyboardShortcuts() {
    return {
      Tab: () => {
        if (this.editor.isActive("listItem")) {
          return this.editor.commands.sinkListItem("listItem");
        }
        return this.editor.commands.insertContent("  ");
      },
      "Shift-Tab": () => {
        if (this.editor.isActive("listItem")) {
          return this.editor.commands.liftListItem("listItem");
        }
        return false;
      },
      Enter: () => {
        if (!this.editor.isActive("codeBlock")) {
          return false;
        }

        const { state } = this.editor;
        const { selection } = state;
        const { $from } = selection;

        const node = $from.parent;
        if (node.type.name !== "codeBlock") return false;

        const nodeStart = $from.before();
        const text = node.textContent;
        const cursorPosInNode = $from.pos - nodeStart - 1;

        let lineStart = text.lastIndexOf("\n", cursorPosInNode - 1) + 1;
        const currentLine = text.substring(lineStart, cursorPosInNode);
        const match = /^(\s*)/.exec(currentLine);
        const indentation = match ? match[1] : "";

        return this.editor.commands.insertContent("\n" + indentation);
      },
    };
  },
});

// Available languages for syntax highlighting - dynamically generated from lowlight common languages
const commonList = Object.keys(common);

// here new languages can be added if necessary
const languagesList = [...commonList];

export const SUPPORTED_LANGUAGES = languagesList.sort().map((key) => ({
  value: key,
  label: createLanguageLabel(key),
}));

export const CustomCodeBlock = CodeBlockLowlight.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      language: {
        default: "plaintext",
        parseHTML: (element) => {
          // Check if this is a wrapper div with data-language
          if (element.hasAttribute("data-language")) {
            return element.getAttribute("data-language");
          }
          // Check if this is a pre element with data-language
          if (
            element.tagName === "PRE" &&
            element.hasAttribute("data-language")
          ) {
            return element.getAttribute("data-language");
          }
          // Look for data-language in parent wrapper
          const wrapper = element.closest(".code-block-wrapper");
          if (wrapper && wrapper.hasAttribute("data-language")) {
            return wrapper.getAttribute("data-language");
          }
          return "plaintext";
        },
        renderHTML: (attributes) => {
          if (!attributes.language) {
            return {};
          }
          return {
            "data-language": attributes.language,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div.code-block-wrapper",
        preserveWhitespace: "full",
        contentElement: "pre code",
      },
      ...(this.parent?.() || []),
    ];
  },

  renderHTML({ HTMLAttributes, node }) {
    const language = node.attrs.language || "plaintext";
    const languageLabel =
      SUPPORTED_LANGUAGES.find((lang) => lang.value === language)?.label ||
      "Plain Text";

    return [
      "div",
      {
        class: "code-block-wrapper relative",
        "data-language": language,
      },
      [
        "div",
        {
          class:
            "code-block-header flex justify-between items-center px-3 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-600 text-sm text-gray-600 dark:text-gray-300",
        },
        ["span", { class: "language-label font-medium" }, languageLabel],
      ],
      [
        "pre",
        {
          ...HTMLAttributes,
          class: `${HTMLAttributes.class || ""} !mt-0 !rounded-t-none`,
        },
        ["code", 0],
      ],
    ];
  },

  addCommands() {
    return {
      ...this.parent?.(),
      setCodeBlockLanguage:
        (language) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, { language });
        },
    };
  },
}).configure({
  lowlight,
});
