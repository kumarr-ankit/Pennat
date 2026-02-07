import React from "react";

function AddArticle() {
  return (
    <div>
      <div className="w-[80%] bg-white z-50 md:w-[50%] my-2 mx-auto  rounded shadow-2xs  px-8 py-3 border border-gray-300 ">
      <input type="text" placeholder="  Publish a new article.." className="w-full h-full outline-0 "/>
      </div>
    </div>
  );
}

export default AddArticle;
