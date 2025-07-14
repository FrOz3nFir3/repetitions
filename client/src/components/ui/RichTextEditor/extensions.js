import { Extension } from "@tiptap/core";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight, all } from "lowlight";

export const lowlight = createLowlight(all);

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

export const CustomCodeBlock = CodeBlockLowlight.extend({
  renderHTML({ HTMLAttributes, node }) {
    return [
      "div",
      { class: "code-block-wrapper" },
      ["pre", HTMLAttributes, ["code", 0]],
    ];
  },
});
