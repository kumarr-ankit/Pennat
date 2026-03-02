import React, { useContext, useState } from "react";
import userDp from "../assets/user.png";
import { dataContext, userContext } from "../context/Context";
import { Ellipsis, Trash2 } from "lucide-react";
import supabase from "../config/supabaseClient";
import { NavLink, useNavigate } from "react-router-dom";
import parse from "html-react-parser";

function ArticleCard({ article }) {
	const { name, username, profile_img } = article.UserTable;
	const [userInfo] = useContext(userContext);
	const [, setArticles] = useContext(dataContext);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const preview = article?.preview;

	let author_id = article?.author_id;
	let user_id = userInfo?.user_id;
	const navigate = useNavigate();

	async function handleDelete() {
		if (article?.id) {
			const { status } = await supabase
				.from("ArticleTable")
				.delete()
				.eq("id", article.id);

			if (status === 204) {
				setArticles((p) => p.filter((el) => el.id !== article.id));
			}
		}
	}

	return (
		<div
			className=" 
        w-full sm:w-[60vw] max-w-2xl mx-auto py-6 px-4 mb-4 bg-white dark:bg-[#141414] sm:border border-gray-100 dark:border-[#1F1B24] sm:rounded-xl transition-all hover:shadow-[0_2px_15px_rgba(0,0,0,0.1)] active:border-2">
			<div className="flex justify-between items-center mb-4">
				<div className="flex items-center gap-3">
					<img
					 onClick={()=>{
						navigate(`/profile/${username}`)
					 }}
						src={profile_img || userDp}
						alt={name}
						className="size-10 rounded-full object-cover ring-1 ring-gray-100 dark:ring-gray-800"
					/>
					<div className="flex flex-col">
						<span className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-none">
							{name}
						</span>
						<NavLink
							to={`/profile/${username}`}
							className="text-xs text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors mt-1">
							@{username}
						</NavLink>
					</div>
				</div>

				{user_id === author_id && (
					<div className="relative">
						<button
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							className="p-1.5 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-[#252525] transition-colors cursor-pointer">
							<Ellipsis size={20} />
						</button>

						{isMenuOpen && (
							<div className="absolute right-0 mt-2 w-36 bg-white dark:bg-[#1F1B24] border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl z-10 py-1">
								<button
									className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
									onClick={handleDelete}>
									<Trash2 size={14} />
									Delete
								</button>
							</div>
						)}
					</div>
				)}
			</div>

			<div
				onClick={() => {
					if (!preview) navigate(`/article?id=${article.id}`);
				}}
				className="hover:cursor-pointer">
				<div className="space-y-2">
					<h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100 leading-snug">
						{article.title}
					</h2>

					<div className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400 line-clamp-3 prose-p:m-0 prose-headings:text-lg">
						{parse(article.body)}
					</div>
				</div>
			</div>

			{/* <div className="mt-4 flex items-center gap-4 text-xs text-gray-400">
                <span>{new Date(article.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                <span className="flex items-center gap-1">•</span>
                <span className="hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer">Read more</span>
            </div> */}
		</div>
	);
}

export default ArticleCard;
