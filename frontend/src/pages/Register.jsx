import React,{ useState } from "react";
import API from "../utils/axios";
import { useNavigate,Link } from "react-router-dom";
import "../styles/auth.css";

export default function Register(){

const navigate = useNavigate();

const [name,setName] = useState("");
const [email,setEmail] = useState("");
const [password,setPassword] = useState("");

const [loading,setLoading] = useState(false);
const [success,setSuccess] = useState(false);



const sendOtp = async()=>{

if(!name.trim()){
 alert("Name is required");
 return;
}

if(!email.trim()){
 alert("Email is required");
 return;
}

if(email.includes(" ")){
 alert("Email cannot contain spaces");
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

try{

setLoading(true);

await API.post("/auth/send-otp",{
 email,
 purpose:"signup"
});

setSuccess(true);

setTimeout(()=>{

navigate("/verify-otp",{
 state:{
  name,
  email,
  password,
  purpose:"signup"
 }
});

},700);

}catch(err){

alert(err?.response?.data?.message || "Failed to send OTP");

}finally{

setLoading(false);

}

};



return(

<div className="auth-page">

<div className="auth-card">

<h1>Create Account</h1>

<input
type="text"
placeholder="Full Name"
value={name}
onChange={(e)=>setName(e.target.value)}
/>

<input
type="email"
placeholder="Email"
value={email}
onChange={(e)=>{
 const value = e.target.value.replace(/\s/g,"");
 setEmail(value);
}}
/>

<input
type="password"
placeholder="Password (min 8 characters)"
value={password}
onChange={(e)=>{
 const value = e.target.value.replace(/\s/g,"");
 setPassword(value);
}}
/>

<button
onClick={sendOtp}
disabled={loading}
className={success ? "btn-success" : ""}
>
{loading ? "Sending OTP..." : success ? "OTP Sent ✓" : "Register"}
</button>

<p className="auth-switch">
Already have an account?
<Link to="/login"> Login</Link>
</p>

</div>

</div>

);

}