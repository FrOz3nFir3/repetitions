import React, { useImperativeHandle, forwardRef, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import "highlight.js/styles/atom-one-dark.css";
import { FontSize, TextStyle } from "@tiptap/extension-text-style";

import { MenuBar } from "./RichTextEditor/MenuBar";
import {
  CustomKeyboardShortcuts,
  CustomCodeBlock,
  lowlight,
} from "./RichTextEditor/extensions";

const RichTextEditor = forwardRef(
  ({ initialContent, onChange, editable }, ref) => {
    const editor = useEditor({
      extensions: [
        StarterKit.configure({
          codeBlock: false, // Disable default to use our custom one
          paragraph: {
            HTMLAttributes: {
              style: "white-space: pre-wrap",
            },
          },
        }),
        Underline,
        TextStyle,
        FontSize,
        CustomCodeBlock.configure({
          lowlight,
        }),
        CustomKeyboardShortcuts,
      ],
      content: initialContent || "",
      onUpdate: ({ editor }) => {
        if (onChange) {
          onChange(editor.getHTML());
        }
      },
      editable,
      editorProps: {
        attributes: {
          class:
            "prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none min-h-[100px]",
        },
      },
    });

    useImperativeHandle(ref, () => ({
      focus: () => {
        editor?.commands.focus();
      },
      clearContent: () => {
        editor?.commands.clearContent();
      },
    }));

    return (
      <div
        className={`${
          editable
            ? ""
            : "pointer-events-none cursor-not-allowed bg-gray-200 dark:bg-gray-600"
        } custom-rich-text-editor bg-white dark:bg-gray-700 dark:text-white block w-full mt-1 rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500`}
      >
        <MenuBar editor={editor} />
        <EditorContent editor={editor} />
      </div>
    );
  }
);

export default RichTextEditor;
