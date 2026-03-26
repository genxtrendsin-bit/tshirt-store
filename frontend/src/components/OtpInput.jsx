import React, { useRef, useEffect } from "react";

export default function OtpInput({ otp, setOtp, onComplete }) {

  const inputs = useRef([]);

  useEffect(() => {
    if (inputs.current[0]) {
      inputs.current[0].focus();
    }
  }, []);


  const handleChange = (value, index) => {

    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);

    if (value && index < 5) {
      inputs.current[index + 1].focus();
    }

    const joined = newOtp.join("");

    if (joined.length === 6 && !joined.includes("")) {
      onComplete && onComplete(joined);
    }

  };


  const handleKeyDown = (e, index) => {

    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }

  };


  const handlePaste = (e) => {

    const pasted = e.clipboardData.getData("text").slice(0,6);

    if(!/^\d+$/.test(pasted)) return;

    const newOtp = pasted.split("");

    setOtp(newOtp);

    newOtp.forEach((num,i)=>{
      if(inputs.current[i]){
        inputs.current[i].value = num;
      }
    });

    onComplete && onComplete(pasted);

  };


  return (

    <div className="otp-container">

      {otp.map((digit,index)=>(

        <input
          key={index}
          ref={el => inputs.current[index] = el}
          value={digit}
          maxLength="1"
          inputMode="numeric"
          onChange={(e)=>handleChange(e.target.value,index)}
          onKeyDown={(e)=>handleKeyDown(e,index)}
          onPaste={handlePaste}
        />

      ))}

    </div>

  );

}