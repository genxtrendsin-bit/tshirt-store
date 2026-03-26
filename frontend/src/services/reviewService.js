import API from "../utils/axios"


export const addReview = async(data)=>{

const res = await API.post("/reviews",data);

return res.data;

};


export const getReviews = async(productId)=>{

const res = await API.get(`/reviews/${productId}`);

return res.data;

};

export const deleteReview = async(id)=>{

const token = localStorage.getItem("token");

const res = await API.delete(`/reviews/admin/${id}`,{
headers:{
Authorization:`Bearer ${token}`
}
});

return res.data;

};