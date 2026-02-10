import { ChevronLeft, ImageUp, PencilIcon, X } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import userDp from '../assets/user.png'

import { userContext } from "../context/Context";
import ImageUpdater from "./ImageUpdater";
import { cover_placeholder } from "../../public/resource";
import ProfileImageUpdater from "./ProfileEditor";

function ProfilePage() {
  const [userInfo] = useContext(userContext);
  console.log(userInfo);
  const [ImgEditor, setImgEditor] = useState(false);

  let name = userInfo && userInfo.name ? userInfo.name : "Alien";
  let username = userInfo && userInfo.username ? userInfo.username : "alien";
  let email = userInfo && userInfo.email ? userInfo.email : "not given";
  let about = userInfo && userInfo.about ? userInfo.about : "not set";
  let cover_img = userInfo ? userInfo.cover_img : cover_placeholder;
   let profile_img = userInfo ? userInfo.profile_img : userDp;



  const [cover, setCover] = useState(cover_img);
  const [popup, SetPopup] = useState();
  const [profileImg, setProfileImg] = useState(profile_img);


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

      <button className="fixed right-2 top-4 bg-white rounded-4xl py-1 px-1 ">
        <PencilIcon
          height={"16px"}
          onClick={() => {
            SetPopup((p) => !p);
          }}
          className="hover:-rotate-8 cursor-pointer"
        />
      </button>

      {/* Top gradient header */}
      <img
        src={cover_img}
        className=" w-screen max-h-50  rounded-b-sm
      bg-cover
      "
      />

      {/* Profile Card */}
      <div className="-mt-24 max-w-xl mx-auto px-4">
        <div className="bg-transparent  rounded  p-6">
          {/* Avatar */}
          <div className="flex relative [&>button]:hidden [&:hover>button]:block flex-col items-center">
            <button className="absolute   ml-18 bg-white rounded-4xl py-1 px-1 ">
              <PencilIcon
                height={"16px"}
                onClick={() => {
                  setImgEditor((p) => !p);
                }}
                className="hover:-rotate-8 cursor-pointer"
              />
            </button>
            <img
              src={profile_img}
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

      {popup && userInfo && (
        <ImageUpdater
          setCover={setCover}
          SetPopup={SetPopup}
          cover={userInfo?.cover_img || cover}
          user_id={userInfo.user_id}
        />
      )}

      {ImgEditor && (
        <ProfileImageUpdater
          profileImg={profileImg}
          setProfileImg={setProfileImg}
          setImgEditor={setImgEditor}
          user_id={userInfo?.user_id}
        />
      )}


   
    </div>
  );
}

export default ProfilePage;
