import axios from "axios";

export const login =async (data)=>{
return  await axios.post("https://retail-billing.onrender.com/api/v1.0/login",data);

}