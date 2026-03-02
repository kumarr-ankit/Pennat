import React, { useContext, useState } from "react";
import Tiptap from "./Tiptap";
import { ArrowLeft, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { dataContext, userContext } from "../context/Context";
import supabase from "../config/supabaseClient";
import { toast } from "sonner";

function ArticleWriter({ setWriter }) {
	const [userInfo] = useContext(userContext);
	const user_id = userInfo?.user_id;
	const [, setArticlesData] = useContext(dataContext);

	const [html, setHtml] = useState("");
	const [title, setTitle] = useState("");

	const navigate = useNavigate();

	async function handleSubmit(e) {
		e.preventDefault();

		if (!title || !html) {
			toast("Title and content required");
			return;
		}

		const { data, error } = await supabase
			.from("ArticleTable")
			.insert({
				author_id: user_id,
				title: title,
				body: html,
			})
			.select();

		if (error) {
			console.error(error);
			toast("Something went wrong ❌");
			return;
		}

		if (data) {
			toast("Successfully Added ✅");
			setTitle("");
			setHtml("");

			let article = {
				title: title,
				body: html,
				UserTable: userInfo,
        preview : true
			};
			setArticlesData((p) => [...p, article]);
			//navigate("/home");
		}
	}

	return (
		<div
			id="modalForm"
			onClick={(e) => {
				let modalForm = document.getElementById("modalForm");
				let target = e.target;

				if (!modalForm.contains(target)) setWriter(false);
			}}
			className="fixed
	inset-0 z-50 flex items-center justify-center bg-black/50">
			<div className="relative w-[95%] max-w-4xl h-[90vh] bg-white dark:bg-[#0f1011] rounded-xl shadow-2xl flex flex-col">
				<form onSubmit={handleSubmit} className="flex flex-col h-full">
					<div className="flex items-center justify-between p-4 border-b">
						<div className="flex items-center gap-2">
							<ArrowLeft
								size={22}
								className="cursor-pointer hover:bg-gray-200 rounded-full p-1"
								onClick={() => navigate("/home")}
							/>
							<p className="text-lg font-semibold">Write Article</p>
						</div>

						<div>
							<X
								className="hover:cursor-pointer"
								onClick={() => setWriter(false)}
							/>
						</div>
					</div>

					<div className="border-b">
						<input
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							type="text"
							placeholder="What is the title?"
							className="w-full p-4 text-lg outline-none"
							required
						/>
					</div>

					<div className="flex-1 overflow-y-auto">
						<Tiptap setHtml={setHtml} />
					</div>

					<div className="p-4 border-t flex justify-end">
						<button
							type="submit"
							disabled={!html || title.length < 1}
							className="bg-blue-600 dark:bg-blue-900 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition disabled:bg-gray-100 
			  hover:cursor-pointer
			  hover:disabled:cursor-not-allowed">
							Publish
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default ArticleWriter;
