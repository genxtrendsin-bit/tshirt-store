import React,{ useState } from "react";
import API from "../utils/axios";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword(){

const [email,setEmail] = useState("");
const [loading,setLoading] = useState(false);

const navigate = useNavigate();

const sendResetOtp = async()=>{

if(!email.trim()){
 alert("Enter email");
 return;
}

if(email.includes(" ")){
 alert("Email cannot contain spaces");
 return;
}

try{

setLoading(true);

await API.post("/auth/send-reset-otp",{email});

navigate("/verify-otp",{
 state:{
  email,
  purpose:"reset"
 }
});

}catch(err){

alert(err?.response?.data?.message || "Failed to send OTP");

}finally{

setLoading(false);

}

};

return(

<div className="auth-page">

<div className="auth-card">

<h1>Reset Password</h1>

<input
placeholder="Enter email"
value={email}
onChange={(e)=>{
 const value=e.target.value.replace(/\s/g,"");
 setEmail(value);
}}
/>

<button onClick={sendResetOtp}>
{loading ? "Sending..." : "Send OTP"}
</button>

</div>

</div>

);

}