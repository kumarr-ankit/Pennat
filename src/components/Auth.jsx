import React, { useContext, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { userContext } from "../context/Context";
import { LoaderCircle } from "lucide-react";

function Auth() {
	const navi = useNavigate();

	const [userInfo, isLoading] = useContext(userContext);
	if (navigator.onLine) {
		console.log("Device seems to be connected to a network.");
	} else {
		console.log("Device is likely offline from a network perspective.");
	}

	useEffect(() => {
		async function loadUser() {
			if (isLoading) return;

			if (!userInfo) {
				navi("/login");
				return null;
			} else {
				navi("/home", { replace: true });
			}
		}
		loadUser();
	}, [navi, userInfo, isLoading]);
	return (
		<div className="max-w-screen min-h-screen  box-border ">
			{isLoading && (
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
								className=" animate-spin  py-2 rounded-2xl w-fit h-fit text-xs ">
								/
							</LoaderCircle>
						</div>
					</div>
				</div>
			)}

			{!isLoading && !userInfo && (
				<div className="bg-orange-200 w-fit m-auto p-4 rounded-xl border border-red-400 text-red-700">
					something went wrong.
				</div>
			)}
		</div>
	);
}

export default Auth;
