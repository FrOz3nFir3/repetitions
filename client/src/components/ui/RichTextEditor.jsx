import React, { useImperativeHandle, forwardRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { FontSize, TextStyle } from "@tiptap/extension-text-style";

import { MenuBar } from "./RichTextEditor/MenuBar";
import { CustomCodeBlock, InlineCode } from "./RichTextEditor/extensions";

const RichTextEditor = forwardRef(
  ({ initialContent, onChange, editable, className = "" }, ref) => {
    const editor = useEditor({
      extensions: [
        StarterKit.configure({
          codeBlock: false,
        }),
        TextStyle,
        FontSize,
        InlineCode,
        CustomCodeBlock,
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
            "prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl focus:outline-none max-w-none prose-ul:list-disc prose-ul:pl-6 prose-ol:list-decimal prose-ol:pl-6 prose-li:my-0",
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

    const handleClick = (e) => {
      if (e.target === e.currentTarget && editor && !editor.isFocused) {
        editor.commands.focus("end");
      }
    };

    return (
      <div
        className={`${
          editable ? "" : " !bg-gray-100 dark:!bg-gray-500"
        } break-word custom-rich-text-editor bg-white dark:bg-gray-700 dark:text-white flex flex-col w-full mt-1 rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 max-h-96 ${className}`}
      >
        <MenuBar editor={editor} />
        <div className="p-4 overflow-y-auto cursor-text" onClick={handleClick}>
          <EditorContent editor={editor} />
        </div>
      </div>
    );
  }
);

export default RichTextEditor;
