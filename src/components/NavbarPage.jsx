import { User } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

function NavbarPage() {
  const naviagtors = useNavigate();

  return (
    <>
      <nav className="flex   w-full justify-between px-4 fixed top-0 backdrop-blur-2xl   py-2">
        <div>
          <h1 className="font-bold text-3xl pl-2">Pennat</h1>
        </div>
        <div>
          <ul
            className="flex
             justify-evenly  
             *:p-2
              *:px-4
            [&>li:hover]:bg-slate-900
             *:m-1
              *:rounded-full

             [&>li:hover]:text-white
               [&>li:hover]:cursor-pointer"
          >
            {/* <li>For You</li> */}
            {/* <li>Following</li> */}
            <li
              onClick={() => {
                naviagtors("/profile");
              }}
            >
              <span className="flex  items-center ">
                {" "}
                <User height={"16px"}/>
                <span className="">Profile</span>
              </span>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}

export default NavbarPage;
