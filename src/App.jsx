import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import ProfilePage from "./components/ProfilePage";
import Auth from "./components/Auth";
import { useEffect, useState } from "react";
import supabase from "./config/supabaseClient";
import { dataContext, userContext } from "./context/Context";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <Auth />
        </>
      ),
    },
       {
      path: "/auth",
      element: (
        <>
          <Auth />
        </>
      ),
    },
    {
      path: "/home",
      element: (
        <>
          <Home />
        </>
      ),
    },
    {
      path: "/login",
      element: (
        <>
          <Login />
        </>
      ),
    },
    {
      path: "/signup",
      element: (
        <>
          <Signup />
        </>
      ),
    },
    {
      path: "/profile",
      element: (
        <>
          <ProfilePage />
        </>
      ),
    },
  ]);

  const [articlesData, setArticlesData] = useState([]);
  const [userInfo, setUserInfo] = useState();

  useEffect(() => {
    async function loadUser() {
      console.log("Calling profile page");
      let res = await supabase.auth.getUser();
      if (res.data && res.data.user) {
        let { id } = res.data.user;

        let { data, error } = await supabase
          .from("UserTable")
          .select()
          .eq("user_id", id);

        if (!error && data) {
          setUserInfo(data[0]);
        }
        if (error) {
          console.log(error);
        }
      }
    }
    loadUser();

    return () => {};
  }, []);

  useEffect(() => {
    console.log(articlesData);

    return () => {};
  }, [articlesData]);

  return (
    <div>
      <dataContext.Provider value={[articlesData, setArticlesData]}>
        <userContext.Provider value={[userInfo]}>
          <RouterProvider router={router} />
        </userContext.Provider>
      </dataContext.Provider>
    </div>
  );
}

export default App;
