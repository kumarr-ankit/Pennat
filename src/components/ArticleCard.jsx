import React, { useContext, useState } from "react";
import userDp from "../assets/user.png";
import { dataContext, userContext } from "../context/Context";
import { Ellipsis, Heart, MessageCircle, Send, Trash2 } from "lucide-react";
import supabase from "../config/supabaseClient";
import { NavLink, useNavigate } from "react-router-dom";
import parse from "html-react-parser";
import { toast } from "sonner";

function ArticleCard({ article }) {
	const { name, username, profile_img } = article.UserTable;
	let [, , likedArcticles, setLikedArcticles] = useContext(dataContext);

	const [userInfo] = useContext(userContext);
	const [, setArticles] = useContext(dataContext);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const preview = article?.preview;

	console.log(article)

	let author_id = article?.author_id;
	let articleId = article?.article_id;
	let user_id = userInfo?.user_id;
	let comment_count = article?.comment_count ?? 10;
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

	const [likes, setLikes] = useState(article?.likes ?? 0);
	const [isLiking, setIsLiking] = useState(false);
	const isLiked = likedArcticles.has(articleId);

	async function handleLikeCount(e) {
		e.preventDefault();
		e.stopPropagation();

		if (isLiking) return;
		setIsLiking(true);

		// Capture before any awaits to avoid drift
		const wasLiked = isLiked;

		// 1. Optimistic UI update
		setLikes((prev) => (wasLiked ? prev - 1 : prev + 1));

		setLikedArcticles((prev) => {
			const newSet = new Set(prev);
			wasLiked ? newSet.delete(articleId) : newSet.add(articleId);
			return newSet;
		});

		// 2. Update LikesTable first

		const likeRes = wasLiked
			? await supabase
					.from("LikesTable")
					.delete()
					.eq("article_id", articleId)
					.eq("user_id", user_id)
			: await supabase
					.from("LikesTable")
					.insert({ article_id: articleId, user_id: user_id });

		if (likeRes.error) {
			toast("❌ Error while liking");
			// Full rollback
			setLikes((prev) => (wasLiked ? prev + 1 : prev - 1));
			setLikedArcticles((prev) => {
				const newSet = new Set(prev);
				wasLiked ? newSet.add(articleId) : newSet.delete(articleId);
				return newSet;
			});
			setIsLiking(false);
			return;
		}

		// 3. Fetch fresh count from DB then update
		const { data: freshData, error: fetchError } = await supabase
			.from("ArticleTable")
			.select("likes")
			.eq("article_id", articleId)
			.single();

		if (fetchError) {
			toast("❌ Error fetching like count");
			setLikes((prev) => (wasLiked ? prev + 1 : prev - 1));
			setIsLiking(false);
			return;
		}

		const { error } = await supabase
			.from("ArticleTable")
			.update({ likes: freshData.likes + (wasLiked ? -1 : 1) })
			.eq("article_id", articleId);

		if (error) {
			toast("❌ Error updating like count");
			setLikes((prev) => (wasLiked ? prev + 1 : prev - 1));
		}

		setIsLiking(false);
	}

	return (
		<div className="w-full sm:w-[60vw] max-w-2xl mx-auto py-6 px-4 bg-white dark:bg-[#141414] sm:border sm:mt-2 border-gray-100 dark:border-[#1F1B24] sm:rounded-xl transition-all hover:shadow-[0_2px_15px_rgba(0,0,0,0.1)]">
			<div className="flex justify-between items-center mb-4">
				<div className="flex items-center gap-3">
					<img
						onClick={() => navigate(`/profile/${username}`)}
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

				<div className="w-full mt-2">
					<ul className="flex mt-4 justify-start items-center *:mx-2 w-fit *:flex">
						<li
							onClick={handleLikeCount}
							className={`flex items-center gap-2 text-sm cursor-pointer select-none transition-colors ${
								isLiked
									? "text-red-500"
									: "text-gray-600 dark:text-gray-400 hover:text-red-500"
							}`}>
							<Heart
								size={20}
								fill={isLiked ? "#ff0000" : "none"}
								strokeWidth={2}
								className={`${
									isLiking ? "scale-130" : ""
								} transition-transform hover:scale-120`}
							/>
							<span>{likes}</span>
						</li>
						<li className="flex items-center text-sm">
							<MessageCircle size={18} />{" "}
							<span className="px-1">
								{comment_count ? comment_count : "Comment"}
							</span>
						</li>
						<li className="flex items-center text-sm" hidden>
							<Send size={20} /> <span className="px-1">Share</span>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}

export default ArticleCard;
