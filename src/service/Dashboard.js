import axios from "axios";

export const fetchDashboardData = async () => {
    return await axios.get(" https://retail-billing.onrender.com/api/v1.0/dashboard", {headers: {'Authorization': `Bearer ${localStorage.getItem("token")}`}});
}

