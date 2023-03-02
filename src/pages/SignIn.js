import React, { useState } from "react";
import { auth } from "../components/firebase";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  // signOut,
  onAuthStateChanged,
} from "firebase/auth";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const googleProvider = new GoogleAuthProvider();
  const [alert, setOpenAlert] = useState({
    open: true,
    type: "",
    message: "",
  });
  const navigate = useNavigate();
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenAlert({ open: false });
  };

  const signInWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      setOpenAlert({
        open: true,
        type: "success",
        message: `Sign In successful ${res.user?.displayName}`,
      });
      console.log(res.user);
    } catch (error) {
      setOpenAlert({
        open: true,
        type: "error",
        message: error.message,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setOpenAlert({
        open: true,
        type: "error",
        message: "Invalid fields",
      });
      return;
    }

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      setOpenAlert({
        open: true,
        type: "success",
        message: `Log in sucessfull. Wellcome ${res.user.email}`,
      });
      setEmail("");
      setPassword("");
    } catch (error) {
      setOpenAlert({
        open: true,
        type: "error",
        message: error.message,
      });
    }
  };

  // const logOut = () => {
  //   signOut(auth)
  //     .then(() => {
  //       // Sign-out successful.
  //       // localStorage.removeItem("user")
  //     })
  //     .catch((error) => {
  //       // An error happened.
  //     });
  // };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const userData = {
          accessToken: user.accessToken,
          emial: user.email,
          displayName: user.displayName,
        };
        localStorage.setItem("user", JSON.stringify(userData));
        navigate("/");
      }
    });
  }, [navigate]);

  return (
    <section className="min-h-screen flex w-full flex-col sm:flex-row relative">
      <div className="sm:block hidden max-w-[27.7%] overflow-hidden">
        <img
          className="min-h-full object-cover"
          src="images/Left.png"
          alt="left_image"
        />
      </div>
      <div className="w-full h-[102px] inline-flex sm:hidden items-center justify-between px-8 sm:px-12">
        <img src="images/Dashboard_Main_Logo.svg" alt="logo" />
        <button className="w-[92px] h-[47px] text-[#FFFFFF] rounded-[6px] cursor-pointer bg-[#426BFF] text-center font-semibold text-[15px]">
          Sign Up
        </button>
      </div>
      <div className="flex-1 bg-[#FFFFFF] relative w-full p-8 sm:p-12 md:p-0 sm:grid place-items-center">
        <div className="sm:grid sm:place-items-start">
          <div>
            <h2 className="text-[30px] font-bold">
              Welcome to Global FX Suite
            </h2>
            <p className="text-[18px] font-semibold text-[#A7A8BB]">
              New Here?{" "}
              <span className="text-[#426BFF] cursor-pointer">
                Create an Account
              </span>{" "}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="mt-6">
            <label className="text-[14px] mb-1 block font-semibold">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#EEF1F5] flex-shrink-0 rounded-[12px] w-full md:w-[440px] h-[70px] p-3 outline-none"
            />
            <div className="flex items-center justify-between mb-1 mt-4 w-full">
              <label className="text-[14px] block font-semibold">
                Password
              </label>
              <p className="text-[#426BFF] cursor-pointer text-[14px] font-semibold">
                Forgot Password?
              </p>
            </div>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#EEF1F5] rounded-[12px] w-full md:w-[440px] h-[70px] p-3 outline-none"
            />
            <div className="flex items-center space-x-[15px] mt-[25px]">
              <button
                type="submit"
                className="text-[#FFFFFF] text-[15px] font-semibold bg-[#426BFF] rounded-[6px] text-center w-[109px] h-[48px]"
              >
                Sign In
              </button>
              <p
                onClick={signInWithGoogle}
                className="bg-[#E1F1FF] cursor-pointer rounded-[6px] w-[234px] h-[48px] flex items-center justify-center space-x-3 text-[#426BFF] text-[15px] font-semibold"
              >
                <img
                  src="images/google-icon 1.png"
                  alt="google_icon"
                  className="w-[20px] h-[20px]"
                />
                <p>Sign in with Google</p>
              </p>
            </div>
          </form>
        </div>
        <div className="flex ml-0 sm:-ml-[194px] md:-ml-[226px] absolute bottom-1 items-center space-x-5 pb-4 pr-4">
          <p className="text-[#3699FF] font-semibold cursor-pointer text-[16px]">
            Terms
          </p>
          <p className="text-[#3699FF] font-semibold cursor-pointer text-[16px]">
            Plans
          </p>
          <p className="text-[#3699FF] font-semibold cursor-pointer text-[16px]">
            Contact Us
          </p>
        </div>
      </div>
      <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={alert.type}
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </section>
  );
};

export default SignIn;
