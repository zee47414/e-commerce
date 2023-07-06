import {db} from '../../firebase';
import { onSnapshot,collection,addDoc, deleteDoc,doc} from 'firebase/firestore';
import { useEffect,useState } from 'react';
import { useCartValue } from '../../cartContext';
import styles from './Cart.module.css';
import Spinner from 'react-spinner-material';



export default function Cart(props){
    const{cartItem ,setCartItem ,totalPrice,setTotalPrice,handleRemove,handleMinusqty,handleplusqty,handlePurchase} = useCartValue();
    const [isLoading,setIsLoading] = useState(true);
   
    
    useEffect(()=>{
        const unsub =onSnapshot(collection(db,`Products/${props.userId}/myCart`),(snapshot)=>{
            const items = snapshot.docs.map((doc)=>{
                return {
                    id : doc.id,
                    ...doc.data()
                }
            })
            setIsLoading(false);
            setCartItem(items);
        })
       
    },[]);
    useEffect(()=>{
        let total = 0;
        total = cartItem.reduce((acc,item)=> acc + item.qty * item.price, 0);
        setTotalPrice(total);
    },[cartItem])
    
    return (
        <>
        {isLoading ? (
           <div className={styles.loader}>
           <Spinner radius={40} color={"#333"} stroke={2} visible={true} /> 
           <h1>Loading....</h1>
         </div> 
        ) : (
            <>
             <div className={styles.outerContainer}>
        {cartItem.length === 0 ? <h1>Cart is Empty!</h1>:
        <div className={styles.leftSide}>
                
        <b>TotalPrice : &nbsp;{totalPrice}</b>
        <br />
        <br />
        <button onClick={()=>handlePurchase(`${props.userId}`)}>Purchase</button>
        </div>
        }
            
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
                                <img src='https://cdn-icons-png.flaticon.com/128/1828/1828899.png' alt="minus qty" className={styles.minus} onClick={()=>handleMinusqty(item.id,item.price,`${props.userId}`)} />
                                <b>{item.qty}</b>
                                <img src='https://cdn-icons-png.flaticon.com/128/1828/1828919.png' alt = "plus qty" className={styles.plus} onClick={()=>handleplusqty(item.id,item.price,`${props.userId}`)}/>
                            </div>
                        </div>

                        </div>
                        <div className={styles.button}>
                            <button onClick={()=>handleRemove(item.id,item.price,`${props.userId}`)} >Remove From Cart</button>
                        </div>

                      </div>
                ))}
                 
            </div>
        </div>
            </>
        )}
         

        </>
    )
}