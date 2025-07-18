import React, { useState, useEffect } from "react";
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
  CodeBracketSquareIcon,
  CodeBracketIcon,
} from "@heroicons/react/24/solid";

const ToolbarButton = ({
  editor,
  onClick,
  disabled,
  isActive,
  tooltip,
  children,
}) => (
  <div className="relative flex items-center">
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${
        editor.isEditable ? "" : "pointer-events-none"
      } peer h-8 p-2 flex items-center justify-center rounded cursor-pointer ${
        isActive
          ? "bg-indigo-500 text-white"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-auto p-2 min-w-max rounded-md shadow-md text-white bg-gray-900 text-xs font-bold transition-all duration-100 scale-0 peer-hover:scale-100 origin-bottom z-20">
      {tooltip}
    </div>
  </div>
);

export const MenuBar = ({ editor }) => {
  const [_, setTick] = useState(0);
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);

  useEffect(() => {
    if (!editor) return;

    const update = () => setTick((tick) => tick + 1);

    editor.on("transaction", update);
    return () => editor.off("transaction", update);
  }, [editor]);

  if (!editor) {
    return null;
  }

  const applyMarkWithTrim = (markName) => {
    const { state } = editor;
    const { from, to, empty } = state.selection;

    if (empty) {
      editor.chain().focus()[`toggle${markName}`]().run();
      return;
    }

    const selectedText = state.doc.textBetween(from, to);
    const leadingWhitespace = selectedText.match(/^\s*/)[0].length;
    const trailingWhitespace = selectedText.match(/\s*$/)[0].length;

    const newFrom = from + leadingWhitespace;
    const newTo = to - trailingWhitespace;

    if (newFrom >= newTo) {
      return;
    }

    editor
      .chain()
      .focus()
      .setTextSelection({ from: newFrom, to: newTo })
      [`toggle${markName}`]()
      .run();
  };

  const handleCodeBlock = () => {
    if (editor.isActive("codeBlock")) {
      const { $from } = editor.state.selection;
      let codeBlockNode = null;
      let codeBlockPos = -1;

      for (let d = $from.depth; d > 0; d--) {
        const node = $from.node(d);
        if (node.type.name === "codeBlock") {
          codeBlockNode = node;
          codeBlockPos = $from.before(d);
          break;
        }
      }

      if (codeBlockNode) {
        const lines = codeBlockNode.textContent.split("\n");
        const paragraphs = lines.map((line) => ({
          type: "paragraph",
          content: line ? [{ type: "text", text: line }] : [],
        }));

        editor
          .chain()
          .focus()
          .deleteRange({
            from: codeBlockPos,
            to: codeBlockPos + codeBlockNode.nodeSize,
          })
          .insertContent(paragraphs)
          .run();
      } else {
        editor.chain().focus().toggleCodeBlock().run();
      }
      return;
    }

    const { from, to } = editor.state.selection;
    const text = editor.state.doc.textBetween(from, to, "\n");

    if (text) {
      editor
        .chain()
        .focus()
        .deleteRange({ from, to })
        .insertContent({
          type: "codeBlock",
          content: [{ type: "text", text: text }],
        })
        .run();
    } else {
      editor.chain().focus().toggleCodeBlock().run();
      n;
    }
  };

  const fontSizes = [
    "12px",
    "16px",
    "20px",
    "24px",
    "28px",
    "32px",
    "36px",
    "40px",
    "44px",
    "48px",
  ];

  const buttons = [
    {
      name: "Increase Font",
      action: () => {
        const currentSize =
          editor.getAttributes("textStyle").fontSize || "20px";
        const currentIndex = fontSizes.indexOf(currentSize);
        const nextSize =
          fontSizes[Math.min(currentIndex + 1, fontSizes.length - 1)];
        editor.chain().focus().setFontSize(nextSize).run();
      },
      can: () => {
        const currentSize =
          editor.getAttributes("textStyle").fontSize || "20px";
        return currentSize !== fontSizes[fontSizes.length - 1];
      },
      icon: <span className="font-bold">A+</span>,
    },
    {
      name: "Decrease Font",
      action: () => {
        const currentSize =
          editor.getAttributes("textStyle").fontSize || "20px";
        const currentIndex = fontSizes.indexOf(currentSize);
        const prevSize = fontSizes[Math.max(currentIndex - 1, 0)];
        editor.chain().focus().setFontSize(prevSize).run();
      },
      can: () => {
        const currentSize =
          editor.getAttributes("textStyle").fontSize || "20px";
        return currentSize !== fontSizes[0];
      },
      icon: <span className="font-bold">A-</span>,
    },
    {
      name: "Bold",
      action: () => applyMarkWithTrim("Bold"),
      isActive: "bold",
      can: () => editor.can().toggleBold(),
      icon: <BoldIcon className="h-5 w-5" />,
    },
    {
      name: "Italic",
      action: () => applyMarkWithTrim("Italic"),
      isActive: "italic",
      can: () => editor.can().toggleItalic(),
      icon: <ItalicIcon className="h-5 w-5" />,
    },
    {
      name: "Underline",
      action: () => applyMarkWithTrim("Underline"),
      isActive: "underline",
      can: () => editor.can().toggleUnderline(),
      icon: <UnderlineIcon className="h-5 w-5" />,
    },
    {
      name: "Strike",
      action: () => applyMarkWithTrim("Strike"),
      isActive: "strike",
      can: () => editor.can().toggleStrike(),
      icon: <StrikethroughIcon className="h-5 w-5" />,
    },
    {
      name: "Inline Code",
      action: () => applyMarkWithTrim("InlineCode"),
      isActive: "inlineCode",
      can: () => editor.can().toggleInlineCode(),
      icon: <CodeBracketIcon className="h-5 w-5" />,
    },
    {
      name: "Code Block",
      action: handleCodeBlock,
      isActive: "codeBlock",
      can: () => editor.can().toggleCodeBlock(),
      icon: <CodeBracketSquareIcon className="h-5 w-5" />,
    },
  ];

  return (
    <>
      <div className="border-b border-gray-300 dark:border-gray-600 p-2 flex flex-wrap gap-2">
        {buttons.map((button) => (
          <ToolbarButton
            editor={editor}
            key={button.name}
            onClick={button.action}
            isActive={
              button.isActive ? editor.isActive(button.isActive) : false
            }
            tooltip={button.name}
            disabled={
              (editor.isActive("codeBlock") && button.name !== "Code Block") ||
              button.can
                ? !button.can()
                : false
            }
          >
            {button.icon}
          </ToolbarButton>
        ))}
      </div>
    </>
  );
};
