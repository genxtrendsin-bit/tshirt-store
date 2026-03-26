import React,{useEffect,useState} from "react";
import API from "../../utils/axios";

export default function AdminReviews(){

const [products,setProducts]=useState([]);
const [reviews,setReviews]=useState([]);
const [selectedProduct,setSelectedProduct]=useState(null);
const [sort,setSort]=useState("newest");


useEffect(()=>{
fetchProducts();
},[]);


/* FETCH PRODUCTS WITH REVIEWS */

const fetchProducts=async()=>{

try{

const res=await API.get("/reviews/admin/products");

setProducts(res.data);

}catch(err){

console.log(err);

}

};


/* FETCH REVIEWS FOR PRODUCT */

const fetchReviews=async(productId)=>{

try{

const res=await API.get(`/reviews/admin/product/${productId}?sort=${sort}`);

setReviews(res.data);

}catch(err){

console.log(err);

}

};


/* DELETE REVIEW */

const deleteReview=async(id)=>{

try{

await API.delete(`/reviews/admin/${id}`);

fetchReviews(selectedProduct);
fetchProducts();

}catch(err){

console.log(err);

}

};


/* HIDE / UNHIDE REVIEW */

const toggleHide=async(id)=>{

try{

await API.put(`/reviews/admin/hide/${id}`);

fetchReviews(selectedProduct);
fetchProducts();

}catch(err){

console.log(err);

}

};


/* ADMIN REPLY */

const replyReview=async(id)=>{

const reply=prompt("Admin reply");

if(!reply) return;

try{

await API.put(`/reviews/admin/reply/${id}`,{reply});

fetchReviews(selectedProduct);
fetchProducts();

}catch(err){

console.log(err);

}

};


return(

<div style={{padding:"40px"}}>

<h1>Reviews</h1>


{/* PRODUCT LIST */}

{!selectedProduct &&(

<div>

<h2>Select Product</h2>

{products.map(p=>(

<div
key={p._id}
style={{
border:"1px solid #ddd",
padding:"12px",
marginBottom:"10px",
cursor:"pointer",
borderRadius:"6px"
}}

onClick={()=>{

setSelectedProduct(p._id);
fetchReviews(p._id);

}}

>

<b>{p.name}</b> ({p.numReviews} reviews)

</div>

))}

</div>

)}


{/* PRODUCT REVIEWS */}

{selectedProduct &&(

<div>

<button
onClick={()=>setSelectedProduct(null)}
style={{marginBottom:"20px"}}
>
← Back
</button>

<h2>Reviews</h2>


{/* SORT */}

<select
value={sort}
onChange={(e)=>{
setSort(e.target.value);
fetchReviews(selectedProduct);
fetchProducts();
}}
>

<option value="newest">Newest</option>
<option value="oldest">Oldest</option>
<option value="rating">Highest Rating</option>

</select>


{reviews.map((r)=>(

<div
key={r._id}
style={{
border:"1px solid #ddd",
padding:"15px",
marginTop:"10px",
borderRadius:"6px"
}}

>

<p><b>{r.user?.name}</b></p>

<p>
{"⭐".repeat(r.rating)}
{"☆".repeat(5-r.rating)}
</p>

<p>{r.comment}</p>


{/* ADMIN REPLY */}

{r.adminReply &&(

<div
style={{
background:"#f1f5f9",
padding:"10px",
borderRadius:"6px",
marginTop:"10px"
}}
>

<b>Store Reply:</b>

<p>{r.adminReply}</p>

</div>

)}


<p style={{fontSize:"12px",color:"#666"}}>

{new Date(r.createdAt).toLocaleString()}

</p>


<div style={{marginTop:"10px",display:"flex",gap:"10px"}}>

<button onClick={()=>replyReview(r._id)}>
Reply
</button>

<label className="switch">

<input
type="checkbox"
checked={!r.hidden}
onChange={()=>toggleHide(r._id)}
/>

<span className="slider"></span>

</label>

<button onClick={()=>deleteReview(r._id)}>
Delete
</button>

</div>

</div>

))}

</div>

)}

</div>

);

}