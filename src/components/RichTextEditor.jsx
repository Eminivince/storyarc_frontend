import LinkExtension from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import { EditorContent, useEditor } from "@tiptap/react";
import { useEffect } from "react";
import { normalizeRichTextBody } from "../editor/richText";
import "./RichTextEditor.css";

function ToolbarButton({ active = false, disabled = false, icon, label, onClick }) {
  return (
    <button
      aria-label={label}
      className={`flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 text-sm transition-colors ${
        active
          ? "border-primary bg-primary/15 text-primary"
          : "border-transparent text-slate-400 hover:border-primary/20 hover:bg-primary/10 hover:text-primary"
      } disabled:cursor-not-allowed disabled:opacity-40`}
      disabled={disabled}
      onClick={onClick}
      title={label}
      type="button"
    >
      <span className="material-symbols-outlined text-[18px]">{icon}</span>
    </button>
  );
}

export default function RichTextEditor({
  contentClassName = "",
  compact = false,
  editorClassName = "",
  onChange,
  placeholder,
  toolbarClassName = "",
  value,
}) {
  const normalizedValue = normalizeRichTextBody(value);
  const editor = useEditor({
    content: normalizedValue,
    editorProps: {
      attributes: {
        class: `chapter-rich-text-content outline-none [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_blockquote]:my-5 [&_blockquote]:border-l-4 [&_blockquote]:border-primary/40 [&_blockquote]:pl-4 [&_blockquote]:italic [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-black [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-bold [&_li]:my-1 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-4 [&_strong]:font-black [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 ${contentClassName}`.trim(),
      },
    },
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      LinkExtension.configure({
        HTMLAttributes: {
          rel: "noopener noreferrer nofollow",
          target: "_blank",
        },
        autolink: true,
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    onUpdate({ editor: nextEditor }) {
      onChange(nextEditor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    const currentHtml = editor.getHTML();

    if (currentHtml === normalizedValue) {
      return;
    }

    editor.commands.setContent(normalizedValue, false);
  }, [editor, normalizedValue]);

  function handleSetLink() {
    if (!editor || typeof globalThis.prompt !== "function") {
      return;
    }

    const currentHref = editor.getAttributes("link").href ?? "";
    const nextHref = globalThis.prompt("Enter a URL", currentHref);

    if (nextHref === null) {
      return;
    }

    const trimmedHref = nextHref.trim();

    if (!trimmedHref) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    const normalizedHref =
      /^(https?:\/\/|mailto:)/i.test(trimmedHref)
        ? trimmedHref
        : `https://${trimmedHref}`;

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: normalizedHref })
      .run();
  }

  return (
    <div className={`overflow-hidden rounded-2xl border ${editorClassName}`}>
      <div
        className={`flex flex-wrap items-center gap-1 border-b px-3 py-2 ${
          compact ? "sticky top-0 z-10" : ""
        } ${toolbarClassName}`}
      >
        <ToolbarButton
          active={Boolean(editor?.isActive("bold"))}
          disabled={!editor}
          icon="format_bold"
          label="Bold"
          onClick={() => editor?.chain().focus().toggleBold().run()}
        />
        <ToolbarButton
          active={Boolean(editor?.isActive("italic"))}
          disabled={!editor}
          icon="format_italic"
          label="Italic"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        />
        <ToolbarButton
          active={Boolean(editor?.isActive("heading", { level: 2 }))}
          disabled={!editor}
          icon="title"
          label="Heading"
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
        />
        <ToolbarButton
          active={Boolean(editor?.isActive("bulletList"))}
          disabled={!editor}
          icon="format_list_bulleted"
          label="Bulleted list"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        />
        <ToolbarButton
          active={Boolean(editor?.isActive("blockquote"))}
          disabled={!editor}
          icon="format_quote"
          label="Block quote"
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
        />
        <ToolbarButton
          active={Boolean(editor?.isActive("link"))}
          disabled={!editor}
          icon="link"
          label="Link"
          onClick={handleSetLink}
        />
        <div className="mx-1 h-5 w-px bg-white/10" />
        <ToolbarButton
          disabled={!editor?.can().chain().focus().undo().run()}
          icon="undo"
          label="Undo"
          onClick={() => editor?.chain().focus().undo().run()}
        />
        <ToolbarButton
          disabled={!editor?.can().chain().focus().redo().run()}
          icon="redo"
          label="Redo"
          onClick={() => editor?.chain().focus().redo().run()}
        />
      </div>

      <div className={compact ? "px-4 py-4" : "px-5 py-6"}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
