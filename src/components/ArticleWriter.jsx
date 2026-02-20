import React, { useContext, useState } from "react";
import Tiptap from "./Tiptap";

import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { userContext } from "../context/Context";
import supabase from "../config/supabaseClient";
import { toast, Toaster } from "sonner";

function ArticleWriter() {
	const [userInfo] = useContext(userContext);
	const user_id = userInfo?.user_id;
	const [Html, setHtml] = useState("");
	const [title, setTitle] = useState();
	function fun(html) {
		setHtml(html);
	}

	function formReset(e) {
		console.log(e);
	}
	async function handleSubmit() {
		event.preventDefault();

		if (!title || !Html) return;
		const res = await supabase
			.from("ArticleTable")
			.insert({
				author_id: user_id,
				title: title,
				body: Html,
			})
			.select();
		let error = res?.error;
		let data = res?.data;

		if (error) throw new Error(error);
		if (data) {
			console.log(data);
			toast("Successfuly, Added.✅");

			let writerForm = document.getElementById('writerForm');
			writerForm.reset();
		
		}
	}
	let navigate = useNavigate();
	return (
		<div
			className="w-[86vw] 
		sticky
		top-80
		mx-auto
		sm:w-[60vw]
		
		">
			<form onSubmit={handleSubmit} id="writerForm">
				<div className="flex  justify-between ">
					<div className="flex items-center">
						<ArrowLeft
							size={24}
							className="hover:bg-gray-200 rounded-full p-1 hidden hover:cursor-pointer"
							onClick={() => {
								navigate("/home");
							}}
						/>
						<div className="hidden">
							<p className="text-xl px-2">Write article</p>
						</div>
					</div>
				</div>
				<div className="overflow-y-auto my-1 box-border border border-gray-300 rounded-xl shadow">
					<div className="border-b  border-b-gray-100">
						<input
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							type="text"
							placeholder="What is title ?"
							className=" p-2 pl-4  w-full text-lg outline-0 text-bold "
							required={true}
						/>
					</div>
					<Tiptap fun={fun} />
				</div>
				<div>
					{Html && title?.length > 4 && (
						<div
							className="bg-blue-600 w-fit  px-4 py-2 text-white rounded-4xl border-0 absolute bottom-1 right-1 cursor-pointer"
							onClick={handleSubmit}>
							<button type="submit" className="cursor-pointer">
								Publish
							</button>
						</div>
					)}
				</div>
			</form>
		</div>
	);
}

export default ArticleWriter;
