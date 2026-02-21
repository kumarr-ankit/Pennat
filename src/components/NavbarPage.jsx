import { Pen, Pencil, User } from "lucide-react";
import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

function NavbarPage() {
	const naviagtors = useNavigate();

	return (
		<nav className="flex   w-full justify-between px-4 fixed 
		dark:bg-[#121212]
		top-0  z-2  py-2">
			<div>
				<h1 className="font-bold text-3xl pl-2">Pennat</h1>
			</div>
			<div>
				<ul
					className="flex
             justify-evenly  
             *:p-2
              *:px-3
            [&>li:hover]:bg-slate-900
             *:my-1
              *:rounded-full

             [&>li:hover]:text-white
               [&>li:hover]:cursor-pointer">
					{/* <li>
							<label
							className="flex flex-col sm:flex-row items-center text-xs sm:text-[1rem]"
							
							htmlFor="writer"
							>
								{" "}
								<Pen height={"16px"} />
								<span>Write</span>
							</label>
						</li> */}
					{/* <li>For You</li> */}
					{/* <li>Following</li> */}
					<li
						onClick={() => {
							naviagtors("/profile");
						}}>
						<span className="flex flex-col sm:flex-row items-center text-xs sm:text-[1rem]">
							{" "}
							<User height={"16px"} />
							<span className="">Profile</span>
						</span>
					</li>
				</ul>
			</div>
		</nav>
	);
}

export default NavbarPage;
