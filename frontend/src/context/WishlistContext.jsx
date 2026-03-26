import { createContext, useState, useEffect } from "react";
import { getWishlist } from "../services/wishlistService";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {

  const [wishlist, setWishlist] = useState([]);

  const fetchWishlist = async () => {

    const token = localStorage.getItem("token");

    if (!token) {
      setWishlist([]);
      return;
    }

    try {

      const data = await getWishlist();

      setWishlist(data.map(item => item.product._id));

    } catch (err) {

      console.log("Wishlist fetch error:", err);
      setWishlist([]);

    }

  };

  useEffect(() => {
  const token = localStorage.getItem("token");

  if (token) {
    fetchWishlist();
  }
}, []);

  return (
    <WishlistContext.Provider value={{ wishlist, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );

};