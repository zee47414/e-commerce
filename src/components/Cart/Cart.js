import {db} from '../../firebase';
import { onSnapshot,collection,deleteDoc, addDoc,doc, updateDoc } from 'firebase/firestore';
import { useState,useEffect } from 'react';
import { useCartValue } from '../../cartContext';
import styles from './Cart.module.css';
export default function Cart(props){
    const{cartItem ,setCartItem ,qty,setQty,totalPrice,setTotalPrice,handleRemove,handleMinusqty,handleplusqty} = useCartValue();
    
    useEffect(()=>{
        const unsub =onSnapshot(collection(db,`Products/${props.userId}/myCart`),(snapshot)=>{
            const items = snapshot.docs.map((doc)=>{
                return {
                    id : doc.id,
                    ...doc.data()
                }
            })
            setCartItem(items);
        })
        let total = 0;
        total = cartItem.reduce((acc,item)=> acc + item.qty * item.price, 0);
        setTotalPrice(total);
    },[]);

//    async function handleRemove(id,price){
//          await deleteDoc(doc(db,`Products/${props.userId}/myCart`,id));
//          console.log(id);
//          setCartItem((prevItems)=> prevItems.filter((item)=> item.id !== id));

//          setTotalPrice((prevTotal)=> prevTotal - price)
//     }

//    async function handleMinusqty(id,price){
//       const updatedQty = qty - 1;
//        setQty(updatedQty);
//        const docRef = doc(db,`Products/${props.userId}/myCart`,id); 
//        if(updatedQty > 0){
//         await updateDoc(docRef,{
//             qty : updatedQty 
//            })
//            setTotalPrice(totalPrice - price);
//        }else{
//         handleRemove(id , price);
//     }
//     }

//   async  function handleplusqty(id,price){
//         const updatedQty = qty + 1;
//         setQty(updatedQty);
        
//         const docRef = doc(db,`Products/${props.userId}/myCart`,id); 
//          await updateDoc(docRef,{
//              qty : updatedQty ,
//             })
//        setTotalPrice(totalPrice + price);
       
//     }
    
    return (
        <>
        <div className={styles.outerContainer}>
            <div className={styles.leftSide}>
                
                <b>TotalPrice : &nbsp;{totalPrice}</b>
                <br />
                <br />
                <button>Purchase</button>
            </div>
            <div className={styles.rightSide}>
                {cartItem.map((item)=>(
                      <div className={styles.productContainer} key={item.id}>
                        <img src={item.img} alt ="product image" />
                        <div className={styles.productDetails}> 
                        <p>{item.description}</p>
                        <div className={styles.priceQty}>
                            <div className={styles.price}>
                                <b>&#8377;&nbsp;{item.price}</b>
                            </div>
                            <br/>
                            <div className={styles.qty}>
                                <img src='https://cdn-icons-png.flaticon.com/128/1828/1828899.png' alt="minus qty" className={styles.minus} onClick={()=>handleMinusqty(item.id,item.price,`${props.useId}`)} />
                                <b>{item.qty}</b>
                                <img src='https://cdn-icons-png.flaticon.com/128/1828/1828919.png' alt = "plus qty" className={styles.plus} onClick={()=>handleplusqty(item.id,item.price,`${props.userId}`)}/>
                            </div>
                        </div>

                        </div>
                        <div className={styles.button}>
                            <button onClick={()=>handleRemove(item.id,item.price,`${props.useId}`)} >Remove From Cart</button>
                        </div>

                      </div>
                ))}
                 
            </div>
        </div>
        </>
    )
}