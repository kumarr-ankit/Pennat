import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
	ChevronLeft,
	ChevronRight,
	Ellipsis,
	LoaderCircle,
	LogOut,
	MoveRight,
	PencilIcon,
} from "lucide-react";
import supabase from "../config/supabaseClient";
import { userContext } from "../context/Context";
import userDp from "../assets/user.png";
import { cover_placeholder } from "../../public/resource";

// Components
import ImageUpdater from "./ImageUpdater";
import ProfileImageUpdater from "./ProfileEditor";
import UserProfilePosts from "./UserProfilePosts";
import ProfileFooter from "./ProfileFooter";
import { AlertDialogBasic } from "./ui/AlertDialogBasic";

function Profile() {
	// 1. Context and Params
	const { username: urlUsername } = useParams();
	const navigate = useNavigate();
	const [currentUser] = useContext(userContext);
	// 2. Local State
	const [profileData, setProfileData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [failed, setFailed] = useState(false);

	const [ImgEditor, setImgEditor] = useState(false);
	const [popup, SetPopup] = useState(false);

	// UI States (Synced with profileData)
	const [cover, setCover] = useState(cover_placeholder);
	const [profileImg, setProfileImg] = useState(userDp);
	const [about, setAbout] = useState("");
	const [control, setControl] = useState(false);

	// 3. Logic: Decide which data to load

	//check for viewing other profile
	let isMyProfile = useRef(true);

	const [info] = useContext(userContext);
	if (!info) navigate("/login");
	useEffect(() => {
		if (urlUsername) {
			isMyProfile.current = false;
		}
		async function fetchProfile() {
			setLoading(true);

			// Scenario A: Viewing someone else's profile (or own profile via URL)
			if (urlUsername) {
				const res = await supabase
					.from("UserTable")
					.select("*, ArticleTable(*)")
					.eq("username", urlUsername)
					.single();

				if (res.error) {
					setFailed(true);
				} else {
					setProfileData(res.data);
					setFailed(false);
				}
			}
			// Scenario B: Viewing own profile page (no username in URL)
			else if (currentUser) {
				setProfileData(currentUser);
				setFailed(false);
			}

			setLoading(false);
		}

		fetchProfile();
	}, [urlUsername, currentUser]);

	// 4. Update UI visuals when profileData changes
	useEffect(() => {
		function myFunction() {
			if (profileData) {
				setCover(profileData.cover_img || cover_placeholder);
				setProfileImg(profileData.profile_img || userDp);
				setAbout(profileData.about || "");
			}
		}
		myFunction();
	}, [profileData]);

	// 5. Permission Check: Is this the logged-in user's own profile?
	const isOwnProfile = currentUser?.user_id === profileData?.user_id;

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center dark:bg-black">
				<div className="flex items-center gap-2 text-gray-600">
					<LoaderCircle size={24} className="animate-spin" />
					<span>Loading profile...</span>
				</div>
			</div>
		);
	}

	if (failed || !profileData) {
		return (
			<div className="min-h-screen flex items-center justify-center dark:bg-black">
				<div className="bg-orange-100 p-4 rounded-xl border border-orange-200 text-orange-700">
					User not found or something went wrong.
				</div>
			</div>
		);
	}

	async function handleLogOut() {
		const res = await supabase.auth.signOut();
		if (res.error) {
			alert(`Can't LogOut.
        Error : ${res.error.message}`);
			return null;
		}

		localStorage.removeItem("theme");
		navigate("/login");
	}
	return (
		<div className="relative dark:text-gray-400 dark:bg-black bg-white pb-1 box-border w-full min-h-screen">
			{/* Navigation & Edit Controls */}
			<div className="absolute w-full z-10 p-4">
				<div className="w-full flex justify-between items-center">
					<button
						onClick={() => navigate("/home", true)}
						className="p-2 rounded-full dark:bg-[#1F1B24] bg-white shadow-lg hover:scale-105 transition cursor-pointer">
						<ChevronLeft />
					</button>

					{/* Only show Edit Pencil if it's the user's own profile */}
					{isOwnProfile && (
						<div
							onClick={() => {
								setControl((p) => !p);
							}}
							className={`p-2  relative text-foreground dark:bg-[#000000]  flex justify-end rounded-full ${
								control && "bg-background text-foreground"
							}`}>
							{" "}
							<Ellipsis size={24} className={!control && "text-amber-50"} />
							<ul
								hidden={!control}
								className="absolute z-50 right-10  w-fit min-w-[20vw]   sm:min-w-[10vw]  rounded-md dark:bg-[#1F1B24] bg-gray-100 shadow-lg transition cursor-pointer p-1
                            *:hover:border
                            *:rounded-md
                            *:hover:bg-gray-600
                            ">
								<li>
									<button
										className="p-1 px-4 whitespace-nowrap flex items-center   transition cursor-pointer  w-full "
										onClick={() => SetPopup(true)}>
										<PencilIcon
											size={14}
											className="hover:-rotate-12 mx-1 mr-5"
										/>{" "}
										Edit
									</button>
								</li>

								<li>
									<div className="p-1 w-full px-4 whitespace-nowrap flex items-center   transition cursor-pointer hover:bg-red-800 rounded-md">
										<LogOut size={14} className="mx-1" />
										<AlertDialogBasic
											className={`px-0`}
											titleText={`Log Out  `}
											handleLogOut={handleLogOut}
										/>
									</div>
								</li>

								<li>
									<button
										className="p-1 px-4 whitespace-nowrap flex items-center   transition cursor-pointer "
										onClick={() => navigate("/control")}>
										<ChevronRight
											size={14}
											className="hover:-rotate-12 mx-1 mr-5"
										/>{" "}
										More
									</button>
								</li>
							</ul>
						</div>
					)}
				</div>
			</div>

			{/* Cover Image */}
			<div className="w-full  bg-gray-100 max-h-60 dark:bg-[#1F1B24] h-52 flex justify-center">
				<img src={cover} alt="cover" className="w-full h-full object-cover" />
			</div>

			{/* Profile Info Section */}
			<div className="-mt-20 max-w-xl mx-auto px-4 relative ">
				<div className="flex flex-col items-center">
					<div className="relative group">
						<img
							src={profileImg}
							alt="profile"
							className="w-32 h-32 rounded-full ring-4 ring-white dark:ring-[#1F1B24] shadow-xl object-cover"
						/>
						{/* Edit Profile Image Button (Only for owner) */}
						{isOwnProfile && (
							<button
								onClick={() => setImgEditor(true)}
								className="absolute bottom-1 right-1 p-2 bg-white dark:bg-[#1F1B24] rounded-full shadow-md border dark:border-gray-700 transition transform hover:scale-110 cursor-pointer">
								<PencilIcon size={14} />
							</button>
						)}
					</div>

					<div className="flex items-center mt-4">
						<h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
							{profileData.name}
						</h2>
						<p className="text-sm ml-1 items-center mt-1 text-gray-500">
							@{profileData.username}
						</p>
					</div>

					<div className=" w-full flex gap-8 justify-center mt-2 ">
						<div className="flex flex-col justify-center items-center">
							<label className="text-sm" htmlFor="followers">
								Followers
							</label>
							<p className="font-semibold">44M</p>
						</div>
						<div className="flex flex-col justify-center items-center">
							<label className="text-sm" htmlFor="following">
								Following
							</label>
							<p className="font-semibold">4K</p>
						</div>
					</div>

					{!isOwnProfile && (
						<div className="border p-2 rounded-md mx-2 bg-foreground text-background mt-2 hover:text-foreground hover:font-semibold hover:bg-gray-500 transition-all duration-400  shadow-2xs cursor-pointer">
							Follow
						</div>
					)}
					{about && (
						<div className="mt-4 text-center">
							<p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
								About
							</p>
							<p className="text-gray-700 dark:text-gray-400 leading-relaxed max-w-sm">
								{about}
							</p>
						</div>
					)}
				</div>
			</div>

			{/* Modals */}
			{popup && isOwnProfile && (
				<ImageUpdater
					setCover={setCover}
					SetPopup={SetPopup}
					cover={cover}
					user_id={profileData.user_id}
				/>
			)}

			{ImgEditor && isOwnProfile && (
				<ProfileImageUpdater
					profileImg={profileImg}
					setProfileImg={setProfileImg}
					setImgEditor={setImgEditor}
					user_id={profileData?.user_id}
				/>
			)}

			{/* Posts Section */}
			<div className="mt-8 border-t dark:border-gray-800">
				{profileData.ArticleTable && (
					<UserProfilePosts ArticleTable={profileData.ArticleTable} />
				)}
			</div>

			<ProfileFooter />
		</div>
	);
}

export default Profile;
