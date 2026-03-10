import React, { useContext, useEffect, useRef, useState } from "react";
import supabase from "../config/supabaseClient";
import { AlertBasic } from "./ui/AlertBasic";
import { ExternalLink, LineChart, LoaderCircle } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { AlertColors } from "./ui/AlertColors";
import { userContext } from "../context/Context";
import { toast } from "sonner";

function Login() {
	const [errorMsg, setErrorMsg] = useState(null);
	const [, setSuccess] = useState();
	const emailRef = useRef();
	const passwordRef = useRef();
	const navi = useNavigate();
	const [userInfo, , loadUser] = useContext(userContext);

	useEffect(() => {
		if (userInfo) {
			console.log("Navigatting");
			navi("/home", {
				replace: true,
			});
			return;
		}
	}, []);

	

	async function handleSubmit() {
		event.preventDefault();
		let email = emailRef.current.value;
		let password = passwordRef.current.value;

		try {
			let { data, error } = await supabase.auth.signInWithPassword({
				email: email,
				password: password,
			});

			if (error) {
				console.log("error is.");

				if (!error.code) {
					setErrorMsg({
						code: null,
						message: "Something went wrong.",
					});
					alert(error);
				} else {
					setErrorMsg(error);
				}

				return;
			}
			if (data) {
				console.log("Data is.");
				console.log(data);
				setErrorMsg(null);
				setSuccess(true);
				toast("Success! You logged in.");
				await loadUser();
				setTimeout(() => {
					navi("/auth");
				}, 1000);
			}
		} catch (error) {
			console.log(error);
			setErrorMsg(error);
		}
	}

	return (
		<>
			{!userInfo && (
				<div>
					<div className="bg-linear-to-r from-slate-900 to-slate-800    min-h-screen max-w-screen bg-center bg-cover ">
						<h1 className="text-2xl  font-bold px-2 text-clip b inline text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-pink-600  w-full ">
							Pennat
						</h1>

						<div className="mt-16">
							<p className="text-5xl    mt-4 ml-4    font-extrabold font-fontVerdana md:text-7xl sm:text-5xl px-2 text-white">
								Welcome{" "}
								<span className="text-blue-600  ">
									{" "}
									<br />
									back{" "}
									<span className="inline-block -ml-2 mx-0 px-0 rotate-6 hover:rotate-0 transition-transform duration-300 cursor-default">
										!
									</span>
								</span>
							</p>
							<p className="px-2 text-xl border-s-4 border-blue-600 mt-12  ml-12 font-norml font-sans my-4  w-fit   text-gray-400  ">
								Log in to your digital desk.
							</p>

							<form onSubmit={handleSubmit}>
								<div className="mx-12 ">
									<label
										htmlFor="email"
										className="font-stretch-50% font-normal font-[verdana] text-white">
										Enter your email
									</label>{" "}
									<br />
									<input
										onChange={() => {
											setErrorMsg(null);
										}}
										ref={emailRef}
										type="email"
										id="email"
										required
										title="Enter your email"
										placeholder="pennat@exmple.com"
										className="p-2 lowercase border rounded-sm  bg-slate-300 min-w-56 text-black"
									/>
									<br />
									<br />
									<label
										htmlFor="password"
										className="font-stretch-50% font-normal  font-[verdana] text-white">
										Enter your password
									</label>{" "}
									<br />
									<input
										onChange={() => {
											setErrorMsg(null);
										}}
										ref={passwordRef}
										type="text"
										id="password"
										required
										placeholder="••••••"
										minLength={6}
										maxLength={20}
										title="enter your password"
										className="p-2 border rounded-sm 
                 
               bg-slate-300 
              
               min-w-56 text-black"
									/>{" "}
									<br />
									<p className="text-xs font-light wrap-anywhere text-slate-200">
										Possibly your password had min. length 6, included
										uppercase,lowercase,numbers and special symbols.
									</p>
								</div>

								<div className="flex items-center">
									{" "}
									<button
										type="submit"
										className="bg-slate-900 px-4 py-2 mx-4 my-4 ml-12 border rounded-md active:bg-gray-600  text-white cursor-pointer">
										Continue
									</button>
									<p className="text-sm text-slate-200">
										<NavLink to={"/flow"}>Forgot password?</NavLink>
									</p>
								</div>

								{errorMsg && <AlertColors errorMsg={errorMsg} />}
							</form>

							<br />
							<p className="text-sm text-slate-200 ml-12">
								Don't have an account?{" "}
								<span
									onClick={() => {
										navi("/signup");
									}}
									className="text-blue-200 cursor-pointer underline ">
									Create one
									<ExternalLink className="inline ml-1 mb-1" size={"12px"} />
								</span>
							</p>
						</div>
					</div>
				</div>
			)}

			{userInfo && (
				<div
					className={` min-h-screen flex items-center justify-center bg-background`}>
					<div className="flex items-center gap-2 text-foreground ">
						<LoaderCircle size={24} className="animate-spin" />
						<span>Hold tight...</span>
					</div>
				</div>
			)}
		</>
	);
}

export default Login;
