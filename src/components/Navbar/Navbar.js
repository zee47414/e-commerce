import styles from './navbar.module.css';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import {Link ,Outlet ,useNavigate} from 'react-router-dom'
export default function Navbar(props){
  const navigate = useNavigate(); 
  const handleSignout = ()=>{
    signOut(auth)
    .then(()=>{
      navigate('/');
      props.setIsSignedIn(false);
    })
    .catch((err)=>{
      console.log("Error while signing Out :",err);
    })
   }
    return (
        <>
        <div className={styles.Navbar}>
         <h2>Busy Buy</h2>
         <span className={styles.leftnav}>
         <span className={styles.home}>
          <Link to = '/' className={styles.Link}>
         <img src='https://cdn-icons-png.flaticon.com/128/874/874520.png' alt='home'/>
           <b>Home</b>
           </Link>
         </span>
         
         <span className={styles.order}>
         {props.isSignedIn ? <Link to = '/order' className={styles.Link}>
            <img src='https://cdn-icons-png.flaticon.com/128/3502/3502601.png' alt='cart'/>
            <b>My Orders</b>
            </Link> : null}
         </span>
         
         <span className={styles.cart}>
         {props.isSignedIn ? <Link to = '/cart' className={styles.Link}>
            <img src='https://cdn-icons-png.flaticon.com/128/3737/3737173.png' alt='cart'/>
            <b>Cart</b>
            </Link> : null
          }
         </span>
         <span className={styles.signout} onClick={handleSignout}>
         {props.isSignedIn ? <span  className={styles.Link}>
            <img src='https://cdn-icons-png.flaticon.com/128/1828/1828490.png' />
            <b>SignOut</b>
           </span> : null }
         </span>
         <span className={styles.signin}>
         {props.isSignedIn ? null : <Link to = '/signin' className={styles.Link}>
            <img src='https://cdn-icons-png.flaticon.com/128/1176/1176390.png' alt='signin'/>
            <b>SignIn</b>
            </Link>} 
         </span>
        
       </span>
             
        </div>
        <Outlet />
        </>
    )
}