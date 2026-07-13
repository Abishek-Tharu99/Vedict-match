import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";


import EditorToolbar from "./EditorToolbar";

type Props = {
    value: string;
    onChange: (html: string) => void;
};

export default function TiptapEditor({ value, onChange }: Props) {
    const editor = useEditor({
        extensions: [
            StarterKit,

            Highlight,

            Image,

            Link.configure({
                openOnClick: false,
            }),

            Placeholder.configure({
                placeholder: "Write your article here...",
            }),

            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
        ],
        content: value,

        onUpdate({ editor }) {
            onChange(editor.getHTML());
        },
    });
    useEffect(() => {
        if (!editor) return;

        if (editor.getHTML() !== value) {
            editor.commands.setContent(value);
        }
    }, [value, editor]);


    return (

        <div className="rounded-xl border bg-white dark:bg-zinc-900">

            
            <EditorToolbar editor={editor} />
           
            {/* Editor */}

            <EditorContent
                editor={editor}
                className="min-h-[400px] p-4"
            />

        </div>

    );
}