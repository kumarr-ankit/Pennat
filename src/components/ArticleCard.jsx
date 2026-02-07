import React from "react";
import userDp from '../assets/user.png'

function ArticleCard({article}) {
  const {name,username} = article.UserTable;
 //console.log(article)
  return (
    <div className=" h-fit w-[80%] sm:w-[50%] md:w-[40%] my-2 rounded  px-2 pt-1 pb-4  border border-gray-200 shadow-xs">
      <div className=" flex flex-row items-center">
        <img
          src={userDp}
          alt="user-img"
         
          className="size-8 m-2 rounded-full"
        />
        <div>
          <p className="text-[12px]">{name}</p>
          <p className="text-[10px]">@{username}</p>
        </div>
      </div>
      <div className="px-4 py-2 text-lg font-semibold my-0">{article.title}</div>
      <div className="px-4">
      {article.body}
      </div>
    </div>
  );
}

export default ArticleCard;
