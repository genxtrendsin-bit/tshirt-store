import React,{ useState,useEffect } from "react";
import API from "../utils/axios";
import { useNavigate,useLocation } from "react-router-dom";
import "../styles/auth.css";

export default function ResetPassword(){

const navigate = useNavigate();
const location = useLocation();

const { email } = location.state || {};

const [password,setPassword] = useState("");
const [confirmPassword,setConfirmPassword] = useState("");

useEffect(()=>{

if(!email){
 navigate("/login");
}

},[email,navigate]);

const resetPassword = async()=>{

if(!password.trim()){
 alert("Password is required");
 return;
}

if(password.includes(" ")){
 alert("Password cannot contain spaces");
 return;
}

if(password.length < 8){
 alert("Password must be at least 8 characters");
 return;
}

if(password !== confirmPassword){
 alert("Passwords do not match");
 return;
}

try{

await API.post("/auth/reset-password",{
 email,
 newPassword:password
});

alert("Password updated successfully");

navigate("/login");

}catch(err){

alert(err?.response?.data?.message || "Password reset failed");

}

};

return(

<div className="auth-page">

<div className="auth-card">

<h1>Reset Password</h1>

<p className="auth-sub">
Enter a new password
</p>

<input
type="password"
placeholder="New password"
value={password}
onChange={(e)=>{
 const value=e.target.value.replace(/\s/g,"");
 setPassword(value);
}}
/>

<input
type="password"
placeholder="Confirm password"
value={confirmPassword}
onChange={(e)=>{
 const value=e.target.value.replace(/\s/g,"");
 setConfirmPassword(value);
}}
/>

<button onClick={resetPassword}>
Update Password
</button>

</div>

</div>

);

}