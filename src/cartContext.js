import { createContext,useState,useContext} from "react";
import { updateDoc,deleteDoc,doc } from "firebase/firestore";
import { db } from "./firebase";
const cartContext = createContext();

// custom hooks
function useCartValue(){
    const value = useContext(cartContext);
    return value;
}

// custom provider
function CustomCartContext({children}){
    const [cartItem,setCartItem] = useState([]);
    const [qty,setQty] = useState(0);
    const [totalPrice,setTotalPrice] = useState(0);
    
    async function handleRemove(id,price,userId){
        await deleteDoc(doc(db,`Products/${userId}/myCart`,id));
        console.log(id);
        setCartItem((prevItems)=> prevItems.filter((item)=> item.id !== id));

        setTotalPrice((prevTotal)=> prevTotal - price)
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
       
       const docRef = doc(db,`Products/${userId}/myCart`,id); 
        await updateDoc(docRef,{
            qty : updatedQty ,
           })
      setTotalPrice(totalPrice + price);
      
   }

return (
    <cartContext.Provider value={{cartItem,setCartItem,qty,setQty,totalPrice,setTotalPrice,handleMinusqty,handleRemove,handleplusqty}}>
      {children}
    </cartContext.Provider>
)
}
export default CustomCartContext;
export {cartContext , useCartValue};