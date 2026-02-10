import React, { useContext, useEffect, useState } from "react";

import NavbarPage from "./NavbarPage";
import ArticlePage from "./ArticlePage";
import supabase from "../config/supabaseClient";
import { useNavigate } from "react-router-dom";
import { dataContext } from "../context/Context";

function Auth() {
  const [loading, setLoading] = useState(true);
  const navi = useNavigate();

  const [, setArticlesData] = useContext(dataContext);

  useEffect(() => {
    async function loadUser() {
      try {
        console.log("Load User called.");
        let { data, error } = await supabase.auth.getSession();

        if (error || !data?.session) {
          setLoading(false);
          navi("/login");
          return;
        }

        const response = await supabase
          .from("ArticleTable")
          .select("id,title,body,UserTable(name,username,profile_img,user_id)");
        if (response.error) {
          console.error("Database error:", response.error);
          alert("Error loading articles");
          navi("/login", { replace: true });
          setLoading(false);
          return;
        }

        if (response.data) {
          setArticlesData(response.data);
          navi("/home", { replace: true });
        }
      } catch (errorMsg) {
        setLoading(false);
        navi("/login");
        console.log(errorMsg);
      }
    }
    loadUser();
  }, [navi, setArticlesData]);
  return (
    <div className="max-w-screen min-h-screen  box-border overflow-x-hidden">
      {loading && (
        <div className="bg-gray-10 relative h-screen w-screen  ">
          <div className="absolute top-1/3 text-shadow-gray-800 text-shadow-sm  right-[50%] left-[30%] text-8xl font-bold font-[verdana] ">
            Pennat
            <div className="flex flex-row-reverse">
              {" "}
              <p className="text-sm  font-normal text-shadow-none p-2">
                loading..
              </p>
              <p className="border-l-3 border-t-3  py-2 px-2 mt-2 animate-spin  rounded-2xl w-fit h-fit text-xs border-0 border-l-black">
                {" "}
              </p>
            </div>
          </div>
        </div>
      )}

      {!loading && (
        <div className="bg-orange-200 w-fit m-auto p-4 rounded-xl border border-red-400 text-red-700">
          something went wrong.
        </div>
      )}
    </div>
  );
}

export default Auth;
