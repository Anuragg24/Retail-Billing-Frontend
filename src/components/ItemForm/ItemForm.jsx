import React, { useContext, useState } from 'react'
import './ItemForm.css'
import upload from '../../assets/upload.png'
import { AppContext } from '../../context/AppContext'
import { addItem } from '../../service/ItemService'
import toast from 'react-hot-toast'
const ItemForm = () => {
  const {categories,items,setItems,setCategories}=useContext(AppContext);
  const [image,setImage]=useState(false);
  const [loading,setLoading]=useState(false);
  const [data,setData]=useState({
    name:"",
    categoryId:"",
    price:"",
    description:"",

  });

  const onChangeHandler =(e)=>{
    const value=e.target.value;
    const name=e.target.name;
    setData((data)=>({...data,[name]:value}));
  }
  const onSubmitHandler =async(e)=>{
    e.preventDefault();
    setLoading(true);
    const formData=new FormData();
    formData.append("item",JSON.stringify(data));
    formData.append("file",image);

  try {
    if(!image){
    toast.error("please select image for item");
    return
  }
  if(data.name.trim()===""){
    toast.error("item name is required");
    return
  }
  if(data.description.trim()===""){
    toast.error("item description is required");  
    return
  }
  if(data.price.trim()===""){
    toast.error("item price is required");  
    return
  }
  const response=await addItem(formData);
  if(response.status=== 201){
    setItems([...items,response.data]);
    setCategories((prevCategories)=>prevCategories.map((category)=>category.categoryId===data.categoryId?{...category,items:category.items+1}:category));
    toast.success("item added.");
    setData({
       name:"",
    categoryId:"",
    price:"",
    description:"",
    })
    setImage(false);

  }
  else{
    toast.error("unable to add item");
  }
  } catch (error) {
    console.error(error);
    toast.error("unable to add item");

  }finally{
    setLoading(false);
  }

  }

  return (
    <div className='item-form-container'style={{height:'100vh', overflowY:'auto',overflowX:'hidden'}}>
        <div className="mx-2 mt-2">
      <div className="row">
        <div className="card col-md-8 form-container">
          <div className="card-body">
            <form onSubmit={onSubmitHandler}>
              <div className="mb-3">
                <label htmlFor="image" className="form-label">
                  <img src={image ? URL.createObjectURL(image):upload} alt="" width={48} />
                </label>
                <input
                  type="file"
                  name="image"
                  id="image"
                  className="form-control"
                  hidden
                  onChange={(e)=>setImage(e.target.files[0])}
                  
                />
              </div>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="form-control"
                  placeholder="Enter Item name"
                  onChange={onChangeHandler}
                  value={data.name}
                  required
                  
                />
              </div>
              <div className="mb-3">
                <label htmlFor="category" className="form-label">
                  Category
                </label>
                <select className='form-control' name="categoryId" id="category" onChange={onChangeHandler}
                  value={data.categoryId} required> 
                    <option value="">--Select Category--</option>
                {categories.map((category,index)=>(
                  <option key={index} value={category.categoryId}>{category.name}</option>
                ))}
                </select>
                
              </div>
              <div className="mb-3">
                <label htmlFor="price" className="form-label">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  id="price"
                  className="form-control"
                  placeholder="Enter price ₹"
                  onChange={onChangeHandler}
                  value={data.price}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <textarea
                  rows="5"
                  name="description"
                  id="description"
                  className="form-control"
                  placeholder="Write description here.."
                  onChange={onChangeHandler}
                  value={data.description}
                >
                    </textarea>
              </div>
              
              <button type="submit" className="btn btn-warning w-100"disabled={loading}>{loading ?"loading..":"Save"}</button>
            </form>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default ItemForm