import {
	createBrowserRouter,
	createHashRouter,
	RouterProvider,
} from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import ProfilePage from "./components/ProfilePage";
import Auth from "./components/Auth";
import { useEffect, useState } from "react";
import supabase from "./config/supabaseClient";
// eslint-disable-next-line no-unused-vars
import { dataContext, userContext, themeContext } from "./context/Context";
import Profile from "./components/Profile";
import ArticleWriter from "./components/ArticleWriter";
import { Toaster } from "sonner";
import Loader from "./components/Loader";
import NavbarPage from "./components/NavbarPage";
import InstallPWA from "./components/InstallPWA";

function App() {
	console.log("SUPABASE URL:", import.meta.env.VITE_SUPABASE_URL);
	const router = createHashRouter([
		{
			path: "/",
			element: (
				<>
					<Auth />
				</>
			),
		},
		{
			path: "/write",
			element: (
				<>
					<ArticleWriter />
				</>
			),
			errorElement: <h2>Error Occurred.🙂</h2>,
		},
		{
			path: "/:username",
			element: <Profile />,
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
					.select("*,ArticleTable(*)")
					.eq("user_id", id)
					.single();

				if (!error && data) {
					setUserInfo(data);
					console.log(data);
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

	const [isDark, setIsDark] = useState(false);

	return (
		<div
			className={`${isDark ? "dark" : ""}
		*:dark:bg-[#121212]
		*:dark:text-[#E0E0E0]`}>
			<Toaster position="top-center" />
			<InstallPWA />

			<dataContext.Provider value={[articlesData, setArticlesData]}>
				<userContext.Provider value={[userInfo]}>
					<themeContext.Provider value={setIsDark}>
						<RouterProvider router={router}></RouterProvider>
					</themeContext.Provider>
				</userContext.Provider>
			</dataContext.Provider>
		</div>
	);
}

export default App;
