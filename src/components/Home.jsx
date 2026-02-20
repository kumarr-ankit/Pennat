import NavbarPage from "./NavbarPage";
import ArticlePage from "./ArticlePage";
import AddArticle from "./AddArticle";

import FieldInput from "./ui/FieldInput";
import ArticleWriter from "./ArticleWriter";

function Home() {
	return (
		<div className="w-full box-border min-h-screen ">
			<NavbarPage />

			<div className="mt-20 overflow-auto" id="writer">
				<ArticleWriter />
			</div>

			<div className="box-border">
				<ArticlePage />
			</div>
		</div>
	);
}

export default Home;
