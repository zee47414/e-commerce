import { createContext, useContext ,useEffect,useState} from "react";
import {auth} from './firebase'

const appContext = createContext();


// custom hooks
function useAppValue(){
    const value = useContext(appContext);
    return value;
}

// custom Provide
function CustomAppContext({children}){
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
        <>
        <appContext.Provider value={{
       isSignedIn,setIsSignedIn,userId
        }}>
            {children}
        </appContext.Provider>
        </>
    )
}
export {useAppValue}
export default CustomAppContext;