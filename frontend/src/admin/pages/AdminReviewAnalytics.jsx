import React, { useEffect, useState } from "react";
import API from "../../utils/axios";

import {
Bar
} from "react-chartjs-2";

import {
Chart as ChartJS,
CategoryScale,
LinearScale,
BarElement,
Title,
Tooltip,
Legend
} from "chart.js";

ChartJS.register(
CategoryScale,
LinearScale,
BarElement,
Title,
Tooltip,
Legend
);

export default function AdminReviewAnalytics(){

const [data,setData] = useState([]);

useEffect(()=>{
fetchAnalytics();
},[]);

const fetchAnalytics = async()=>{

try{

const res = await API.get("/reviews/admin/analytics");

setData(res.data);

}catch(err){

console.log(err);

}

};

const chartData = {

labels:["1⭐","2⭐","3⭐","4⭐","5⭐"],

datasets:[{

label:"Number of Reviews",

data:[
data.find(d=>d._id===1)?.count || 0,
data.find(d=>d._id===2)?.count || 0,
data.find(d=>d._id===3)?.count || 0,
data.find(d=>d._id===4)?.count || 0,
data.find(d=>d._id===5)?.count || 0
],

backgroundColor:[
"#ef4444",
"#f97316",
"#eab308",
"#22c55e",
"#3b82f6"
]

}]

};

return(

<div style={{padding:"40px"}}>

<h1>Review Analytics</h1>

<div style={{maxWidth:"700px"}}>

<Bar data={chartData} />

</div>

</div>

);

}