import React, { useContext, useEffect, useState } from "react";
import supabase from "../config/supabaseClient";
import { useNavigate } from "react-router-dom";
import { dataContext } from "../context/Context";
import { LoaderCircle } from "lucide-react";

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
          return null;
        }

        const response = await supabase
          .from("ArticleTable")
          .select("id,title,author_id,body,UserTable(name,username,profile_img,user_id)");
        if (response.error) {
          console.error("Database error:", response.error);
          alert("Error loading articles");
          navi("/login", { replace: true });
          setLoading(false);
          return null;
        }

        if (response.data) {
          setArticlesData(response.data);
          navi("/home", { replace: true });
          return null;
        }
      } catch (errorMsg) {
        setLoading(false);
        navi("/login");
        console.log(errorMsg);
        return null;
      }
      return null;
    }
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="max-w-screen min-h-screen  box-border overflow-x-hidden">
      {loading && (
        <div className="bg-gray-10 relative h-screen w-screen flex  justify-center items-center ">
          <div className="top-1/3 text-shadow-gray-800   right-[50%] left-[50%] text-3xl font-bold font-[verdana] ">
            Pennat
            <div className="flex flex-row-reverse items-center">
              {" "}
              <p className="text-sm  font-normal text-shadow-none p-2 ">
                loading..
              </p>
              <LoaderCircle
                size={24}
                className=" animate-spin  py-2 rounded-2xl w-fit h-fit text-xs "
              >
                /
              </LoaderCircle>
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
