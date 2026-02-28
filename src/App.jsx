import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";

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
import UserControl from "./components/UserControl";
import { LoaderCircle } from "lucide-react";

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
		path: "/write",
		element: (
			<>
				<ArticleWriter />
			</>
		),
		errorElement: <h2>Error Occurred.🙂</h2>,
	},
	{
		path: "/profile/:username",
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
				<Profile />
			</>
		),
	},
	{
		path: "/control",
		element: (
			<>
				<UserControl />
			</>
		),
	},
]);

function App() {
	console.log("SUPABASE URL:", import.meta.env.VITE_SUPABASE_URL);

	const [articlesData, setArticlesData] = useState([]);
	const [userInfo, setUserInfo] = useState();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function loadUser() {
			let res = await supabase.auth.getUser();

			if (res?.data?.user) {
				let { id } = res.data.user;

				let { data, error } = await supabase
					.from("UserTable")
					.select("*,ArticleTable(*)")
					.eq("user_id", id)
					.single();

				setUserInfo(data ?? null);

				if (error) {
					//setLoading(true);
					console.log(error);
					return null;
				}
			}
			setLoading(false);
		}
		loadUser();
	}, []);

	// theme handle
	let theme = localStorage.getItem("theme");

	if (theme == null) {
		localStorage.setItem("theme", "light");
	}
	const [isDark, setIsDark] = useState(localStorage.getItem("theme"));

	//check for pwa
	let isPwa = localStorage.getItem("pwa");
	if (isPwa == null) {
		localStorage.setItem("pwa", true);
	}

	if (loading)
		return (
			<div className="min-h-screen flex items-center justify-center dark:bg-black">
				<div className="flex items-center gap-2 text-gray-600">
					<LoaderCircle size={24} className="animate-spin" />
					<span>Hold tight...</span>
				</div>
			</div>
		);

	return (
		<div
			className={`${isDark == "dark" ? "dark" : ""}
		*:dark:bg-[#121212]
		*:dark:text-[#E0E0E0]
		mx-0
		*:mx-0
		*:my:0
		
		*:box-border
		dark:bg-black
		`}>
			<Toaster position="top-center" />
			<InstallPWA />
		

			<dataContext.Provider value={[articlesData, setArticlesData]}>
				<userContext.Provider value={[userInfo,loading]}>
					<themeContext.Provider value={[isDark, setIsDark, theme]}>
						<RouterProvider router={router}></RouterProvider>
					</themeContext.Provider>
				</userContext.Provider>
			</dataContext.Provider>
		</div>
	);
}

export default App;
