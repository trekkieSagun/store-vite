import React, { useState, useEffect } from 'react';
import './App.scss';
import { Button, Card, Modal } from 'antd';
import Login from './Login';
import { Skeleton } from "@/components/ui/skeleton"



interface Rating {
  count: number;
  rate: number;
 }
 
interface Product {
 id: number;
 title: string;
 price: number;
 description: string;
 category: string;
 image: string;
 rating: Rating;

}

// 

const App: React.FC = () => {
 const [products, setProducts] = useState<Product[]>([]);
 const [isLoading, setIsLoading] = useState<boolean>(true);
 const [token, setToken] = useState<String>("");
 const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
 const [isModalOpen, setIsModalOpen] = useState<boolean>(false);




 useEffect(() => {

  let localToken = localStorage.getItem("token");
  if(localToken){
    setIsAuthenticated(true)
  }else{
    setIsAuthenticated(false)
  }

  
 }, [token])


 

 const handleModal = () => {
  setIsModalOpen(!isModalOpen);
};


const handleLogin = (values) =>{
  
  fetch('https://fakestoreapi.com/auth/login',{
    method:'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        username: values.username,
        password: values.password
    })
})
.then(res => res.json())
.then(json => {
  setToken(json)
  setIsAuthenticated(true)
  setIsModalOpen(false)
  localStorage.setItem("token",json)
})
.catch(error => console.error('Error:', error));
}


const handleLogout = () =>{
  setToken("")
  alert("You have been logged out of the system")
  localStorage.removeItem("token");
}

const handleRegister = () =>{
  fetch('https://fakestoreapi.com/users',{
            method:"POST",
            body:JSON.stringify(
                {
                    email:'fake@gmail.com',
                    username:'fake',
                    password:'fakepass',
                    name:{
                        firstname:'Fake',
                        lastname:'Man Singh'
                    },
                    address:{
                        city:'kilcoole',
                        street:'7835 new road',
                        number:3,
                        zipcode:'12926-3874',
                        geolocation:{
                            lat:'-37.3159',
                            long:'81.1496'
                        }
                    },
                    phone:'1-570-236-7033'
                }
            )
        })
            .then(res=>res.json())
            .then(json=>{console.log(json)
            alert("Register")
            })
}
 


 const handleAddToCart = (prod: Product): void => {

  if (!isAuthenticated) {
    alert("You need to login to add the product to cart!!");
  } else {
    // Add product to cart logic goes here
  }
 }

 useEffect(() => {
   fetch('https://fakestoreapi.com/products')
     .then((res) => res.json())
     .then((data) => {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
      setProducts(data);
     })
 }, []);

 return (
   <div className='home'>

<Modal title = "Login" open= {isModalOpen} onCancel={handleModal}>
    <Login handleLogin={handleLogin} />
  </Modal>
     <div className='container'>
       <div className='header-cart text-end'>
         {
          !isAuthenticated ? <>
          <Button onClick={handleModal}>Login</Button>
         <Button onClick={handleRegister}>Register User </Button></>
         :

         <>
    
    <div className='flex'>
    <Button onClick={handleLogout}>Logout</Button>
         <svg xmlns="http://www.w3.org/2000/svg" viewBox="-3 -4 24 24" width="28" fill="currentColor"><path d="M7 16a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm7 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4zM.962 1.923A.962.962 0 0 1 .962 0h1.151c.902 0 1.682.626 1.878 1.506l1.253 5.642c.196.88.976 1.506 1.878 1.506h7.512l1.442-5.77H6.731a.962.962 0 0 1 0-1.922h9.345a1.923 1.923 0 0 1 1.866 2.39L16.5 9.12a1.923 1.923 0 0 1-1.866 1.457H7.122a3.846 3.846 0 0 1-3.755-3.012L2.113 1.923H.962z"></path></svg>
        
    </div>
     </>

         }
       </div>

       <div className='all-products-container'>
        {
          products.map((prod, key)=>(

           <div key={key} className='prod-item'>
             <Card
            style={{
              width: 300,
              height: 350,
              marginTop: 10,
            }}
            // loading={isLoading}
          >

            {
              isLoading ?  <>
          

            <Skeleton className="w-[100%] h-[220px]" />
            <Skeleton className="w-[100%] h-[20px] my-3" />
            <Skeleton className="w-[60%] h-[20px] my-3" />

            </>
            :
          <>
            <div className='prod-img'>
            <img src = {prod.image} />
            </div>
               <p className='py-3'>
               {prod.title}
               </p></>
            }

      {isAuthenticated && <div className='add-to-cart'>
          <Button size = {'large'}shape="circle" icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="-3 -4 24 24" width="28" fill="currentColor"><path d="M7 16a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm7 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4zM.962 1.923A.962.962 0 0 1 .962 0h1.151c.902 0 1.682.626 1.878 1.506l1.253 5.642c.196.88.976 1.506 1.878 1.506h7.512l1.442-5.77H6.731a.962.962 0 0 1 0-1.922h9.345a1.923 1.923 0 0 1 1.866 2.39L16.5 9.12a1.923 1.923 0 0 1-1.866 1.457H7.122a3.846 3.846 0 0 1-3.755-3.012L2.113 1.923H.962z"></path></svg>} onClick={()=>handleAddToCart(prod)} />

        </div>}
          </Card>
           </div>
           
          ))
        }
       </div>
     </div>
   </div>
 );
};

export default App;
