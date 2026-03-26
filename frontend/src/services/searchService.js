import API from "../utils/axios"

export const searchProducts = async (query) => {

  const res = await API.get(`/products/search?q=${query}`);

  return res.data;

};