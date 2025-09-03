import React, { useState, useEffect } from "react";
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
  CodeBracketSquareIcon,
  CodeBracketIcon,
  ListBulletIcon,
} from "@heroicons/react/24/solid";

import LanguageSelector from "./LanguageSelector";
import ToolbarButton from "./ToolbarButton"; // Updated import

export const MenuBar = ({ editor }) => {
  const [_, setTick] = useState(0);

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
      // Convert codeblock back to paragraphs
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
      }
      return;
    }

    // Convert selection to codeblock
    const { from, to, empty } = editor.state.selection;

    if (empty) {
      // No selection, just toggle codeblock
      editor.chain().focus().toggleCodeBlock().run();
      return;
    }

    // Get the selected text preserving line breaks
    const text = editor.state.doc.textBetween(from, to, "\n");

    if (text) {
      // Simply replace the selection with a codeblock containing the text
      editor
        .chain()
        .focus()
        .deleteRange({ from, to })
        .insertContent({
          type: "codeBlock",
          content: [{ type: "text", text: text }],
        })
        .run();
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

  const buttonGroups = [
    // Font size group
    {
      name: "font-size",
      buttons: [
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
          icon: <span className="font-bold text-xs">A+</span>,
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
          icon: <span className="font-bold text-xs">A-</span>,
        },
      ],
    },
    // Text formatting group
    {
      name: "text-formatting",
      buttons: [
        {
          name: "Bold",
          action: () => applyMarkWithTrim("Bold"),
          isActive: "bold",
          can: () => editor.can().toggleBold(),
          icon: <BoldIcon className="h-4 w-4" />,
        },
        {
          name: "Italic",
          action: () => applyMarkWithTrim("Italic"),
          isActive: "italic",
          can: () => editor.can().toggleItalic(),
          icon: <ItalicIcon className="h-4 w-4" />,
        },
        {
          name: "Underline",
          action: () => applyMarkWithTrim("Underline"),
          isActive: "underline",
          can: () => editor.can().toggleUnderline(),
          icon: <UnderlineIcon className="h-4 w-4" />,
        },
        {
          name: "Strike",
          action: () => applyMarkWithTrim("Strike"),
          isActive: "strike",
          can: () => editor.can().toggleStrike(),
          icon: <StrikethroughIcon className="h-4 w-4" />,
        },
      ],
    },
    // Lists group
    {
      name: "lists",
      buttons: [
        {
          name: "Bullet List",
          action: () => editor.chain().focus().toggleBulletList().run(),
          isActive: "bulletList",
          can: () => editor.can().toggleBulletList(),
          icon: <ListBulletIcon className="h-4 w-4" />,
        },
        {
          name: "Ordered List",
          action: () => editor.chain().focus().toggleOrderedList().run(),
          isActive: "orderedList",
          can: () => editor.can().toggleOrderedList(),
          icon: (
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 16 16">
              <path d="M2.003 2.5a.5.5 0 0 0-.723-.447l-1.003.5a.5.5 0 0 0 .446.895l.28-.14V6H.5a.5.5 0 0 0 0 1h2.006a.5.5 0 1 0 0-1h-.503V2.5zM5 7a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 5 7zm0-3a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 5 4z" />
              <path d="M1.713 11.865v-.474H2c.217 0 .363-.137.363-.317 0-.185-.158-.31-.361-.31-.223 0-.367.152-.373.31h-.59c.016-.467.373-.787.986-.787.588-.002.954.291.957.703a.595.595 0 0 1-.492.594v.033a.615.615 0 0 1 .569.631c.003.533-.502.8-1.051.8-.656 0-1-.37-1.008-.794h.582c.008.178.186.306.422.309.254 0 .424-.145.422-.35-.002-.195-.155-.348-.414-.348h-.3zm-.004-4.699h-.604v-.035c0-.408.295-.844.958-.844.583 0 .96.326.96.756 0 .389-.257.617-.476.848l-.537.572v.03h1.054V9H1.143v-.395l.957-.99c.138-.142.293-.304.293-.508 0-.18-.147-.32-.342-.32a.33.33 0 0 0-.342.338v.041zM5 10.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5z" />
            </svg>
          ),
        },
      ],
    },
    // Code group
    {
      name: "code",
      buttons: [
        {
          name: "Inline Code",
          action: () => applyMarkWithTrim("InlineCode"),
          isActive: "inlineCode",
          can: () => editor.can().toggleInlineCode(),
          icon: <CodeBracketIcon className="h-4 w-4" />,
        },
        {
          name: "Code Block",
          action: handleCodeBlock,
          isActive: "codeBlock",
          can: () => editor.can().toggleCodeBlock(),
          icon: <CodeBracketSquareIcon className="h-4 w-4" />,
        },
      ],
    },
  ];

  const getCurrentCodeBlockLanguage = () => {
    if (!editor.isActive("codeBlock")) return null;

    const { $from } = editor.state.selection;
    for (let d = $from.depth; d > 0; d--) {
      const node = $from.node(d);
      if (node.type.name === "codeBlock") {
        return node.attrs.language || "plaintext";
      }
    }
    return "plaintext";
  };

  return (
    <>
      <div className="border-b border-gray-300 dark:border-gray-600 p-3 flex flex-wrap gap-1 items-center">
        {buttonGroups.map((group, groupIndex) => (
          <React.Fragment key={group.name}>
            <div className="flex gap-1">
              {group.buttons.map((button) => (
                <ToolbarButton
                  editor={editor}
                  key={button.name}
                  onClick={button.action}
                  isActive={
                    button.isActive ? editor.isActive(button.isActive) : false
                  }
                  tooltip={button.name}
                  disabled={
                    (editor.isActive("codeBlock") &&
                      group.name !== "code" &&
                      button.name !== "Code Block") ||
                    (button.can ? !button.can() : false)
                  }
                >
                  {button.icon}
                </ToolbarButton>
              ))}
            </div>
            {groupIndex < buttonGroups.length - 1 && (
              <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
            )}
          </React.Fragment>
        ))}

        {editor.isActive("codeBlock") && (
          <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-300 dark:border-gray-600">
            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium hidden sm:inline">
              Language:
            </span>
            <LanguageSelector
              editor={editor}
              currentLanguage={getCurrentCodeBlockLanguage()}
            />
          </div>
        )}
      </div>
    </>
  );
};
