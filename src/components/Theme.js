function updateStatusBar(isDark) {
	const meta = document.getElementById("statusBar");
	if (meta) meta.setAttribute("content", isDark ? "#0f172b" : "#ffffff");
}

export { updateStatusBar };
