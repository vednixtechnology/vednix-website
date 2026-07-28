import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  LinkIcon,
  ImageIcon,
  Undo,
  Redo,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  onRequestImageUpload: () => Promise<string | null>;
}

export function RichTextEditor({
  value,
  onChange,
  onRequestImageUpload,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({}),
      Image,
      Link.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({
        placeholder: "Write your article...",
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "prose prose-sm md:prose-base max-w-none focus:outline-none min-h-[320px] px-4 py-3",
      },
    },
  });

  if (!editor) return null;

  const toolbarButton = (
    active: boolean,
    onClick: () => void,
    icon: React.ReactNode,
    label: string,
  ) => (
    <button
      type="button"
      title={label}
      onClick={onClick}
      className={cn(
        "grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground",
        active && "bg-muted text-foreground",
      )}
    >
      {icon}
    </button>
  );

  async function handleInsertImage() {
    const url = await onRequestImageUpload();
    if (url) editor?.chain().focus().setImage({ src: url }).run();
  }

  function handleSetLink() {
    const previousUrl = editor?.getAttributes("link").href as
      | string
      | undefined;
    const url = window.prompt("Link URL", previousUrl ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor
      ?.chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  }

  return (
    <div className="overflow-hidden rounded-lg border border-input">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-input bg-muted/40 px-2 py-1.5">
        {toolbarButton(
          editor.isActive("bold"),
          () => editor.chain().focus().toggleBold().run(),
          <Bold className="h-4 w-4" />,
          "Bold",
        )}
        {toolbarButton(
          editor.isActive("italic"),
          () => editor.chain().focus().toggleItalic().run(),
          <Italic className="h-4 w-4" />,
          "Italic",
        )}
        {toolbarButton(
          editor.isActive("strike"),
          () => editor.chain().focus().toggleStrike().run(),
          <Strikethrough className="h-4 w-4" />,
          "Strikethrough",
        )}
        <div className="mx-1 h-5 w-px bg-border" />
        {toolbarButton(
          editor.isActive("heading", { level: 2 }),
          () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
          <Heading2 className="h-4 w-4" />,
          "Heading 2",
        )}
        {toolbarButton(
          editor.isActive("heading", { level: 3 }),
          () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
          <Heading3 className="h-4 w-4" />,
          "Heading 3",
        )}
        <div className="mx-1 h-5 w-px bg-border" />
        {toolbarButton(
          editor.isActive("bulletList"),
          () => editor.chain().focus().toggleBulletList().run(),
          <List className="h-4 w-4" />,
          "Bullet list",
        )}
        {toolbarButton(
          editor.isActive("orderedList"),
          () => editor.chain().focus().toggleOrderedList().run(),
          <ListOrdered className="h-4 w-4" />,
          "Numbered list",
        )}
        {toolbarButton(
          editor.isActive("blockquote"),
          () => editor.chain().focus().toggleBlockquote().run(),
          <Quote className="h-4 w-4" />,
          "Quote",
        )}
        <div className="mx-1 h-5 w-px bg-border" />
        {toolbarButton(
          editor.isActive("link"),
          handleSetLink,
          <LinkIcon className="h-4 w-4" />,
          "Link",
        )}
        {toolbarButton(
          false,
          handleInsertImage,
          <ImageIcon className="h-4 w-4" />,
          "Insert image",
        )}
        <div className="mx-1 h-5 w-px bg-border" />
        {toolbarButton(
          false,
          () => editor.chain().focus().undo().run(),
          <Undo className="h-4 w-4" />,
          "Undo",
        )}
        {toolbarButton(
          false,
          () => editor.chain().focus().redo().run(),
          <Redo className="h-4 w-4" />,
          "Redo",
        )}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
