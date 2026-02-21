import React, { useState } from "react";
import parse from "html-react-parser";
import { Trash, Trash2Icon } from "lucide-react";
import supabase from "../config/supabaseClient";
import Loader from "./Loader";
function ProfilePostCard({ article, setArticle }) {
	const [loader, setLoader] = useState();
	if (!article) return;

	async function handleDelete() {
		console.log(article);
		setLoader(true);

		const res = await supabase
			.from("ArticleTable")
			.delete()
			.eq("id", article.id);

		if (!res.error) {
			setArticle((p) => p.filter((x) => x.id != article.id));
			setLoader(false);
		}
	}

	return (
		<div className="border box-border px-4   rounded-md m-1   -bg-conic-120  min-h-30 
		
		
		dark:text-gray-400
		min-w-40 flex items-center border-gray-300 dark:bg-[#202225]	dark:border-[#1F1B24]  max-w-[80%] sm:max-w-1/3">
			{loader && <Loader text={"Deleting.."} />}
			{!loader && (
				<div>
					<div className="flex justify-end">
						<select
							name=""
							id=""
							className="w-fit *:w-fit px-2 py-1  ">
							<option value="" className="hidden"></option>
							<option value="" className="bg-red-500 dark:bg-[#1F1B24]" onClick={handleDelete}>
								Delete
							</option>
							<option value="" className="dark:bg-[#1F1B24]">
								Edit
							</option>
						</select>
					</div>
					<div className="">
						<p className="font-bold pt-2  px-2">{article.title}</p>
						<p className="text-sm px-2 text-wrap  max-h-60 overflow-y-clip">
							{parse(article.body)}
						</p>
					</div>
				</div>
			)}
		</div>
	);
}

export default ProfilePostCard;
