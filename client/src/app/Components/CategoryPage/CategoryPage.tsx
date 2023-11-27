"use client"

import Image, { StaticImageData } from 'next/image'
import MenuItem from '../MenuItem/MenuItem';
import Modal from '../Modal/Modal'
import defualtDrinkImg from '../../../../public/defualtDrinkImg.png'
import defualtDrinkImg2 from '/public/DrinkImages/Black Milk Tea.png'
import {DrinkImage} from '../DinkImage/DrinkImage';
import { useState, useEffect} from 'react';
import OrderDrink from '../OrderDrink/OrderDrink';



interface OpenModals {
  [key:string]: boolean;
}

interface orderDrink {
  name: string;
  ice: number;
  sugar: number;
  sz: number;
  totalPrice: number; // cost for customer
  costPrice: number; // cost for us to make
  id: number;
}

type Drink = {
  id: number;
  name: string;
  normal_cost: number;
  large_cost: number;
  norm_consumer_price: number;
  lg_consumer_price: number;
};

interface CategoryPageProps {
  categoryDrinks: Drink[];
  
}
  
export default function CategoryPage({categoryDrinks}: CategoryPageProps){
  const [openModals, setOpenModals] = useState<OpenModals>({});

  //const picture = require(`../../../../public/DrinkImages/${categoryDrinks[1].name}`);

  const pictures = categoryDrinks.map((x) => `../../../../public/DrinkImages/${x.name}`);

  const openModal = (category: string) => {
    setOpenModals({...openModals, [category]: true});
  };

  const closeModal = (category: string) => {
    setOpenModals({...openModals, [category]: false});
  };

  function goToCategory(category: string){
    window.location.href = "../../Order/" + category;
}

  function placeOrder(){
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    existingOrders.forEach((drink: orderDrink) => {
      // Process each order here
      // For example, you can log each order to the console
      alert(JSON.stringify({Total_Price: drink.totalPrice, Size: drink.sz, Menu_Drink_ID: drink.id, Ice_Level: drink.ice, Sugar_Level: drink.sugar}));
      fetch('http://18.191.166.59:5000/create-order-drink/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({Total_Price: drink.totalPrice, Size: drink.sz, Menu_Drink_ID: drink.id, Ice_Level: drink.ice, Sugar_Level: drink.sugar})
      })
  })
  
  }

const halfLength = Math.ceil(categoryDrinks.length / 2);

const firstHalfCategories = categoryDrinks.slice(0, halfLength);
const secondHalfCategories = categoryDrinks.slice(halfLength);

const firstHalfPictures = pictures.slice(0, halfLength);
const secondHalfPictures = pictures.slice(halfLength);

interface orderDrink {
  name: string;
  ice: number;
  sugar: number;
  sz: number;
  totalPrice: number; // cost for customer
  costPrice: number; // cost for us to make
  id: number
}

const [drinksState, setDrinksState] = useState<orderDrink[]>([]);

useEffect(() => {
  const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
  //alert(storedOrders)
  setDrinksState(storedOrders);
})
    return(
      <div className='catagoryContainer w-screenflex-row flex h-full'>
      <div className="flex flex-col items-center justify-start w-1/2 h-full m-4">
         {firstHalfCategories.map((category)=> (
          <div className = "h-1/4 w-full mt-10" key={category.name}>
            
          <MenuItem 
           drinkName={category.name}
            drinkImage={DrinkImage[`_${category.id}`]} 
            altTxt={"Test Drink"}
           thisOnClick={() => openModal(category.name)}/>
           <Modal open={openModals[category.name]} onClose={() => closeModal(category.name)} 
            drinkName={category.name}
            lgDrinkPrice={category.lg_consumer_price} nmDrinkPrice={category.norm_consumer_price}
            lgCost={category.large_cost} nmCost={category.normal_cost}
            drinkID={category.id}>
             Customize Ingredients</Modal>
          </div>
           
         ))}
      </div>
      <div className="flex flex-col items-center justify-start w-1/2 h-full m-4">
         {secondHalfCategories.map((category) => (
          <div className="h-1/4 w-full mt-10" key={category.name} >
            <MenuItem
           drinkName={category.name}
          drinkImage={DrinkImage[`_${category.id}`]} 
            altTxt={"Test Drink"} 
            thisOnClick={() => openModal(category.name)}/>
            <Modal open={openModals[category.name]} onClose={() => closeModal(category.name)} 
            drinkName={category.name}
            lgDrinkPrice={category.lg_consumer_price} nmDrinkPrice={category.norm_consumer_price}
            lgCost={category.large_cost} nmCost={category.normal_cost}
            drinkID={category.id}>
             Customize Ingredients</Modal>
           </div>
           
         ))}
      </div>
      <div className = "bg-white border-black rounded-lg w-1/5 h-full">
      {drinksState.map((drink, key) => (
        <OrderDrink
          key = {key}
          drinkName= {drink.name}
          ice = {drink.ice}
          sugar = {drink.sugar}
          size={drink.sz}/>
      ))}
      <button onClick={() => {placeOrder(); localStorage.clear()}}>Place Order</button>
      </div>
      </div>

    );
}