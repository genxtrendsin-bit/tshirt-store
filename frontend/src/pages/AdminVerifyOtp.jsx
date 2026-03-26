import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../utils/axios";
import "../styles/auth.css";

export default function AdminVerifyOtp(){

const location = useLocation();
const navigate = useNavigate();

const { email } = location.state || {};

const [otp,setOtp] = useState("");

useEffect(()=>{

if(!email){
 navigate("/login");
}

},[email,navigate]);

const verify = async()=>{

if(!otp.trim()){
 alert("Enter OTP");
 return;
}

try{

const res = await API.post("/auth/verify-admin-login",{
 email,
 otp
});

localStorage.setItem("token",res.data.token);
localStorage.setItem("user",JSON.stringify(res.data.user));

navigate("/admin");

}catch(err){

alert(err?.response?.data?.message || "OTP verification failed");

}

};

return(

<div className="auth-page">

<div className="auth-card">

<h1>Admin Verification</h1>

<input
placeholder="Enter OTP"
value={otp}
onChange={(e)=>setOtp(e.target.value.replace(/\s/g,""))}
/>

<button onClick={verify}>
Verify OTP
</button>

</div>

</div>

);

}