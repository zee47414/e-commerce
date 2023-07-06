import { createContext,useContext,useState } from "react";
import { db } from "./firebase";
import { addDoc,collection } from "firebase/firestore";
import { useCartValue } from './cartContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAppValue } from "./appContext";
const homeContext = createContext();
// custom hooks
function useHomeValue(){
    const value = useContext(homeContext);
    return value;
}

// custom Provider
function CustomHomeContext({children}){
    const [searchQuery, setSearchQuery] = useState("");
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [sliderValue, setSliderValue] = useState(0);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const { cartItem } = useCartValue();
    const {isSignedIn} = useAppValue();

    // handle search
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
      }
       //  handling category to filter by category 
  function handleCategory(e) {
    let value = e.target.value;
    if (e.target.checked) {
      setSelectedCategories((prevCategories) => (
        [...prevCategories, value]
      ))
    } else {
      setSelectedCategories((prevCategories) => (
        prevCategories.filter((category) => category !== value)
      ))
    }
    setSearchQuery("");
  }

  
  const handleAddCart = async (name, category, description, price, img,userId) => {
     // Check if the item already exists in the cart
     const docRef = collection(db, `Products/${userId}/myCart`);
       const isItExist = cartItem.some((item)=> item.description === description);
       console.log(isItExist);
       if(!isItExist && isSignedIn){
        await addDoc(docRef, {
          qty: 1,
          name: name,
          category: category,
          description: description,
          price: price,
          img: img
        })
     }
     if(isSignedIn){
      toast.success('Product Added Successfully!', {
        position: "top-right",
       autoClose: 5000,
       hideProgressBar: false,
       closeOnClick: true,
       pauseOnHover: true,
       draggable: true,
       progress: undefined,
       theme: "light",
        });
     }
    
    

  }

  return(
    <>
    <homeContext.Provider value={{
        searchQuery ,setSearchQuery ,products,setProducts,filteredProducts,setFilteredProducts,sliderValue,setSliderValue,selectedCategories,setSelectedCategories
        ,handleCategory,handleAddCart,handleSearch
    }}>
        {children}
    </homeContext.Provider>
    <ToastContainer 
       position="top-right"
       autoClose={5000}
       hideProgressBar={false}
       newestOnTop={false}
       closeOnClick
       rtl={false}
       pauseOnFocusLoss
       draggable
       pauseOnHover
       theme="light"
       />
     <ToastContainer />
    </>
  )
}

export default CustomHomeContext;
export {homeContext , useHomeValue};