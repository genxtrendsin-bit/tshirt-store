import React,{useState,useEffect} from "react";
import { useNavigate,useLocation } from "react-router-dom";
import API from "../../utils/axios";
import OtpInput from "../../components/OtpInput";
import "../../styles/otp.css";

export default function VerifyOtp(){

const navigate = useNavigate();
const location = useLocation();

const { email,purpose,name,password } = location.state || {};

const [otp,setOtp] = useState(["","","","","",""]);
const [timer,setTimer] = useState(30);
const [canResend,setCanResend] = useState(false);
const [message,setMessage] = useState("");
const [loading,setLoading] = useState(false);

useEffect(()=>{

if(!email || !purpose){
 navigate("/login");
}

},[email,purpose,navigate]);



useEffect(()=>{

if(timer===0){
 setCanResend(true);
 return;
}

const interval=setInterval(()=>{
 setTimer(prev=>prev-1);
},1000);

return ()=>clearInterval(interval);

},[timer]);



const verifyOtp = async(code)=>{

try{

setLoading(true);

await API.post("/auth/verify-otp",{
 email,
 otp:code,
 purpose
});

if(purpose==="signup"){

await API.post("/auth/register",{
 name,
 email,
 password,
 otp:code
});

setMessage("Account created");

setTimeout(()=>{
 navigate("/login");
},1500);

}

if(purpose==="reset"){
 navigate("/reset-password",{state:{email}});
}

}catch(err){

setMessage(
 err.response?.data?.message ||
 "Verification failed"
);

}finally{

setLoading(false);

}

};



const resendOtp = async()=>{

try{

await API.post("/auth/send-otp",{
 email,
 purpose
});

setTimer(30);
setCanResend(false);
setMessage("OTP sent again");

}catch(err){
 console.log(err);
}

};



return(

<div className="otp-page">

<h2>Verify OTP</h2>

<p className="otp-info">
Enter the code sent to <b>{email}</b>
</p>

<OtpInput
otp={otp}
setOtp={setOtp}
onComplete={verifyOtp}
/>

<button
className="verify-btn"
disabled={loading}
onClick={()=>verifyOtp(otp.join(""))}
>
{loading ? "Verifying..." : "Verify OTP"}
</button>

<button
className="resend-btn"
disabled={!canResend}
onClick={resendOtp}
>
{canResend
 ? "Resend OTP"
 : `Resend OTP in ${timer}s`
}
</button>

{message && (
<p className="otp-message">{message}</p>
)}

</div>

);

}