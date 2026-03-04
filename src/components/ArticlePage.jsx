import React, { useContext} from "react";
import ArticleCard from "./ArticleCard";

import { dataContext } from "../context/Context";
import { LoaderCircle } from "lucide-react";

function ArticlePage() {
	const [articlesData] = useContext(dataContext);



	return (
		<div className="mt-3">
			{articlesData?.length ? (
				<div
					className="flex justify-center  flex-col items-center w-full box-border pb-8 
				">
					{articlesData &&
						articlesData.map((el) => <ArticleCard key={el.id} article={el} />)}
				</div>
			) : (
				""
			)}
			{!articlesData?.length && (
				<div className="min-h-screen flex items-center justify-center">
					<div className="flex items-center gap-2 text-gray-600">
						<LoaderCircle size={24} className="animate-spin" />
						<span>Loading profile...</span>
					</div>
				</div>
			)}
		</div>
	);
}

export default ArticlePage;
