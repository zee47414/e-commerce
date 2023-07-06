import Navbar from './components/Navbar/Navbar';
import Home from  './components/Home/Home';
import SignIn from './components/SignIn/SignIn';
import SignUp from './components/SignUp/SignUp';
import Cart from './components/Cart/Cart';
import Order from './components/Order/Order';
import { BrowserRouter,Route,Routes ,Navigate} from 'react-router-dom';
import CustomCartContext from './cartContext';
import CustomHomeContext from './homeContext';
import { useAppValue } from './appContext';
function App() {
  const {isSignedIn,setIsSignedIn,userId} = useAppValue();
  
  return (
    <BrowserRouter>
    
    <CustomCartContext>
      <CustomHomeContext>
    <Routes>
      
     <Route path='/' element= {<Navbar isSignedIn={isSignedIn} setIsSignedIn={setIsSignedIn}/>}>
       <Route path='/' element = {<Home userId={userId} />} />
       <Route path='/signin' element = {isSignedIn ? <Navigate to= '/' /> : <SignIn />} />
       <Route path='/cart' element = {isSignedIn ? <Cart userId={userId}/> : <Navigate to='/' />} />
       <Route path='/order' element = { isSignedIn ? <Order userId = {userId}/> : <Navigate to='/' />  } />
       <Route path='/signup' element = {isSignedIn ? <Navigate to= '/' /> : <SignUp />} />
     </Route>
     
    </Routes>
      </CustomHomeContext>
    </CustomCartContext>
  
   </BrowserRouter>
  );
}

export default App;
