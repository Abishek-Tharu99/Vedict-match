import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

type Props = {
    value: string;
    onChange: (html: string) => void;
};

export default function TiptapEditor({ value, onChange }: Props) {
    const editor = useEditor({
        extensions: [StarterKit],
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

    // useEffect(() => {
    //     if (editor && editor.getHTML() !== value) {
    //         editor.commands.setContent(value);
    //     }
    // }, [value, editor]);

    return (

        <div className="w-full rounded-xl border">
            <EditorContent
                editor={editor}
            // className="min-h-[300px] h-full w-full border-none overflow-y-auto focus:outline-none"
            />
        </div>

    );
}