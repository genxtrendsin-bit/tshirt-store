import API from "../utils/axios"

export const addToCart = async (productId, size, color, quantity) => {

  const token = localStorage.getItem("token");   // ✅ GET TOKEN
  console.log("SERVICE SEND:", {
    productId,
    size,
    color,
    quantity
  });
  return API.post(
    "/cart/add",
    {
      productId,
      size,
      color,
      quantity
    },
    {
      headers: {
        Authorization: `Bearer ${token}`   // ✅ SEND TOKEN
      }

    }

  );



};
