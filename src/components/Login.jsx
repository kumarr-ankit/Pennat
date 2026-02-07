import React, { useRef, useState } from "react";
import supabase from "../config/supabaseClient";
import { AlertBasic } from "./ui/AlertBasic";
import { ExternalLink, LineChart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AlertColors } from "./ui/AlertColors";


function Login() {
  const [errorMsg, setErrorMsg] = useState(null);
  const [success, setSuccess] = useState();
  const emailRef = useRef();
  const passwordRef = useRef();

  const navi = useNavigate();

  async function handleSubmit() {
    event.preventDefault();
    let email = emailRef.current.value;
    let password = passwordRef.current.value;

    let { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) {
      console.log("error is.");

      setErrorMsg(error);
      return;
    }
    if (data) {
      console.log("Data is.");
      console.log(data);
      setErrorMsg(null);
      setSuccess(true);
     navi('/auth')
    }
  }

  return (
    <div  className="bg-[url('/background.jpeg')] min-h-screen max-w-screen bg-center bg-cover ">
      <h1 className="text-3xl font-bold px-2 text-clip b inline text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-pink-600  w-full ">
        Pennat
      </h1>

      <div className="mt-16">
        <p className="text-4xl m-3 font-bold font-[verdana] md:text-7xl sm:text-5xl p-2 text-white">
          Welcome to new era. of digital jouranling
        </p>
        <p className="px-2 text-2xl border-s-4 ml-12 font-semibold font-sans my-8 w-fit   rounded text-white">
          Login to your account
        </p>
       
        <form action="." onSubmit={handleSubmit}>
          <div className="mx-12">
            <label
              htmlFor="email"
              className="font-stretch-50% font-normal font-[verdana] text-black sm:text-white"
            >
              Enter your email
            </label>{" "}
            <br />
            <input
              ref={emailRef}
              type="email"
              id="email"
              required
              title="Enter your email"
              placeholder="pennat@exmple.com"
              className="p-2 border rounded  
               bg-slate-300 
              
               min-w-56 text-black"
            />
            <br />
            <label
              htmlFor="password"
              className="font-stretch-50% font-normal  font-[verdana] text-black sm:text-white"
            >
              Enter your password
            </label>{" "}
            <br />
            <input
              ref={passwordRef}
              type="text"
              id="password"
              required
              placeholder="••••••"
              minLength={6}
              maxLength={20}
              title="enter your password"
              className="p-2 border rounded  
                 
               bg-slate-300 
              
               min-w-56 text-black"
            />{" "}
            <br />
            <p className="text-sm text-slate-200">
              {/* Min. length 6, include uppercase,lowercase,numbers and special
                symbols */}
            </p>
          </div>

          <button
            type="submit"
            className="bg-slate-900 px-4 py-2 mx-4 my-4 ml-12 border  text-white cursor-pointer"
          >
            Continue
          </button>

          {errorMsg && <AlertColors errorMsg={errorMsg} />}
        </form>
        {success && (
          <AlertBasic
            title={"Logged in  successfully"}
            desc={"Your profile information has been loaded."}
          />
        )}
        <br />
        <p className="text-sm text-slate-200 ml-12">
          Don't have an account?{" "}
          <span 
            onClick={()=>{
              navi('/signup')
            }}
            className="text-blue-200 cursor-pointer underline "
          >
            Create one<ExternalLink className="inline ml-1 mb-1" size={'12px'}/>
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
