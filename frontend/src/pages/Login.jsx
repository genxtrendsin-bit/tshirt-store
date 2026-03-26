import React, { useState } from "react";
import API from "../utils/axios";
import { GoogleLogin } from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";

export default function Login() {

  const navigate = useNavigate();

  const [loading,setLoading] = useState(false);
  const [success,setSuccess] = useState(false);

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");



  const loginUser = async () => {

    if (!email.trim() || !password.trim()) {
      alert("Please fill all fields");
      return;
    }

    if (email.includes(" ")) {
      alert("Email cannot contain spaces");
      return;
    }

    if (password.includes(" ")) {
      alert("Password cannot contain spaces");
      return;
    }

    try{

      setLoading(true);

      const res = await API.post("/auth/login",{
        email,
        password
      });

      if(res.data.admin2fa){

        navigate("/verify-admin-otp",{
          state:{ email }
        });

        return;

      }

      setSuccess(true);

      localStorage.setItem("token",res.data.token);
      localStorage.setItem("user",JSON.stringify(res.data.user));

      setTimeout(()=>{
        navigate("/");
        window.location.reload();
      },900);

    }catch(err){

      alert(err?.response?.data?.message || "Invalid email or password");

    }finally{

      setLoading(false);

    }

  };



  const googleSuccess = async (credentialResponse)=>{

    try{

      const res = await API.post("/auth/google",{
        token:credentialResponse.credential
      });

      localStorage.setItem("token",res.data.token);
      localStorage.setItem("user",JSON.stringify(res.data.user));

      navigate("/");
      window.location.reload();

    }catch (err) {

  if (err.response?.status === 403) {
    alert(err.response.data.message); // 🔥 SHOW BAN MESSAGE
    return;
  }

  alert("Google login failed");
}

  };



  const forgotPassword = async () => {

    if (!email.trim()) {
      alert("Enter your email first");
      return;
    }

    navigate("/verify-otp",{
      state:{
        email,
        purpose:"reset"
      }
    });

    try{

      await API.post("/auth/send-reset-otp",{email});

    }catch(err){

      alert(err?.response?.data?.message || "Failed to send OTP");

    }

  };



  return(

    <div className="auth-page">

      <div className="auth-card">

        <h1>Login</h1>

        <input
          placeholder="Email"
          value={email}
          onChange={(e)=>{
            const value = e.target.value.replace(/\s/g,"");
            setEmail(value);
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>{
            const value = e.target.value.replace(/\s/g,"");
            setPassword(value);
          }}
        />

        <button
          onClick={loginUser}
          disabled={loading}
          className={success ? "btn-success" : ""}
        >
          {loading ? "Logging in..." : success ? "Login Success ✓" : "Login"}
        </button>


        <p className="auth-forgot">
          <span onClick={forgotPassword}>
            Forgot password?
          </span>
        </p>


        <div className="auth-divider">
          OR
        </div>


        <GoogleLogin
          onSuccess={googleSuccess}
          onError={()=>console.log("Google Login Failed")}
        />


        <p className="auth-switch">
          Don't have an account?
          <Link to="/register"> Register</Link>
        </p>

      </div>

    </div>

  );

}