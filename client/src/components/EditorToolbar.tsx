import type { Editor } from "@tiptap/react";

import {
    Bold,
    Italic,
    Underline,
    Heading1,
    Heading2,
    List,
    ListOrdered,
    Quote,
    Undo2,
    Redo2,
    ImagePlus,
} from "lucide-react";

type Props = {
    editor: Editor | null;
};

export default function EditorToolbar({ editor }: Props) {

    if (!editor) return null;

    const buttonClass = (active: boolean) =>
        `rounded-lg p-2 transition
        ${active
            ? "bg-orange-500 text-white"
            : "hover:bg-gray-200 dark:hover:bg-zinc-700"
        }`;

    const API_BASE_URL =
        import.meta.env.VITE_API_URL || "https://vedict-match.onrender.com";


    async function uploadImage(file: File) {
        const data = new FormData();
        data.append("image", file);

        const res = await fetch(
            `${API_BASE_URL}/api/upload/upload`,
            {
                method: "POST",
                body: data,
            }
        );

        const json = await res.json();

        return json.url.startsWith("http")
            ? json.url
            : `${API_BASE_URL}${json.url}`;
    }

    async function handleInsertImage() {
        const input = document.createElement("input");

        input.type = "file";

        input.accept = "image/*";

        input.click();

        input.onchange = async () => {
            const file = input.files?.[0];

            if (!file) return;

            const url = await uploadImage(file);

            editor
                ?.chain()
                .focus()
                .setImage({
                    src: url,
                })
                .run();
        };
    }

    return (
        <div className="sticky top-0 z-10 flex flex-wrap items-center gap-2 border-b bg-white p-3 dark:bg-zinc-900">

            <button
                type="button"
                className={buttonClass(editor.isActive("bold"))}
                onClick={() => editor.chain().focus().toggleBold().run()}
            >
                <Bold size={18} />
            </button>

            <button
                type="button"
                className={buttonClass(editor.isActive("italic"))}
                onClick={() => editor.chain().focus().toggleItalic().run()}
            >
                <Italic size={18} />
            </button>

            <button
                type="button"
                className={buttonClass(editor.isActive("underline"))}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
                <Underline size={18} />
            </button>

            <button
                type="button"
                className={buttonClass(
                    editor.isActive("heading", { level: 1 })
                )}
                onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 1 }).run()
                }
            >
                <Heading1 size={18} />
            </button>

            <button
                type="button"
                className={buttonClass(
                    editor.isActive("heading", { level: 2 })
                )}
                onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
            >
                <Heading2 size={18} />
            </button>

            <button
                type="button"
                className={buttonClass(editor.isActive("bulletList"))}
                onClick={() =>
                    editor.chain().focus().toggleBulletList().run()
                }
            >
                <List size={18} />
            </button>

            <button
                type="button"
                className={buttonClass(editor.isActive("orderedList"))}
                onClick={() =>
                    editor.chain().focus().toggleOrderedList().run()
                }
            >
                <ListOrdered size={18} />
            </button>

            <button
                type="button"
                className={buttonClass(editor.isActive("blockquote"))}
                onClick={() =>
                    editor.chain().focus().toggleBlockquote().run()
                }
            >
                <Quote size={18} />
            </button>

            <button
                type="button"
                className="rounded-lg p-2 hover:bg-gray-200 dark:hover:bg-zinc-700"
                onClick={() => editor.chain().focus().undo().run()}
            >
                <Undo2 size={18} />
            </button>

            <button
                type="button"
                className="rounded-lg p-2 hover:bg-gray-200 dark:hover:bg-zinc-700"
                onClick={() => editor.chain().focus().redo().run()}
            >
                <Redo2 size={18} />
            </button>

            <button
                type="button"
                onClick={handleInsertImage}
                className="rounded-lg p-2 hover:bg-gray-200 dark:hover:bg-zinc-700"
            >
                <ImagePlus size={18} />
            </button>

        </div>
    );
}