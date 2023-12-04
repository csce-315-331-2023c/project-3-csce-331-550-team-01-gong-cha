"use client"

import Image, { StaticImageData } from 'next/image'
import MenuItem from '../MenuItem/MenuItem';
import Modal from '../Modal/Modal'
import defualtDrinkImg from '../../../../public/defualtDrinkImg.png'
import defualtDrinkImg2 from '/public/DrinkImages/Black Milk Tea.png'
import {DrinkImage} from '../DinkImage/DrinkImage';
import { useState, useEffect} from 'react';
import OrderDrink from '../OrderDrink/OrderDrink';
import ConfirmOrder from '../ConfirmOrder/ConfirmOrder'
import "./styles.css"


interface OpenModals {
  [key:string]: boolean;
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

  function goBack(){
    window.location.href = "../";
}
  const [openModals, setOpenModals] = useState<OpenModals>({});
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  //const picture = require(`../../../../public/DrinkImages/${categoryDrinks[1].name}`);

  const pictures = categoryDrinks.map((x) => `../../../../public/DrinkImages/${x.name}`);

  const openModal = (category: string) => {
    setOpenModals({...openModals, [category]: true});
  };

  const closeModal = (category: string) => {
    setOpenModals({...openModals, [category]: false});
  };

  const closeConfirmOrder = () => {
    setIsOrderPlaced(false);
  };

  function goToCategory(category: string){
    window.location.href = "../../Order/" + category;
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
  id: number,
  toppingPks: number[],
  toppingAmounts: number[],
}

const [drinksState, setDrinksState] = useState<orderDrink[]>([]);


useEffect(() => {
  const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
  //alert(storedOrders)
  setDrinksState(storedOrders);
})
    return(
      
      <div className="relative mt-10">
        {isOrderPlaced && (
        <ConfirmOrder 
            drinks={drinksState}
            onClose={() => closeConfirmOrder()}
        />
    )}
      <button className='backContainter flex items-center' onClick={goBack}>
                <svg className='ml-4' xmlns="http://www.w3.org/2000/svg" height="5em" viewBox="0 0 448 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>
                <div className='ml-8 text-4xl'>Catagories</div>
                <div className='ml-80 text-6xl'>Milk Tea</div>
        </button>
      <div className='catagoryContainer w-screenflex-row flex h-full space-between text-xl'>
        
      <div className="flex flex-col items-center justify-start w-1/2 h-full m-4">
         {firstHalfCategories.map((category)=> (
          <div className = "h-1/4 w-full mt-10" key={category.name}>
            
          <MenuItem 
           drinkName={category.name}
            drinkImage={DrinkImage[`_${category.id}` as keyof typeof DrinkImage]} 
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
          drinkImage={DrinkImage[`_${category.id}` as keyof typeof DrinkImage]} 
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
      <div className = "orderContainer bg-white border-black rounded-lg w-1/3 h-full text-center">
      {drinksState.map((drink, key) => (
        <OrderDrink
          key = {key}
          drinkName= {drink.name}
          ice = {drink.ice}
          sugar = {drink.sugar}
          size={drink.sz}
          price={drink.totalPrice}
          toppingPks={drink.toppingPks}
          toppingAmounts={drink.toppingAmounts}
          />
          
      ))}
      <div className="flex flex-col items-center">
    <button className="mb-2 bottom-0" onClick={() => {setIsOrderPlaced(true);}}>Place Order</button>
    <button onClick={() => {localStorage.clear();}}>Clear Order</button>
    </div>

      
      </div>
      </div>
      </div>
    );
}