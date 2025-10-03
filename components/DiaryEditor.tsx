"use client";

import { useEditor, Editor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Youtube from "@tiptap/extension-youtube";
import Placeholder from "@tiptap/extension-placeholder";
import { useState } from "react";

export default function DiaryEditor({ onSave }: { onSave: (content: string) => void }) {
  const [html, setHtml] = useState("");

  const editor: Editor | null = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Image,
      Youtube,
      Placeholder.configure({
        placeholder: "ここに日記を書いてください…",
      }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      setHtml(editor.getHTML());
    },
  });

  // 複数ファイル対応
  const handleFileUpload = async (files: File[], type: "image" | "video") => {
    const formData = new FormData();
    for (const f of files) {
      formData.append("file", f);
    }
    formData.append("type", type);

    const res = await fetch("/api/uploadDiaryFile", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();

    if (type === "image") {
      data.urls.forEach((url: string) => {
        editor?.chain().focus().setImage({ src: url }).run();
      });
    } else {
      data.urls.forEach((url: string) => {
        editor
          ?.chain()
          .focus()
          .insertContent(
            `<video controls width="100%"><source src="${url}" type="video/mp4"></video>`
          )
          .run();
      });
    }
  };

  const handleImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true; // 複数OK
    input.onchange = (e: any) => handleFileUpload([...e.target.files], "image");
    input.click();
  };

  const handleVideo = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "video/*";
    input.multiple = true; // 複数OK
    input.onchange = (e: any) => handleFileUpload([...e.target.files], "video");
    input.click();
  };

  return (
    <div className="bg-white/90 rounded-xl shadow-lg p-6">
      <div className="border-b pb-2 mb-4 flex gap-2 flex-wrap">
        <button onClick={() => editor?.chain().focus().toggleBold().run()} className="px-2 py-1 bg-gray-200 rounded">B</button>
        <button onClick={() => editor?.chain().focus().toggleItalic().run()} className="px-2 py-1 bg-gray-200 rounded">I</button>
        <button onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} className="px-2 py-1 bg-gray-200 rounded">H2</button>
        <button onClick={() => editor?.chain().focus().toggleBulletList().run()} className="px-2 py-1 bg-gray-200 rounded">• List</button>
        <button onClick={handleImage} className="px-2 py-1 bg-gray-200 rounded">🖼️ 画像</button>
        <button onClick={handleVideo} className="px-2 py-1 bg-gray-200 rounded">🎥 動画</button>
      </div>

      <EditorContent editor={editor} className="min-h-[300px] prose prose-lg max-w-none" />

      <button
        onClick={() => onSave(html)}
        className="mt-4 px-4 py-2 bg-[#0042a1] text-white rounded hover:bg-[#003080]"
      >
        保存
      </button>
    </div>
  );
}
