// src/components/InstallPWA.tsx
import { ArrowDownToLine, Download, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function InstallPWA({ show, Class }) {
	let pwa = localStorage.getItem("pwa");
	const [deferredPrompt, setDeferredPrompt] = useState(null);
	const [showInstallButton, setShowInstallButton] = useState(
		JSON.parse(pwa.toLowerCase())
	);

	useEffect(() => {
		const handler = (e) => {
			// Prevent Chrome 76+ from automatically showing the prompt
			e.preventDefault();
			// Stash the event so it can be triggered later
			setDeferredPrompt(e);

			if (pwa == "false") return;
			setShowInstallButton(true);
		};

		window.addEventListener("beforeinstallprompt", handler);

		return () => {
			window.removeEventListener("beforeinstallprompt", handler);
		};
	}, []);

	const handleInstallClick = async () => {
		
		if (!deferredPrompt) return;

		// Show the install prompt
		deferredPrompt.prompt();

		// Wait for the user to respond to the prompt
		const { outcome } = await deferredPrompt.userChoice;

		if (outcome === "accepted") {
			console.log("User accepted the install prompt");
		} else {
			console.log("User dismissed the install prompt");
		}

		setDeferredPrompt(null);
		//setShowInstallButton(false);
	};


	return (
		<>
			{(showInstallButton || show == true) && (
				<div
					className={`${
						Class
							? "w-fit h-fit"
							: "mt-60  fixed bottom-4 left-2 px-3 py-3 border rounded-full   shadow-2xl z-20 text-white hover:bg-gray-900 hover:cursor-pointer bg-black "
					}`}>
					<span className="absolute -top-2 right-0  bg-gray-700 rounded-full">
						<X
							size={16}
							onClick={(e) => {
								e.stopPropagation();
								setShowInstallButton(false);
								localStorage.setItem("pwa", false);
							}}
						/>
					</span>

					<div
						onClick={handleInstallClick}
						className="flex  items-center  text-gray-300">
						<ArrowDownToLine size={18} />
						<span className="pl-2 text-sm text-gray-500"> Install App</span>
					</div>
				</div>
			)}
		</>
	);
}
