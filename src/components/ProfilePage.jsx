import { ChevronLeft } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import userDp from "../assets/user.png";
import { userContext } from "../context/Context";


function ProfilePage() {

  const [userInfo] = useContext(userContext);

  let name = userInfo ? userInfo.name : "Alien";
  let username = userInfo ? userInfo.username : "alien";
  let email = userInfo ? userInfo.email : "not given";
  let about = userInfo ? userInfo.about : "not set";

  return (
    <div className="min-h-screen  from-gray-50 to-gray-200">
      {/* Back button */}
      <button
        onClick={() => history.back()}
        className="fixed top-5 left-5 z-10 cursor-pointer rounded-full bg-white/80 backdrop-blur 
                   p-2 shadow hover:scale-105 transition"
      >
        <ChevronLeft className="text-gray-700" />
      </button>

      {/* Top gradient header */}
      <div className="h-52 bg-gradient-to-r rounded-b-sm from-black to-gray-100" />

      {/* Profile Card */}
      <div className="-mt-24 max-w-xl mx-auto px-4">
        <div className="bg-white rounded  p-6">
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <img
              src={userDp}
              alt="user"
              className="w-32 h-32 rounded-full ring-4 ring-white shadow-md object-cover"
            />

            <h2 className="mt-4 text-2xl font-bold text-gray-900">{name}</h2>

            <p className="text-sm text-gray-500">@{username}</p>
          </div>

          {/* Divider */}
          <div className="my-6 h-px rounded-4xl bg-gray-100" />

          {/* Info */}
          <div className="space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Email
              </p>
              <p className="text-gray-800 mt-1 break-all">{email}</p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                About
              </p>
              <p className="text-gray-700 mt-1 leading-relaxed">{about}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
