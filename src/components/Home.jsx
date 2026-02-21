import NavbarPage from "./NavbarPage";
import ArticlePage from "./ArticlePage";
import AddArticle from "./AddArticle";
import { Switch } from "@/components/ui/switch";

import FieldInput from "./ui/FieldInput";
import ArticleWriter from "./ArticleWriter";
import { useContext } from "react";
import { themeContext } from "../context/Context";

function Home() {
	const setIsDark = useContext(themeContext);
	return (
		<div className="w-full box-border h-fit  min-h-screen dark:bg-[#1F1B24]">
			<NavbarPage />

			<div
				className="
			mt-15 overflow-auto"
				id="writer">
				<ArticleWriter />
			</div>

			<div className="box-border">
				<ArticlePage />
			</div>
			<div className=" flex justify-end pr-4  items-center pb-4">
				<div className="border flex items-center rounded-xl shadow-2xl p-2">
					<div
					   className="inline"
						onClick={() => {
							setIsDark((p) => !p);
						}}>
						<Switch />
					</div>{" "}
					<span className="pb-1 px-1">Dark Mode</span>
				</div>
			</div>
		</div>
	);
}

export default Home;
