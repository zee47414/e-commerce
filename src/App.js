import Navbar from './components/Navbar/Navbar';
import Home from  './components/Home/Home';
import SignIn from './components/SignIn/SignIn';
import SignUp from './components/SignUp/SignUp';
import Cart from './components/Cart/Cart';
import Order from './components/Order/Order';
import { BrowserRouter,Route,Routes ,Navigate} from 'react-router-dom';
import { useState, useEffect } from 'react';
import { auth } from './firebase';
import CustomCartContext from './cartContext';
function App() {
  const [isSignedIn,setIsSignedIn] = useState(false);
  const [userId,setUserId] = useState("");
  useEffect(()=>{
    auth.onAuthStateChanged((user)=>{
      if(user){
        setIsSignedIn(true);
        setUserId(user.uid);
        console.log(user.uid);

      }else{
        setIsSignedIn(false);
      }
    })
  },[])
  
  return (
    <BrowserRouter>
    <CustomCartContext>
    <Routes>
      
     <Route path='/' element= {<Navbar isSignedIn={isSignedIn} setIsSignedIn={setIsSignedIn}/>}>

       <Route path='/' element = {<Home userId={userId} />} />
       <Route path='/signin' element = {isSignedIn ? <Navigate to= '/' /> : <SignIn />} />
       <Route path='/cart' element = {isSignedIn ? <Cart userId={userId}/> : <Navigate to='/' />} />
       <Route path='/order' element = { isSignedIn ? <Order /> : <Navigate to='/' />  } />
       <Route path='/signup' element = {isSignedIn ? <Navigate to= '/' /> : <SignUp />} />
       
     </Route>
     
    </Routes>
    </CustomCartContext>
   </BrowserRouter>
  );
}

export default App;
