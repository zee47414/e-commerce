import { useEffect,useState } from "react"
import { onSnapshot,collection } from "firebase/firestore";
import { db } from "../../firebase";
import Spinner from 'react-spinner-material';
import styles from './Order.module.css'
export default function Order(props){
const [orderedItem,setOrderItem] = useState([]);
const [isLoading,setIsLoading] = useState(true);

useEffect(()=>{
  const unsub = onSnapshot(collection(db,`Products/${props.userId}/myOrder`),(snapshot)=>{
    const orders = snapshot.docs.map((doc)=>{
        return {
            id : doc.id,
            ...doc.data()
        }
    })
    setOrderItem(orders);
    setIsLoading(false);
    console.log(orders);
  })
},[])

const groupedOrder = {};
orderedItem.map((order)=>{
  const orderDate = order.orderDate.toDate().toLocaleString();
  if(groupedOrder[orderDate]){
      groupedOrder[orderDate].push(order);
  }else{
    groupedOrder[orderDate] = [order];
  }
})

function calculateTotalPrice(orders){
  
  const totalPrice =  orders.reduce((total,order)=>(
      total + order.price * order.qty 
    ),0)
  return totalPrice;
}
return (
  <>
  {isLoading ? (
     <div className={styles.loader}>
        <Spinner radius={40} color={"#333"} stroke={2} visible={true} /> 
        <h1>Loading....</h1>
      </div>
      ) :
      (
        <>
        {orderedItem.length === 0 ? <h1>No Orders!</h1> : 
  <div className={styles.tableContainer}>
  <h2>My Orders</h2>
 
  {Object.entries(groupedOrder).map(([orderDate ,orderedItem])=>{
      return (
        
        // {orderedItem ? }
        
        <div className={styles.orderTable}>
          <h3>Order On :- {orderDate}</h3>
          <table>
            <thead>
             <tr>
              <th>Title</th>
              <th>price</th>
              <th>Quantity</th>
              <th>Total Price</th>
             </tr>
            </thead>
        {orderedItem.map((order)=>(
          <tbody>
           <tr>
            <td>{order.description}</td>
            <td>&#8377;{order.price}</td>
            <td>{order.qty}</td>
            <td>&#8377;{order.price}</td>
           </tr>
          
          </tbody>
      ))}
         
           <tr>
            <td colspan="4" className={styles.total}>&#8377;{calculateTotalPrice(orderedItem)}</td>
           </tr>
       
     
    </table>
  </div>
      )
    })}
     
</div>}
        </>
      )}
  
  
  
  </>
)
}