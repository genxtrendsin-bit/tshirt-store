import React from "react";
import "../styles/hero.css";
import TshirtModel from "./TshirtModel";

export default function Hero() {

  const scrollToProducts = () => {

    const section = document.getElementById("products");

    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }

  };

  return (

    <div className="hero">

      {/* LEFT SIDE CONTENT */}
      <div className="hero-content">

        <h1 className="hero-title">
          NEXT GEN T-SHIRT STORE
        </h1>

        <p className="hero-subtitle">
          Premium AI Designed Streetwear
        </p>

        <button
          className="hero-btn"
          onClick={scrollToProducts}
        >
          Shop Now
        </button>

      </div>

      {/* RIGHT SIDE 3D MODEL */}
      <div className="hero-model">

        <TshirtModel />

      </div>

    </div>

  );

}