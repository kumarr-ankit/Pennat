import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "../config/supabaseClient";
import { cover_placeholder } from "../../public/resource";
import userDp from "../assets/user.png";
import {
	ChevronLeft,
	Circle,
	ImageUp,
	LoaderCircle,
	PencilIcon,
	WheatIcon,
	X,
} from "lucide-react";
import ImageUpdater from "./ImageUpdater";

import ProfileImageUpdater from "./ProfileEditor";
import UserProfilePosts from "./UserProfilePosts";

function Profile() {
	const { username } = useParams();

	let [userInfo, setUserInfo] = useState();

	useEffect(() => {
		async function loaddata() {
			const res = await supabase
				.from("UserTable")
				.select("*,ArticleTable(*)")
				.eq("username", username)
				.single();

			if (res.error) return;

			if (res.data) setUserInfo(res.data);
		}

		loaddata();
	}, [setUserInfo, username]);

	const [ImgEditor, setImgEditor] = useState(false);
	const [loaded, setLoaded] = useState(false);
	const [failed, setFailed] = useState(false);
	const [popup, SetPopup] = useState(false);

	const [cover, setCover] = useState(cover_placeholder);
	const [profileImg, setProfileImg] = useState(userDp);
	const [about, setAbout] = useState("");

	useEffect(() => {
		function loader() {
			if (userInfo !== null && userInfo !== undefined) {
				setCover(userInfo.cover_img || cover_placeholder);
				setProfileImg(userInfo.profile_img || userDp);
				setAbout(userInfo.about || "");
				setLoaded(true);
				setFailed(false);
			} else {
				setLoaded(false);
			}
		}

		loader();
	}, [userInfo]);

	const name = userInfo?.name || "";
	const user_name = userInfo?.username || "";

	if (!loaded && !failed) {
		return (
			<div className="min-h-screen 
			dark:bg-[#1F1B24]
			dark:*:text-gray-100
			
			flex items-center justify-center">
				<div className="flex items-center gap-2 text-gray-600">
					<LoaderCircle size={24} className="animate-spin" />
					<span>Loading profile...</span>
				</div>
			</div>
		);
	}

	if (failed) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="bg-orange-200 w-fit p-4 rounded-xl border border-red-400 text-red-700">
					Something went wrong loading the profile.
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen from-gray-50 to-gray-200 box-border max-w-[99%] ">
			<button
				onClick={() => history.back()}
				className="fixed top-5 left-5 z-10 cursor-pointer rounded-full bg-white dark:bg-[#1F1B24] backdrop-blur 
               p-2 shadow hover:scale-105 transition">
				<ChevronLeft  />
			</button>

			<button className="fixed right-2 top-4 dark:bg-[#1F1B24] bg-gray-200 z-20 rounded-4xl py-3 px-2 ">
				<PencilIcon
					height={"16px"}
					onClick={() => {
						SetPopup((p) => !p);
					}}
					className="hover:-rotate-8 cursor-pointer "
				/>
			</button>

			{cover && (
				<div className="w-full overflow-x-hidden bg-gray-100 max-h-50 rounded-b-sm p-2 h-50 flex justify-center bg-cover overflow-clip">
					{" "}
					<img
						src={cover}
						className=" max-w-full w-fit  rounded-b-sm scale-200 sm:scale-300 md:scale-600 lg:scale-700 overflow-hidden "
					/>
				</div>
			)}

			<div className="-mt-24 max-w-xl mx-auto px-4">
				<div className="bg-transparent rounded p-6">
					<div className="flex relative [&>button]:hidden [&:hover>button]:block flex-col items-center">
						{profileImg && (
							<>
								<button className="absolute ml-18 bg-white rounded-4xl py-1 px-1 dark:bg-[#1F1B24]">
									<PencilIcon
										height={"16px"}
										onClick={() => {
											setImgEditor((p) => !p);
										}}
										className="hover:-rotate-8 cursor-pointer"
									/>
								</button>
								<img
									src={profileImg}
									alt="user"
									className="w-32 h-32 rounded-full ring-4 ring-white shadow-md object-cover"
								/>
							</>
						)}

						{name && (
							<h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-gray-100">{name}</h2>
						)}

						{user_name && <p className="text-sm  text-gray-500">@{user_name}</p>}
					</div>

					<div className="space-y-0">
						{/* {email && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Email
                </p>
                <p className="text-gray-800 mt-1 break-all">{email}</p>
              </div>
            )} */}

						{about && (
							<div>
								<p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
									About me
								</p>
								<p className="text-gray-700 mt-1 leading-relaxed    rounded">
									{about}
								</p>
							</div>
						)}
					</div>
				</div>
			</div>

			{popup && userInfo && (
				<ImageUpdater
					setCover={setCover}
					SetPopup={SetPopup}
					cover={cover}
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

			{userInfo?.ArticleTable && (
				<UserProfilePosts ArticleTable={userInfo?.ArticleTable} />
			)}
		</div>
	);
}

export default Profile;
