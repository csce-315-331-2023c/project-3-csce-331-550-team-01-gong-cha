"use client"

import Image, { StaticImageData } from 'next/image'
import MenuItem from '../MenuItem/MenuItem';
import Modal from '../Modal/Modal'
import defualtDrinkImg from '../../../../public/defualtDrinkImg.png'
import { useState, useEffect} from 'react';
import OrderDrink from '../OrderDrink/OrderDrink';

interface CategoryPageProps {
    categoryNames: string[];
    
  }

  
export default function CategoryPage({categoryNames}: CategoryPageProps){
  const [isOpen, setIsOpen] = useState(false)


  function goToCategory(category: string){
    window.location.href = "../../Order/" + category;
}

const halfLength = Math.ceil(categoryNames.length / 2);
const firstHalfCategories = categoryNames.slice(0, halfLength);
const secondHalfCategories = categoryNames.slice(halfLength);
const drinks = localStorage.getItem('orders')
const json = JSON.stringify(drinks)
const currentOrderDrinks = JSON.parse(json)

interface orderDrink {
  name: string;
  ice: number;
  sugar: number;
  sz: number;
}

const [drinksState, setDrinksState] = useState<orderDrink[]>([]);


// const clearOrders = () => {
// setDrinksState([]);
// } 
useEffect(() => {
  const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
  setDrinksState(storedOrders);
})
    return(
      <div className='catagoryContainer w-screen w-screenflex-row flex h-full'>
      <div className="flex flex-col items-center justify-start w-1/2 h-full m-4">
         {firstHalfCategories.map((category, key) => (
          <div className = "h-1/4 w-full mt-10">
            <MenuItem
           key = {key} 
           drinkName={category}
          drinkImage={defualtDrinkImg} 
            altTxt={"Test Drink"} 
           thisOnClick={() => setIsOpen(true)}/>
           <Modal open={isOpen} onClose={() => setIsOpen(false)} 
           drinkName={category} setDrinkState={setDrinksState} >
            Customize Ingredients</Modal>
          </div>
           
         ))}
      </div>
      <div className="flex flex-col items-center justify-start w-1/2 h-full m-4">
         {secondHalfCategories.map((category, key) => (
          <div className="h-1/4 w-full mt-10">
            <MenuItem
           key = {key} 
           drinkName={category}
          drinkImage={defualtDrinkImg} 
            altTxt={"Test Drink"} 
           thisOnClick={() => setIsOpen(true)}/>
           <Modal open={isOpen} onClose={() => setIsOpen(false)} 
           drinkName={category} setDrinkState={setDrinksState} >
            Customize Ingredients</Modal>

          </div>
           
         ))}
      </div>
      <div className = "bg-white border-black rounded-lg">
      {drinksState.map((drink, index) => (
        <OrderDrink
          key = {index}
          drinkName= {drink.name}
          ice = {drink.ice}
          sugar = {drink.sugar}
          size={drink.sz}/>
      ))}
      </div>
      

      <button onClick={() => localStorage.clear()}>clearOrders</button>
      </div>

      


    );
}