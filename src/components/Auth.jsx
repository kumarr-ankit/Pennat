import React, { useContext, useEffect } from "react";

import NavbarPage from "./NavbarPage";
import ArticlePage from "./ArticlePage";
import supabase from "../config/supabaseClient";
import { useNavigate } from "react-router-dom";
import { dataContext } from "../context/Context";

function Auth() {
  const navi = useNavigate();

  const [articlesData, setArticlesData] = useContext(dataContext);
  async function loadUser() {
    console.log("Load User called.");
    let { data, error } = await supabase.auth.getSession();
    if (error) {
      console.log("Error happens.");
      console.log(error);
      navi("/login");
    }
    if (data) {
      console.log("Data got.");
      console.log(data);
      let { session } = data;
      if (session) {
        const response = await supabase
          .from("ArticleTable")
          .select("id,title,body,UserTable(name,username)");
        if (response.data) {
          setArticlesData(response.data);
          navi("/home");
        } else {
          alert("Error occured");
          console.log(error);
        }
      } else {
        navi("/login");
      }
    }
  }

  useEffect(() => {
    loadUser();
  }, []);
  return <div>Please wait..</div>;
}

export default Auth;
