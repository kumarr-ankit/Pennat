// src/components/InstallPWA.tsx
import { ArrowDownToLine, Download, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function InstallPWA() {
	const [deferredPrompt, setDeferredPrompt] = useState(null);
	const [showInstallButton, setShowInstallButton] = useState(localStorage.getItem('showPWA'));

	useEffect(() => {
		const handler = (e) => {
			// Prevent Chrome 76+ from automatically showing the prompt
			e.preventDefault();
			// Stash the event so it can be triggered later
			setDeferredPrompt(e);
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
		setShowInstallButton(false);
	};

	if (!showInstallButton) return null;

	return (
		<div
			className="mt-60 fixed bottom-4 right-2 px-5 py-4 bg-black rounded-full border-0 shadow-2xl z-20 text-white hover:bg-gray-900 hover:cursor-pointer"
			onClick={handleInstallClick}>
			<span className="absolute -top-2 right-1 bg-white rounded-full">
				<X
					size={16}
					onClick={(e) => {
						e.stopPropagation();
						setShowInstallButton(false);
						localStorage.setItem('showPWA',true);
					}}
				/>
			</span>

			<div className="flex  items-center">
				<ArrowDownToLine size={18} />
				<span className="pl-2"> Install App</span>
			</div>
		</div>
	);
}
