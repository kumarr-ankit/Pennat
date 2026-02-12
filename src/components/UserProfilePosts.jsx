import React from "react";
import ArticleCard from "./ArticleCard";
import ProfilePostCard from "./ProfilePostCard";

function UserProfilePosts({ ArticleTable }) {
	console.log(ArticleTable);



	return (
		<div>
			
			<p className="text-xs  font-semibold uppercase tracking-wider text-gray-400 border-t pt-2 border-t-gray-200 mx-10 ">
				My articles
			</p>

			<div className="flex flex-wrap flex-col  sm:flex-row justify-center sm:items-start items-center">
				{ArticleTable?.map((el) => (
					<ProfilePostCard article={el} />
				))}
			</div>
		</div>
	);
}

export default UserProfilePosts;
