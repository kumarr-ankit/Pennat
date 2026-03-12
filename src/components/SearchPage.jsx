import React, { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import NavbarPage from "./NavbarPage";

function SearchPage() {
    const [searchParams,] = useSearchParams(); 
	const param = useParams();
	console.log(param);
	let searchQuery = searchParams.get('q');

	const navigate = useNavigate();

	useEffect(() => {
		if (!searchQuery) {
			//	navigate("/home");
			return;
		}
	}, [searchQuery, navigate]);

	return (
		<div>
			<NavbarPage />
			<div className="h-screen w-screen flex items-center justify-center">
				<h1 className="text-9xl font-extrabold">{searchQuery}</h1>

			</div>
		</div>
	);
}

export default SearchPage;
