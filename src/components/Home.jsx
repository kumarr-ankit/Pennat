import NavbarPage from "./NavbarPage";
import ArticlePage from "./ArticlePage";
import AddArticle from "./AddArticle";

import FieldInput from "./ui/FieldInput";
import ArticleWriter from "./ArticleWriter";
import { useContext, useEffect, useState } from "react";

import { FilePenLine, LogIn, PenLine } from "lucide-react";
import { dataContext, userContext } from "../context/Context";
import { useNavigate } from "react-router-dom";
import supabase from "../config/supabaseClient";

function Home() {

	const [write, setWriter] = useState(false);
	const [userInfo, isLoading] = useContext(userContext);
	const navi = useNavigate();
	const [, setArticlesData] = useContext(dataContext);

	useEffect(() => {

		if (isLoading) return;

		if (!userInfo) {
			navi("/auth", { replace: true });
			return null;
		} else {
			async function loadeArticles() {

				const response = await supabase
					.from("ArticleTable")
					.select(
						"id,title,author_id,body,UserTable(name,username,profile_img,user_id)"
					);

				if (response.error) {
					console.error("Database error:", response.error);
					alert("Error loading articles");
					navi("/login", { replace: true });
					return null;
				}
				if (response.data) {
					setArticlesData(response.data);
				}
			}

			loadeArticles();
		}
	}, [userInfo, isLoading, navi, setArticlesData]);

	return (
		<div className="w-full overflow-x-clip  -mt-2 box-border h-fit  min-h-screen dark:bg-[#1F1B24]">
			<NavbarPage />

			<div
				className="
			    mt-15 overflow-auto"
				id="writer">
				{write && <ArticleWriter setWriter={setWriter} />}
				<div
					hidden={write}
					onClick={() => {
						setWriter(true);
					}}
					className="border-2 hover:border-gray-800 shadow-2xl hover:scale-104 bg-black bottom-2 right-2 fixed justify-center sm:mx-auto mx-2 w-fit  text-sm rounded-xl  my-2 py-1 
					
					mb-4  ">
					<div
						id="article_Button"
						className="h-full w-full cursor-pointer px-4 flex justify-between items-center py-3 outline-0 [&:hover>.pencil]:-rotate-5"
						placeholder="">
						<PenLine size={18} color="white" className="pencil" />
						<span className="p-1 text-white">Write Article</span>
					</div>
				</div>
			</div>

			<div className="box-border">
				<ArticlePage />
			</div>
		</div>
	);
}

export default Home;
