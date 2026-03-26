import { createContext, useState, useEffect } from "react";
import API from "../utils/axios";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {

  const [cartCount, setCartCount] = useState(0);

  const fetchCartCount = async () => {

    const token = localStorage.getItem("token");

    if (!token) {
      setCartCount(0);
      return;
    }

    try {

      const res = await API.get("/cart");

      const total = res.data.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      setCartCount(total);

    } catch (err) {

      console.log("Cart fetch error:", err);
      setCartCount(0);

    }

  };

  useEffect(() => {
    fetchCartCount();
  }, []);

  return (

    <CartContext.Provider value={{ cartCount, fetchCartCount }}>
      {children}
    </CartContext.Provider>

  );

};