import NavbarPage from "./NavbarPage";
import ArticlePage from "./ArticlePage";
import AddArticle from "./AddArticle";

import FieldInput from "./ui/FieldInput";
import ArticleWriter from "./ArticleWriter";
import { useState } from "react";

import { FilePenLine, PenLine } from "lucide-react";

function Home() {
	const [write, setWriter] = useState(false);

	return (
		<div className="w-full  -mt-2 box-border h-fit  min-h-screen dark:bg-[#1F1B24]">
			<NavbarPage />

			<div
				className="
			    mt-15 overflow-auto"
				id="writer">
				{write && <ArticleWriter setWriter={setWriter} />}
				<div
					hidden={write}
					onClick={()=>{
						setWriter(true)
					}}
					className="border-2 border-gray-900 bg-black bottom-2 right-2 fixed justify-center sm:mx-auto mx-2 w-fit  text-sm rounded-xl  my-2 py-1 
					
					mb-4 ">
					<div
						id="article_Button"
						className="h-full w-full px-4 flex justify-between items-center py-3 outline-0"
						placeholder="">
						<PenLine size={18} color="white" />
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
