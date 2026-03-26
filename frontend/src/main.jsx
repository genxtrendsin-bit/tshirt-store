import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { CartProvider } from "./context/CartContext";
import "./styles/global.css";
import "./styles/theme.css";
import { WishlistProvider } from "./context/WishlistContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="878628992138-fr430uilkgdavkrvr2gkbkpldg3bhm9g.apps.googleusercontent.com">
      <CartProvider>
        <WishlistProvider>

          <App />

        </WishlistProvider>
      </CartProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);




<App />
