import React from "react";
import { Player, Controls } from "@lottiefiles/react-lottie-player";
import NoConnection from "/NoConnection.json?url";
import InternetStatus from "./InternetStatus";

function Offline() {
	let isOnline = InternetStatus();

	return (
		<div className="select-none h-screen w-screen flex flex-col-reverse items-center justify-center  ">
			<h2 className="text-center text-gray-300 bg-gray-800 rounded px-4 font-mono -mt-12 my-0 inline-block py-0 text-sm font-extralight">
				{isOnline ? "Connecting..." : "No Connection"}
			</h2>

			<Player
				autoplay
				loop
				speed={2}
				className="h-40 m-0 sm:h-54 md:h-60"
				src={NoConnection}></Player>
		</div>
	);
}

export default Offline;
