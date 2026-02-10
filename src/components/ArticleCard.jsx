import React, { useContext } from "react";
import userDp from "../assets/user.png";
import { dataContext } from "../context/Context";
import { Ellipsis, Trash } from "lucide-react";
import supabase from "../config/supabaseClient";

function ArticleCard({ article }) {
  const { name, username, profile_img } = article.UserTable;
 console.log(article)

  const [articles, setArticles] = useContext(dataContext);

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
    <div className=" h-fit w-[80%] sm:w-[50%] md:w-[40%] my-2 rounded  px-2 pt-1 pb-4  border border-gray-200 shadow-xs">
      <div className="  flex justify-between mx-1">
        <div className=" flex flex-row items-center ">
          <img
            src={profile_img || userDp}
            alt="user-img"
            className="size-9 mx-2 my-1 rounded-full"
          />
          <div>
            <p className="text-[12px]">{name}</p>
            <p className="text-[10px]">@{username}</p>
          </div>
        </div>

        <div className="relative [&>ul]:hidden [&:hover>ul]:block cursor-pointer">
          <Ellipsis />

          <ul className="bg-white  p-1 absolute rounded-md border border-gray-500">
            <li
              className="flex items-center px-2 py-1 text-red-500 rounded-md hover:bg-red-400"
              onClick={handleDelete}
            >
              <Trash className="inline" size={"16px"} />
              Delete
            </li>


          </ul>
        </div>
      </div>
      <div className="px-4 py-2 text-lg font-semibold my-0">
        {article.title}
      </div>
      <div className="px-4">{article.body}</div>
    </div>
  );
}

export default ArticleCard;
