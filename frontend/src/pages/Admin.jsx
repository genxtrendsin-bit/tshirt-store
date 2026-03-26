import React, { useState, useEffect } from "react";
import API from "../utils/axios";
import "../styles/admin.css";
import AdminSidebar from "../admin/components/Sidebar";

export default function Admin() {

const [name,setName] = useState("");
const [price,setPrice] = useState("");
const [description,setDescription] = useState("");
const [stock,setStock] = useState("");
const [sizes,setSizes] = useState([]);
const [colors,setColors] = useState([]);
const [images,setImages] = useState([]);

const [products,setProducts] = useState([]);
const [editingProduct,setEditingProduct] = useState(null);

const token = localStorage.getItem("token");


/* FETCH PRODUCTS */

useEffect(()=>{
fetchProducts();
},[]);

const fetchProducts = async()=>{

try{

const res = await API.get("/products");

setProducts(res.data);

}catch(err){
console.log(err);
}

};


/* ADD PRODUCT */

const addProduct = async()=>{

try{

const formData = new FormData();

formData.append("name",name);
formData.append("price",price);
formData.append("description",description);
formData.append("stock",stock);
formData.append("sizes",JSON.stringify(sizes));
formData.append("colors",JSON.stringify(colors));

for(let i=0;i<images.length;i++){
formData.append("images",images[i]);
}

await API.post("/products/add",formData,{
headers:{
Authorization:`Bearer ${token}`,
"Content-Type":"multipart/form-data"
}
});

alert("Product Added");

resetForm();
fetchProducts();

}catch(err){
console.log(err);
}

};


/* EDIT PRODUCT */

const editProduct = (product)=>{

setEditingProduct(product);

setName(product.name);
setPrice(product.price);
setDescription(product.description);
setStock(product.stock);
setSizes(product.sizes || []);
setColors(product.colors || []);

};


/* UPDATE PRODUCT */

const updateProduct = async()=>{

try{

await API.put(`/products/update/${editingProduct._id}`,{

name,
price,
description,
stock,
sizes,
colors

},{
headers:{Authorization:`Bearer ${token}`}
});

alert("Product Updated");

setEditingProduct(null);

resetForm();
fetchProducts();

}catch(err){
console.log(err);
}

};


/* DELETE PRODUCT */

const deleteProduct = async(id)=>{

if(!window.confirm("Delete this product?")) return;

try{

await API.delete(`/products/${id}`,{
headers:{Authorization:`Bearer ${token}`}
});

alert("Product Deleted");

fetchProducts();

}catch(err){
console.log(err);
}

};


/* RESET FORM */

const resetForm = ()=>{

setName("");
setPrice("");
setDescription("");
setStock("");
setSizes([]);
setColors([]);
setImages([]);

};


/* DASHBOARD STATS */

const totalProducts = products.length;

const totalStock = products.reduce((sum,p)=>sum+(p.stock || 0),0);


return(

<div className="admin-layout">

<AdminSidebar />

<div className="admin-content">

<h1>Admin Dashboard</h1>


{/* DASHBOARD STATS */}

<div className="admin-stats">

<div className="stat-card">
<h3>{totalProducts}</h3>
<p>Total Products</p>
</div>

<div className="stat-card">
<h3>{totalStock}</h3>
<p>Total Stock</p>
</div>

</div>


{/* PRODUCT FORM */}

<div className="admin-form">

<h2>{editingProduct ? "Edit Product" : "Add Product"}</h2>

<input
placeholder="Product Name"
value={name}
onChange={(e)=>setName(e.target.value)}
/>

<input
placeholder="Price"
value={price}
onChange={(e)=>setPrice(e.target.value)}
/>

<textarea
placeholder="Description"
value={description}
onChange={(e)=>setDescription(e.target.value)}
/>

<input
placeholder="Stock"
value={stock}
onChange={(e)=>setStock(e.target.value)}
/>


{/* IMAGE UPLOAD */}

<input
type="file"
multiple
onChange={(e)=>setImages(e.target.files)}
/>


{/* SIZE */}

<label>Sizes</label>

<select
multiple
value={sizes}
onChange={(e)=>setSizes(
[...e.target.selectedOptions].map(o=>o.value)
)}
>

<option value="S">S</option>
<option value="M">M</option>
<option value="L">L</option>
<option value="XL">XL</option>

</select>


{/* COLORS */}

<label>Colors</label>

<select
multiple
value={colors}
onChange={(e)=>setColors(
[...e.target.selectedOptions].map(o=>o.value)
)}
>

<option>Black</option>
<option>White</option>
<option>Red</option>
<option>Blue</option>
<option>Green</option>

</select>


{editingProduct ? (

<button className="admin-btn" onClick={updateProduct}>
Update Product
</button>

) : (

<button className="admin-btn" onClick={addProduct}>
Add Product
</button>

)}

</div>



{/* PRODUCT TABLE */}

<h2 style={{marginTop:"40px"}}>Products</h2>

<table className="admin-table">

<thead>

<tr>

<th>Image</th>
<th>Name</th>
<th>Price</th>
<th>Stock</th>
<th>Actions</th>

</tr>

</thead>

<tbody>

{products.map(product=>(

<tr key={product._id}>

<td>

<img
src={product.images?.[0]}
className="admin-img"
alt=""
/>

</td>

<td>{product.name}</td>

<td>₹{product.price}</td>

<td>{product.stock}</td>

<td>

<button onClick={()=>editProduct(product)}>
Edit
</button>

<button
className="delete-btn"
onClick={()=>deleteProduct(product._id)}
>
Delete
</button>

</td>

</tr>

))}

</tbody>

</table>

</div>

</div>

);

}

