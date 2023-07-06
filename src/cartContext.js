import { createContext,useState,useContext} from "react";
import { updateDoc,deleteDoc,doc,addDoc,collection } from "firebase/firestore";
import { db } from "./firebase";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const cartContext = createContext();

// custom hooks
function useCartValue(){
    const value = useContext(cartContext);
    return value;
}

// custom provider
function CustomCartContext({children}){
    const navigate = useNavigate();
    const [cartItem,setCartItem] = useState([]);
    const [qty,setQty] = useState(0);
    const [totalPrice,setTotalPrice] = useState(0);
    async function handleRemove(id,price,userId){
        await deleteDoc(doc(db,`Products/${userId}/myCart`,id));
        console.log(id);
        setCartItem((prevItems)=> prevItems.filter((item)=> item.id !== id));

        setTotalPrice((prevTotal)=> prevTotal - price)
        toast.success('Product is Removed Successfully!', {
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

  async function handleMinusqty(id,price,userId){
    
     const updatedQty = qty - 1;
      setQty(updatedQty);
      const docRef = doc(db,`Products/${userId}/myCart`,id); 
      if(updatedQty > 0){
       await updateDoc(docRef,{
           qty : updatedQty 
          })
          setTotalPrice(totalPrice - price);
      }else{
       handleRemove(id , price,userId);
   }
   }

 async  function handleplusqty(id,price,userId){
       const updatedQty = qty + 1;
       setQty(updatedQty);
       setTotalPrice(totalPrice + price);
       const docRef = doc(db,`Products/${userId}/myCart`,id); 
        await updateDoc(docRef,{
            qty : updatedQty ,
           })
      
      
   }
    // handle purchase
    function handlePurchase(userId){
        const orderDataArray = cartItem.map((item)=>({
         name :item.name,
         qty :item.qty,
         description : item.description,
         category : item.category,
         price : item.price,
         img : item.img,
         orderDate : new Date()
        }))
         
        orderDataArray.map(async(orderData)=>{
         await addDoc(collection(db,`Products/${userId}/myOrder`),orderData)
        })
 
        cartItem.map(async(item)=>{
         await deleteDoc(doc(collection(db,`Products/${userId}/myCart`),item.id))
        })
        setCartItem([]);
        navigate('/order');
        toast.success('Order is Placed!', {
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

return (
    <>
    <cartContext.Provider value={{cartItem,setCartItem,totalPrice,setTotalPrice,handleMinusqty,handleRemove,handleplusqty ,handlePurchase}}>
      {children}
    </cartContext.Provider>
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
export default CustomCartContext;
export {cartContext , useCartValue};