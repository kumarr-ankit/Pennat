import React, { useRef, useState } from "react";
import supabase from "../config/supabaseClient";
import { AlertColors } from "./ui/AlertColors";
import { AlertBasic } from "./ui/AlertBasic";
import { useNavigate } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { toast } from "sonner";

function Signup() {
	const [errorMsg, setErrorMsg] = useState(null);
	const [userData, setUserData] = useState(null);
	const [showForm, setShowForm] = useState(false); // to handle forms visiblity
	const [success, setSuccess] = useState();
	const navi = useNavigate();

	const emailRef = useRef();
	const passwordRef = useRef();
	const nameRef = useRef();
	const dobRef = useRef();
	const usernameRef = useRef();

	async function handleSubmit() {
		event.preventDefault();
		let email = emailRef.current.value;
		let password = passwordRef.current.value;

		let { error, data } = await supabase.auth.signUp({
			email: email,
			password: password,
			options: {
				data: {},
			},
		});
		if (error) {
			console.log("error is.");

			setErrorMsg(error);
			setUserData(null);

			return;
		}
		if (data) {
			console.log("Data is.");
			console.log(data);
			setErrorMsg(null);
			toast(
				"💡 Please remember your password or copy it. Password : " +
					passwordRef.current.value
			);
			setUserData(data.user);
			setSuccess(true);
			setTimeout(() => {
				setShowForm(true);
				setSuccess(false);
			}, 1000);
			console.log(data.user);
		}
	}

	async function handleUserData() {
		console.log(userData);
		event.preventDefault();
		let fullname = nameRef.current.value;
		let username = usernameRef.current.value;
		let dob = dobRef.current.value;
		console.log({
			fullname: fullname,
			username: username,
			dob: dob,
		});

		let { data, error } = await supabase
			.from("UserTable")
			.insert([
				{
					username: username,
					name: fullname,
					email: userData.email,
					gender: "1",
				},
			])
			.select();
		if (error) {
			setErrorMsg(error);
			return;
		}
		if (data) {
			console.log(data);
			setSuccess(true);

			setTimeout(() => {
				setSuccess(false);
				navi("/auth");
			}, 1000);
		}
	}
	return (
		<div
			className="
			h-screen
     bg-linear-to-r from-slate-900 to-slate-800  
    
    max-w-screen bg-center bg-cover ">
			<h1 className="text-2xl font-bold pl-5 text-clip b inline text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-pink-600  w-full ">
				Pennat
			</h1>

			<div className="">
				<p className="text-5xl    ml-4   mt-4   font-extrabold font-fontVerdana md:text-7xl sm:text-5xl text-white">
					Give your <span className="text-blue-600  text-7xl ">stories</span> a
					home.
				</p>
				<p className="px-2 text-xl border-s-4 border-blue-600 mt-8 ml-12 font-norml font-sans my-4  w-fit   text-gray-400  ">
					Join a community of modern thinkers. Get started now.
				</p>

				{!showForm && (
					<form action="." onSubmit={handleSubmit}>
						<div className="mx-12">
							<label
								htmlFor="email"
								className="font-stretch-50% font-normal font-[verdana] text-white">
								Enter your email
							</label>{" "}
							<br />
							<input
								ref={emailRef}
								type="email"
								id="email"
								required
								placeholder="pennat@exmple.com"
								className="p-2 border lowercase rounded-sm
            bg-slate-300 
           
            min-w-56 text-black"
							/>
							<br />
							<br />
							<label
								htmlFor="password"
								className="font-stretch-50% font-normal   font-[verdana] text-white">
								Enter your password
							</label>{" "}
							<br />
							<input
								ref={passwordRef}
								type="text"
								id="password"
								required
								placeholder="Abcd1234$$@"
								minLength={6}
								maxLength={20}
								className="p-2 border rounded-sm bg-slate-300 min-w-56 text-black"
							/>
							<br />
							<p className="text-xs mt-2 text-gray-300">
								Min. length 6, include uppercase,lowercase,numbers and special
								symbols
							</p>
						</div>

						<button
							type="submit"
							className="bg-slate-900 px-4 py-2 mx-4 my-4 ml-12 border rounded-md active:bg-gray-600  text-white cursor-pointer ">
							Continue
						</button>

						{errorMsg && <AlertColors errorMsg={errorMsg} />}
						{success && (
							<AlertBasic
								title={"Account created successfully"}
								desc={"Please provide few details too."}
							/>
						)}
					</form>
				)}
				{showForm && (
					<form action="." onSubmit={handleUserData}>
						<div className="mx-12">
							<label
								htmlFor="fullname"
								className="font-stretch-50% font-normal font-[verdana] text-white">
								Enter your fullname
							</label>{" "}
							<br />
							<input
								ref={nameRef}
								type="text"
								id="fullname"
								required
								pattern="[A-Za-z]+( [A-Za-z]+)*"
								title="Enter a valid name (letters only, single space allowed)"
								placeholder="John Doe"
								className="p-2 border rounded-sm bg-slate-300 min-w-56 text-black"
							/>
							<br />
							<label
								htmlFor="username"
								className="font-stretch-50% font-normal font-[verdana] text-white">
								Create an username
							</label>{" "}
							<br />
							<input
								ref={usernameRef}
								type="text"
								id="username"
								required
								placeholder="johne_doe1"
								minLength={4}
								pattern="[a-z0-9_]+"
								className="p-2 border rounded-sm bg-slate-300 min-w-56 text-black"
							/>{" "}
							<br />
							<p className="text-xs mt-2 text-gray-300">
								Lowercase letters,numbers and _ is allowed.Keep it atleast four
								character long.
							</p>
							<br />
							<label
								htmlFor="dob"
								className="font-stretch-50% text-normal font-[verdana] text-white">
								Enter your DOB.
							</label>{" "}
							<br />
							<input
								ref={dobRef}
								type="date"
								id="dob"
								required
								placeholder="YYYY-MM-DD"
								minLength={4}
								className="p-2 border rounded-sm bg-slate-300 min-w-56 text-black"
							/>{" "}
						</div>

						<button
							type="submit"
							className="bg-slate-900 px-4 py-2 mx-4 my-4 ml-12 border rounded-md active:bg-gray-600  text-white cursor-pointer">
							Continue
						</button>

						{errorMsg && <AlertColors errorMsg={errorMsg} />}

						{success && (
							<AlertBasic
								title={"Details saved successfully"}
								desc={
									"Your profile information has been saved. Changes will be reflected immediately."
								}
							/>
						)}
					</form>
				)}
			</div>
			<p className="text-sm text-slate-200 ml-12">
				Already have an account?{" "}
				<span
					onClick={() => {
						navi("/login");
					}}
					className="text-blue-200 cursor-pointer underline ">
					Log in
					<ExternalLink className="inline ml-1 mb-1" size={"12px"} />
				</span>
			</p>
		</div>
	);
}

export default Signup;
