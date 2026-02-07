import React, { useContext, useEffect, useState } from "react";
import ArticleCard from "./ArticleCard";
import FieldInput from "./ui/FieldInput";
import AddArticle from "./AddArticle";

import { useNavigate } from "react-router-dom";
import { dataContext } from "../context/Context";

function ArticlePage() {
  const [articlesData] = useContext(dataContext);
  
  let navi = useNavigate();

  useEffect(() => {
    if (!articlesData.length) {
      console.log("articles data is empty.");
     navi("/auth");
    }else{
      return;
    }
  }, [articlesData]);

  return (
    <div>
     
      <div className="flex justify-center  flex-col items-center w-full  box-border pb-8 ">
        {articlesData &&
          articlesData.map((el) => <ArticleCard key={el.id} article={el} />)}
      </div>

    
    </div>
  );
}

export default ArticlePage;
