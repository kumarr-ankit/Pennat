import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import supabase from "../config/supabaseClient";
import parse from "html-react-parser";
import { Bookmark, BookMarked, ChevronLeft, Heart, Share } from "lucide-react";
import { toast } from "sonner";
import Loader from "./Loader";
import { Spinner } from "@/components/ui/spinner";
import { userDp } from "../../public/avtar";
function ArticleReader() {
	const navigate = useNavigate();
	const [searchParam] = useSearchParams();

	const articleId = searchParam.get("id");
	const [article, setArticle] = useState(null);
	const [author, setAuthor] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!articleId) {
			navigate("/home");
			return null;
		}
		const fetchArticle = async () => {
			try {
				const { data, error } = await supabase
					.from("ArticleTable")
					.select(`*,UserTable(*)`)
					.eq("id", articleId)
					.single();

				if (error) console.log(error);
				setArticle(data);
				console.log(data);
				setAuthor(data.UserTable);
			} catch (error) {
				console.error("Error:", error);

				toast("❌ Failed to load the article. Please try after few minutes.");
			} finally {
				setLoading(false);
			}
		};

		fetchArticle();
	}, [articleId]);

	const formatDate = (date) => {
		return new Date(date).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	if (loading) {
		return (
			<div className="flex items-center text-lg min-h-screen justify-center">
				<Spinner className="size-6 mx-1" /> Just a minute
			</div>
		);
	}

	if (!article) {
		return (
			<div className=" mx-auto px-4 py-16 text-center h-screen ">
				<h1 className="text-md font-bold mb-4">
					Error Occurred while loading article.
				</h1>
				<button
					onClick={() => navigate("/")}
					className="px-6 py-2 bg-gray-600 text-white rounded-lg">
					Go Home
				</button>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-white dark:bg-gray-900">
			<div className="max-w-4xl mx-auto px-4 pt-8">
				<button
					onClick={() => navigate(-1)}
					className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
					<ChevronLeft width={20} />
					Back
				</button>
			</div>

			{/* {article.cover_image && (
				<div className="max-w-5xl mx-auto px-4 mt-6">
					<img
						src={article.cover_image}
						alt={article.title}
						className="w-full h-96 object-cover rounded-2xl"
					/>
				</div>
			)} */}

			<article className=" max-w-3xl mx-auto px-4 py-8">
				{/* Title */}
				<h1 className=" text-2xl md:text-5xl sm:text-3xl font-bold mb-6 text-gray-900 dark:text-white">
					{article?.title}
				</h1>

				<div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
					<div className="flex-1">
						<div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
							<span>{formatDate(article.created_at)}</span>
							{/* <span>•</span>
							<span>5 min read</span> */}
							{article.view_count && (
								<>
									<span>•</span>
									<span>{article.view_count} views</span>
								</>
							)}
						</div>
					</div>
				</div>

				{/* Article Body */}
				<div className="font-[roboto] dark:text-[#E0E0E0] text-xl sm:text-2xl mb-8">
					{parse(article.body)}
				</div>

				{/* <div className="flex items-center gap-3 py-8 border-y border-gray-200 dark:border-gray-700">
				
					<button
						className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300
	                         dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
						<Heart size={18} />
						<span className="text-sm">Like</span>
						<span className="font-semibold">{article.like_count || ""}</span>
					</button>

				
					<button
						className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300
	                         dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
						<Bookmark size={18} />
						<span className="text-sm">Save</span>
					</button>

				
					<button
						className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300
	                         dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
						<Share size={18} />
						<span className="text-sm">Share</span>
					</button>
				</div> */}

				{/* Author*/}
				<div className="mt-12 p-6 bg-gray-50 dark:bg-[#0d0d0d] rounded-xl">
					<div className="flex items-start gap-4">
						<img
							src={author?.profile_img || userDp}
							alt={author?.username}
							className="w-16 h-16 rounded-full object-cover cursor-pointer"
							onClick={() => navigate(`/profile/${author?.username}`)}
						/>
						<div className="flex-1">
							<h3
								className="text-xl font-bold mb-1 cursor-pointer hover:underline"
								onClick={() => navigate(`/profile/${author?.username}`)}>
								{author?.name || author?.username}
							</h3>
							<p className="text-gray-600 dark:text-gray-400 mb-3">
								{author?.about || "Hey, I write on Pennat."}
							</p>
							{/* <button className="px-2 py-1 bg-background  border
              border-foreground  text-forground rounded-lg cursor-pointer active:bg-gray-700 hover:bg-blue-700">
								Following
							</button> */}
						</div>
					</div>
				</div>

				{/* Comments Section */}
				{/* <div className="mt-12">
					<h2 className="text-2xl font-bold mb-6">
						Comments ({article.comment_count || 0})
					</h2>

					
					<div className="mb-8">
						<textarea
							placeholder="Write a comment..."
							className="w-full p-4 border border-gray-300 dark:border-gray-700 rounded-lg
	                     bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
							rows="3"
						/>
						<button className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
							Post Comment
						</button>
					</div>

				
					<p className="text-gray-500 dark:text-gray-400">
						No comments yet. Be the first!
					</p>
				</div> */}

				{/* <div className="mt-16">
					<h2 className="text-2xl font-bold mb-6">
						More from{" "}
						{article.profiles?.display_name || article.profiles?.username}
					</h2>
					<p className="text-gray-500 dark:text-gray-400">
						Related articles will appear here
					</p>
				</div> */}
			</article>
		</div>
	);
}

export default ArticleReader;
