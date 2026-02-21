import React, { useContext } from "react";
import userDp from "../assets/user.png";
import { dataContext, userContext } from "../context/Context";
import { Ellipsis, Trash } from "lucide-react";
import supabase from "../config/supabaseClient";
import { NavLink } from "react-router-dom";
import parse from "html-react-parser";

function ArticleCard({ article }) {
	const { name, username, profile_img } = article.UserTable;
	console.log(article);

	const [userInfo] = useContext(userContext);

	const [, setArticles] = useContext(dataContext);

	let author_id = article?.author_id;
	let user_id = userInfo?.user_id;

	async function handleDelete() {
		if (article && article.id) {
			console.log("calling supabase");
			const supabaseRes = await supabase
				.from("ArticleTable")
				.delete()
				.eq("id", article.id);
			console.log(supabaseRes);

			if (supabaseRes.status == "204") {
				setArticles((p) => {
					console.log("updating");
					return p.filter((el) => el.id != article.id);
				});
			}
		}
	}
	return (
		<div className=" h-fit w-[80vw] sm:w-[60vw]  my-2 rounded-md dark:border-[#1F1B24]  px-2 pt-1 pb-4  border border-gray-200 shadow-xs">
			<div className="  flex justify-between mx-1">
				<div className=" flex flex-row items-center ">
					<img
						src={profile_img || userDp}
						alt="user-img"
						className="size-9 mx-2 my-1 rounded-full"
					/>
					<div className="">
						<p className="text-[12px]">{name}</p>
						<p className="text-[10px] hover:bg-gray-500 rounded-full mx-0 hover:px-1 cursor-pointer">
							<NavLink to={`/${username}`}>@{username}</NavLink>
						</p>
					</div>
				</div>

				<div className="relative [&>ul]:hidden [&:hover>ul]:block cursor-pointer hidden">
					<Ellipsis />

					<ul className="bg-white  p-1 absolute rounded-md border-gray-500 ">
						{user_id === author_id && (
							<li
								className="flex border items-center px-2 -mt-2 -ml-2 py-1 text-red-900 rounded-md hover:bg-red-400"
								onClick={handleDelete}>
								<Trash className="inline" size={"16px"} />
								Delete
							</li>
						)}
					</ul>
				</div>
			</div>
			<div className="px-4 py-2 text-lg font-semibold my-0">
				{article.title}
			</div>
			<div className="px-4">{parse(article.body)}</div>
		</div>
	);
}

export default ArticleCard;
