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
         <Button onClick={handleLogout}>Logout</Button>

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
          <Button size = {'large'}shape="circle" icon={<p>asd</p>} onClick={()=>handleAddToCart(prod)} />

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
