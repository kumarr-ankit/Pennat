import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import supabase from "../config/supabaseClient";
import parse from "html-react-parser";
import { Bookmark, BookMarked, ChevronLeft, Heart, Share } from "lucide-react";
import { toast } from "sonner";
import Loader from "./Loader";
import { Spinner } from "@/components/ui/spinner";
import { userDp } from "../../public/avtar";
import { userContext } from "../context/Context";
import CommentCard from "./CommentCard";
function ArticleReader() {
	const navigate = useNavigate();
	const [userInfo] = useContext(userContext);
	const userId = userInfo?.user_id;
	const [searchParam] = useSearchParams();
	const commentRef = useRef();
	const articleId = searchParam.get("id");
	const [article, setArticle] = useState(null);
	const [author, setAuthor] = useState(null);
	const [loading, setLoading] = useState(true);
	const [commentCount, setCommentCount] = useState(null);
	let temporaryCount = useRef(0); //hold totalCount;
	const [commentList, setCommentList] = useState([]);
	const [canComment, setCanComment] = useState(true);
	const [showBtn, setShowBtn] = useState();

	useEffect(() => {
		if (!articleId) {
			navigate("/home");
			return null;
		}
		const fetchArticle = async () => {
			console.log("Calling Api 🔥🔥");
			try {
				const { data, error } = await supabase
					.from("ArticleTable")
					.select(`*,UserTable(*),CommentTable(*)`)
					.eq("id", articleId)
					.single();

				if (error) console.log(error);
				if (!data) return;
				setArticle(data);
				setCommentCount(data?.comment_count);
				console.log(data);
				temporaryCount.current = data?.comment_count;

				setAuthor(data.UserTable);

				let { data: commentData, error: commentError } = await supabase
					.from("CommentTable")
					.select("*,UserTable(username,profile_img)")
					.eq("article_id", data.article_id);

				if (commentError) {
					console.log(commentError);
					return;
				}

				if (commentData) {
					console.log("Here is Comment Data");
					setCommentList(commentData);
					console.log(commentData);
				}
			} catch (error) {
				console.error("Error:", error);

				toast("❌ Failed to load the article. Please try after few minutes.");
			} finally {
				setLoading(false);
			}
		};

		fetchArticle();
	}, [articleId]);

	useEffect(() => {
		if (commentRef.current?.value) {
			setShowBtn(true);
		} else {
			setShowBtn(false);
		}
	}, [commentRef.current?.value]);

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

	async function handleComment() {
		setCanComment(false);

		let commentText = commentRef.current.value + "";
		let newString = commentText.trim();

		if (newString.length) {
			const dummyComment = {
				id: crypto.randomUUID(),
				comment: commentText,

				UserTable : {
					username :userInfo?.username,
					profile_img : userInfo?.profile_img
					
				}
			};
			setCommentCount((prev) => prev + 1);
			setCommentList((prev) => [dummyComment, ...prev]);
			if (!userId) return;
			const { data, error } = await supabase
				.from("CommentTable")
				.insert([
					{
						article_id: article?.article_id,
						user_id: userId,
						comment: newString,
					},
				])
				.select()
				.single();

			if (error) {
				toast("Comment Not Posted.");
				setCommentCount((p) => p - 1);
				console.log(error);
				return;
			} else if (data) {
				temporaryCount.current = temporaryCount.current + 1;
				const { data: countData, error: countError } = await supabase
					.from("ArticleTable")
					.update([{ comment_count: temporaryCount.current }])
					.eq("article_id", article?.article_id)
					.select();

				if (countError) {
					toast("Error while updating comment count.");
					console.log(countError);
					setCommentCount((p) => p - 1);
					return;
				}

				if (countData) {
					toast("Comment  Posted.");
				}
			}
		}

		setCanComment(true);
		commentRef.current.value = null;
	}

	async function deleteComment(commentId, comment) {
		console.log("Comment Id " + commentId + " Deleted.");
		console.log(comment);
		// Quick Ui update
		temporaryCount.current = temporaryCount.current - 1;
		setCommentCount((p) => p - 1);
		setCommentList((prev) => prev.filter((com) => com.id != comment.id));

		const { data: CommentTableData, error: CommentTableError } = await supabase
			.from("CommentTable")
			.delete()
			.eq("comment_id", comment.comment_id)
			.select();

		if (CommentTableError) {
			toast("Error occurred, while deleting comment.");

			setCommentCount((p) => p + 1);
			setCommentList((prev) => [comment, ...prev]);
			return;
		}

		if (CommentTableData) {
			const { data: commentCountData, error: commentCountError } =
				await supabase
					.from("ArticleTable")
					.update({ comment_count: temporaryCount.current })
					.select()
					.eq("article_id", article.article_id);

			if (commentCountError) {
				toast("Error while updating comment count.");
				temporaryCount.current = temporaryCount.current + 1;
				setCommentCount((p) => p + 1);
				setCommentList((prev) => [comment, ...prev]);
				return;
			}

			if (commentCountData) {
				toast("Comment Deleted.");
			}
		}
	}

	// return <div>

	// 	<div className="h-24 w-24 bg-red-800 justify-self-center self-center
	// 	hover:bg-green-400
	// 	transition
	// 	hover:translate-x-1
	// 	hover:animate-pulse
	// hover:skew-z-12
	// hover:rotate-x-60
	// 	hover:rotate-180
	// 	duration-700
	// 	"></div>
	// </div>
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

			<article className=" max-w-3xl mx-auto px-4 py-8">
				{/* Title */}
				<h1 className=" text-4xl md:text-6xl sm:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
					{article?.title}
				</h1>

				<div className="flex flex-col  items-start gap-4 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
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
							<span className="mr-1 text-xl mb-1">•</span>
							<span className="flex items-center">
								<Heart size={12} />

								<span className="font-semibold mx-1">
									{article.likes || "Like"}
								</span>
							</span>
						</div>
					</div>

					<div className="  rounded-xl">
						<div className="flex items-center gap-1">
							<img
								src={author?.profile_img || userDp}
								alt={author?.username}
								className="h-10 mr-4 rounded-full object-cover cursor-pointer"
								onClick={() => navigate(`/profile/${author?.username}`)}
							/>
							<div className="flex-1">
								<h3
									className="font-bold -mb-1 cursor-pointer hover:underline"
									onClick={() => navigate(`/profile/${author?.username}`)}>
									{author?.name || author?.username}
								</h3>
								<p className="text-gray-600 text-xs dark:text-gray-400 ">
									{author?.about || "Hey, I write on Pennat."}
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Article Body */}
				<div className="font-[roboto] dark:text-[#E0E0E0] text-xl sm:text-2xl mb-8">
					{parse(article.body)}
				</div>

				{/* <div className="flex items-center gap-3 py-8 border-gray-200 dark:border-gray-700">
				
					<button
						className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300
	                         dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
						<Heart size={18} />
					
						<span className="font-semibold">{article.likes || "Like"}</span>
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

				<div className="mt-12">
					<h2 className="text-lg font-bold  mb-2  ml-2 ">
						{commentCount ?? ""} {commentCount > 1 ? "Comments" : "Comment"}{" "}
					</h2>

					<div>
						<textarea
							onChange={(e) => {
								if (e.target.value) {
									setShowBtn(true);
								} else {
									setShowBtn(false);
								}
							}}
							ref={commentRef}
							placeholder="Write a comment..."
							className=" 
							block
						field-sizing-content
							overflow-x-clip
							h-fit
							w-full px-2 py-0 focus:py-1 border-b border-gray-300 dark:border-gray-700 rounded-xs
	                     focus:outline-none  "
						/>
						<div className="w-full mt-1 flex justify-end">
							<button
								disabled={!canComment}
								className={`transition  duration-700 ${
									showBtn ? "opacity-100 block" : "opacity-0 collapse"
								}
								outline-0
								px-3 py-2 mt-1 text-sm bg-gray-900 text-white dark:bg-gray-100 dark:text-black border rounded-full hover:bg-gray-700 dark:border-0 disabled:bg-gray-400`}
								onClick={handleComment}>
								{canComment ? "Post Comment" : "Please Wait.."}
							</button>
						</div>
					</div>

					<div className="text-gray-500 w-full dark:text-gray-400">
						{commentList.length > 0 && (
							<div className="w-fullrounded-md  p-1">
								{commentList.map((comment) => {
									return (
										<CommentCard
											user_id={userId}
											deleteComment={deleteComment}
											setCommentList={setCommentList}
											key={comment.id}
											comment={comment}
										/>
									);
								})}
							</div>
						)}

						{!commentList.length && (
							<div className="p-2 text-center">
								No Comments. Be the first to comment.
							</div>
						)}
					</div>
				</div>

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
