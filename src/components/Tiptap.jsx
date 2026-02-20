import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";

const Tiptap = ({ fun }) => {
	const [showBtn, setShowBtn] = useState(true);
	const editor = useEditor({
		extensions: [StarterKit],
		content: "My article is...",
		onUpdate({editor}){
			const state = editor.isEmpty;
			setShowBtn(state)
		},
	});

	if (!editor) return null;

	function handleData() {
		const html = editor.getHTML();

		fun(html);
	}

	return (
		<div>
			<div className=" max-h-[90vh] pb-1 pl-1 relative ">
				<EditorContent
					className="outline-0 overflow-y-auto overflow-x-clip  *:outline-0 pb-6 pl-2 *:required:true"
					editor={editor}
					
				/>
				<div className="flex flex-row justify-between mr-1 sticky bottom-0">
					<div className="bg-gray-300 w-fit wrap-anywhere rounded-4xl px-2  *:mx-1 flex *:wrap-break-word">
						<button
							type="button"
							onClick={() => {
								event.preventDefault();
								return editor.chain().focus().toggleBold().run();
							}}
							disabled={!editor.can().chain().focus().toggleBold().run()}
							className={`font-bold`}>
							Bold
						</button>

						<button
							type="button"
							onClick={() => editor.chain().focus().toggleItalic().run()}
							className="italic">
							Italic
						</button>

						<button
							type="button"
							onClick={() =>
								editor.chain().focus().toggleHeading({ level: 1 }).run()
							}>
							H1
						</button>

						<button
							type="button"
							onClick={() => editor.chain().focus().toggleBulletList().run()}>
							&bull;Bullet-List
						</button>

						<button
							type="button"
							onClick={() => editor.chain().focus().undo().run()}>
							↩️
						</button>

						<button
							type="button"
							onClick={() => editor.chain().focus().redo().run()}>
							↪️
						</button>
					</div>{" "}
					<div>
						<button
							className="bg-blue-600 w-fit  px-4 py-2 text-white rounded-4xl border-0 cursor-pointer disabled:bg-red-400"
							hidden={showBtn}
							type="button"
							onClick={handleData}>
							Done?
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Tiptap;
