export const updateProduct = async (id,data)=>{

const token = localStorage.getItem("token");

const res = await API.put(
`/products/update/${id}`,
data,
{
headers:{
Authorization:`Bearer ${token}`
}
}
);

return res.data;

};