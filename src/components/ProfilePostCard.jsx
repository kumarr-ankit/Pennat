import React, { useContext, useState } from "react";
import parse from "html-react-parser";
import { Ellipsis, Trash2, BookOpen } from "lucide-react";
import supabase from "../config/supabaseClient";
import Loader from "./Loader";
import { userContext } from "../context/Context";

function ProfilePostCard({ article, setArticle, isOpen, setOpenMenuId }) {
	const [loader, setLoader] = useState(false);
	const [userInfo] = useContext(userContext);
	const user_id = userInfo?.user_id;

	if (!article) return null;

	async function handleDelete() {
		setLoader(true);
		const res = await supabase
			.from("ArticleTable")
			.delete()
			.eq("id", article.id);

		if (!res.error) {
			setArticle((p) => p.filter((x) => x.id !== article.id));
		}
		setLoader(false);
	}

	return (
		<div
			onContextMenu={(e) => {
				e.preventDefault();
				setOpenMenuId(isOpen ? null : article.id);
			}}
			className="group relative flex flex-col w-[70%] my-1 md:w-[98%] min-h-45 bg-white dark:bg-[#1A1A1A] border border-gray-100 dark:border-[#2A2A2A] rounded-xl overflow-hidden transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
			{/* Loading Overlay */}
			{loader && (
				<div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-[2px]">
					<Loader text={"Deleting..."} />
				</div>
			)}

			{/* Top Action Bar */}
			<div className="flex justify-between items-start p-4 pb-2">
				<div className="p-2 rounded-lg bg-gray-50 dark:bg-[#252525] text-gray-400">
					<BookOpen size={16} />
				</div>

				{user_id == article.author_id && (
					<div className="relative">
						<button
							onClick={() => setOpenMenuId(isOpen ? null : article.id)}
							className="p-1.5 rounded-full text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#252525] transition-all cursor-pointer">
							<Ellipsis size={20} />
						</button>

						{/* Action Menu */}
						{isOpen && (
							<>
								{/* Backdrop to close menu on click outside */}
								<div
									className="fixed inset-0 z-10"
									onClick={() => setOpenMenuId(null)}
								/>
								<div className="absolute right-0 mt-2 w-40 bg-white dark:bg-[#252525] border border-gray-200 dark:border-[#333] rounded-lg shadow-xl z-20 py-1 animate-in fade-in zoom-in duration-150">
									<button
										onClick={handleDelete}
										className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
										<Trash2 size={14} />
										Delete Post
									</button>
								</div>
							</>
						)}
					</div>
				)}
			</div>

			{/* Content Body */}
			<div className="px-5 pb-5">
				<h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 line-clamp-1 mb-2 tracking-tight">
					{article.title}
				</h3>
				<div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed opacity-80 prose-p:m-0">
					{parse(article.body)}
				</div>
			</div>

			{/* Decorative Footer */}
			<div className="mt-auto h-1 w-full bg-linear-to-r from-transparent via-gray-100 dark:via-[#2A2A2A] to-transparent opacity-50" />
		</div>
	);
}

export default React.memo(ProfilePostCard);
