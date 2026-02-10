import React, { useState } from "react";
import { ChevronLeft, ImageUp, PencilIcon, X } from "lucide-react";
import supabase from "../config/supabaseClient";

const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const dbname = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

function ProfileImageUpdater({
  setImgEditor,
  user_id,
  profileImg,
  setProfileImg,
}) {
  const [preview, setPreview] = useState();
  const [file, setFile] = useState();

  console.log(user_id);

  async function handleImgSubmit() {
    event.preventDefault();

    if (file) {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", preset);
      data.append("cloud_name", dbname);

      try {
        let cloudinaryRes = await fetch(
          `https://api.cloudinary.com/v1_1/${dbname}/image/upload`,
          {
            method: "POST",
            body: data,
          }
        );

        let cloudinaryData = await cloudinaryRes.json();

        //console.log(cloudinaryData)

        //console.log(cloudinaryRes);

        if (cloudinaryRes.ok && user_id) {
         
          console.log("url", cloudinaryData.secure_url);
          console.log("Calling supabase.");
          let supabaseRes = await supabase
            .from("UserTable")
            .update({ profile_img: cloudinaryData?.secure_url })
            .eq("user_id", user_id)
            .select();

          console.log(supabaseRes);

          if (supabaseRes.error) {
            console.log("We got error");
            console.log(supabaseRes.error);
            return;
          } else {
            console.log("We got data.");
            console.log(supabaseRes.data);
            setProfileImg(preview);
            setPreview(null);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  function handleChange() {
    let fileData = event.target.files[0];
    if (fileData) {
      let url = URL.createObjectURL(fileData);
      setPreview(url);
      console.log(fileData);
      setFile(fileData);
    }
  }

  return (
    <div className="fixed box-border  bg-gray-300 rounded-xl py-8 px-8 my-auto mx-8 h-fit w-fit left-0 right-0 top-0 bottom-0">
      <X
        onClick={() => {
          setImgEditor((p) => !p);
        }}
        height={"18px"}
        className="bg-white rounded-4xl cursor-pointer absolute -top-2 -right-2"
      />

      <div className="w-full font-bold text-2xl">Edit profile photo</div>

      <div>
        <img
          src={profileImg}
          alt="current cover"
          className="rounded-xl my-2 max-h-40 max-w-full"
        />
      </div>
      <form
        onReset={() => {
          setPreview(null);
        }}
      >
        <label
          htmlFor="img-input"
          className="w-full rounded-xl p-2 border hover:bg-gray-400 cursor-pointer"
        >
          {" "}
          <ImageUp className="inline" />
          <input
            type="file"
            accept="image/*"
            id="img-input"
            onChange={handleChange}
            className="inline p-4 cursor-pointer "
          />
        </label>
        {preview && (
          <div className="w-full  ">
            <label htmlFor="reset" className="relative">
              {" "}
              <input type="reset" id="reset" value="" />{" "}
              <X
                height={"18px"}
                className="bg-white rounded-4xl absolute top-4 p-0.5 -left-1"
              />
            </label>
            <img
              src={preview}
              alt="preview"
              className="rounded-xl w-fit max-h-40"
            />

            <div>
              <button
                type="submit"
                className="bg-black cursor-pointer text-white px-4 py-2 rounded-xl mt-2"
                onClick={handleImgSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default ProfileImageUpdater;
