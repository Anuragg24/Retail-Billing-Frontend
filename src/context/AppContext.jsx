import { createContext, useEffect,useState } from "react";
import { fetchCategories } from "../service/CategoryService";
import { fetchItems } from "../service/ItemService";

export const AppContext =createContext(null);

export const AppContextProvider=(props)=>{

    const [categories,setCategories]=useState([]);
    const [items,setItems]=useState([]);
    const [auth,setAuth]=useState({
        token:null,
        role:null
       
    });
    const[cartItems,setCartItems]=useState([]);

    const addToCart=(item)=>{
    const existingItem= cartItems.find(cartItem =>cartItem.name == item.name);
    if(existingItem){
        setCartItems(cartItems.map(cartItem=>cartItem.name === item.name ? {...cartItem, quantity:cartItem.quantity+1}:cartItem));
    }else{
        setCartItems([...cartItems,{...item,quantity:1}]);
    }

    };

    const removeFromCart=(itemId)=>{
        setCartItems(cartItems.filter(item=>item.itemId !==itemId))

    };
    const updateQuantity=(itemId,newQuantity)=>{
        setCartItems(cartItems.map(item=>item.itemId ===itemId?{...item,quantity:newQuantity}:item));

    };

const logout = () => {
    localStorage.clear();
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);
    if (key && key.startsWith("rzp")) {
      localStorage.removeItem(key);
    }
  }
  

  // Also check sessionStorage
  
    setAuth({ token: null, role: null});
    window.location.href = "/login";
};
    useEffect(()=>{

        
        async function loadData(){
            if(localStorage.getItem("token")&& localStorage.getItem("role")){
                setAuthData(
                    localStorage.getItem("token"),
                    localStorage.getItem("role")
                );
            
            }
            try {
                const token =localStorage.getItem("token");
                const role =localStorage.getItem("role");

                if (token && role) {
        setAuth({ token, role });

        // Fetch categories/items
        const response = await fetchCategories();
        const itemResponse = await fetchItems();
        setCategories(response.data);
        setItems(itemResponse.data);
      }
            } catch (err) {
                if (err.response?.status === 401) {
              logout(); // token expired or invalid
    }
            }
        

        }


        loadData();

    },[])

    const loadInitialData = async () => {
  try {
    const response = await fetchCategories();
    const itemResponse = await fetchItems();
    setCategories(response.data);
    setItems(itemResponse.data);
  } catch (err) {
    console.error(err);
    if (err.response?.status === 401) logout();
  }
};

    const setAuthData =(token,role)=>{
        setAuth({token,role});
    }
    const clearCart=()=>{
        setCartItems([]);
    }

    const contextValue={
        categories,
        setCategories,
        auth,
        setAuthData,
        items,
        setItems,
        addToCart,
        cartItems,
        removeFromCart,
        updateQuantity,
        clearCart,
        loadInitialData

    }

    return(
        <AppContext.Provider value={contextValue}>
            {props.children}
        </AppContext.Provider>
    )
}