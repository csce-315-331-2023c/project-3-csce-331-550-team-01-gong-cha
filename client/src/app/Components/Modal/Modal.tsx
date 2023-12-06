"use client"

import React, { useState, useEffect } from 'react'
import MenuItem from '../TabelItems/Topping/Topping'
import Topping from '../TabelItems/Topping/Topping'
import { DrinkImage } from '../DinkImage/DrinkImage'
import { Divider } from 'rsuite'
import './styles.css'



interface Topping {
  id: number;
  toppingName: string;
}


interface orderDrink {
  name: string;
  ice: number;
  sugar: number;
  sz: number;
  totalPrice: number; // cost for customer
  costPrice: number; // cost for us to make
  id: number;
  toppings: Topping[];
  toppingAmounts: number[];
}

interface ModalProps {
  open: boolean;
  children: React.ReactNode
  onClose: () => void;
  drinkName: string;
  lgDrinkPrice: number;
  nmDrinkPrice: number;
  lgCost: number;
  nmCost: number;
  drinkID: number;
  setStateUpdate: (state: boolean) => void;
  
}

export default function Modal({ open, children, onClose, drinkName, lgDrinkPrice, nmDrinkPrice, drinkID, setStateUpdate}: ModalProps) {
  const [currentModal, setCurrentModal] = useState(0);
  const [toppingsPrice, setToppingsPrice] = useState(0);
  

  const [selectedOptions, setSelectedOptions] = useState({
    name: drinkName,
    size: 0,
    iceLevel: 1,
    sugarLevel: 0,
    totalPrice: nmDrinkPrice,
    totalCost: 0,
    id: drinkID,
    theToppings: [],
    toppingAmounts: [],

  });



  interface Ingredient {
    id: number;
    name: string;
    price: number;
  }

  const [toppings, setToppings] = useState<Topping[]>([]);
  const [ingredientQuantities, setIngredientQuantities] = useState<number[]>([]);

  const handleStateUpdate = () => {
    const newDrink: orderDrink = {
      name: selectedOptions.name,
      ice: selectedOptions.iceLevel,
      sugar: selectedOptions.sugarLevel,
      sz: selectedOptions.size,
      totalPrice: selectedOptions.totalPrice + toppingsPrice,
      costPrice: selectedOptions.totalCost,
      id: selectedOptions.id,
      toppings: toppings,
      toppingAmounts: ingredientQuantities,
    }
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      localStorage.setItem('orders', JSON.stringify([...existingOrders, newDrink]));
      // alert(newDrink.toppingPks);
      // alert(newDrink.toppingAmounts);
    setStateUpdate(true);
  
  }
  const resetModalState = () => {
    setToppingsPrice(0);
    setSelectedOptions({
      name: drinkName,
      size: 0,
      iceLevel: 1,
      sugarLevel: 0,
      totalPrice: nmDrinkPrice,
      totalCost: 0,
      id: drinkID,
      theToppings: [],
      toppingAmounts: []
    });
    setCurrentModal(0);
    clearToppings()
  };

  const handleClose = () => {
    resetModalState();
    onClose();
  };
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  
  useEffect(() => {
      if (open && currentModal == 1) {
        fetch('http://18.191.166.59:5000/ingredients') 
          .then((response) => {
            if (!response.ok) {
              alert("did not pass");
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then((data) => {
            
            
            const ingredientData: Ingredient[] = data.map((item: any) => ({
              id: item.id,
              name: item.ingredient_name,
              price: item.consumer_price
            }));
            setIngredients(ingredientData);
          })
          .catch((error) => {
            console.error('There was a problem with the fetch operation:', error);
          });
      }
    }, [open, currentModal]);

  const clearToppings = () => {

    setToppings([]);
    setIngredientQuantities([]);
  }
  
  const addTopping = (price: number, currentTopping: Topping) => {
    setToppingsPrice(toppingsPrice + price);

    // Find the index of a topping with the same id as currentTopping
    const index = toppings.findIndex(topping => topping.id === currentTopping.id);

    if (index >= 0) {
        
        const newQuantities = [...ingredientQuantities];
        newQuantities[index] += 1;
        setIngredientQuantities(newQuantities);
    } else {

        setToppings([...toppings, currentTopping]);
        setIngredientQuantities([...ingredientQuantities, 1]);
    }
}

  const removeTopping = (price: number, currentTopping: Topping) => {
    if (toppingsPrice >= price){
      setToppingsPrice(toppingsPrice - price)
    }

    const index = toppings.indexOf(currentTopping);
      if (index >= 0 && ingredientQuantities[index] > 0) {
        const newQuantities = [...ingredientQuantities];
        newQuantities[index] -= 1;
        setIngredientQuantities(newQuantities);
      }
      else if (index >= 0 && ingredientQuantities[index] == 0){
        delete ingredientQuantities[index];
      }
  }

  const handleNext = () => {
    if (currentModal < 1) {
      setCurrentModal(currentModal + 1);
    }
  };

  const handleBack = () => {
    if (currentModal > 0) {
      setCurrentModal(currentModal - 1);
      setToppingsPrice(0);
    }
  }

  const handleIce = (ice: number) => {
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      iceLevel: ice
    }))

  }

  const handleSugar = (sugar: number) => {
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      sugarLevel: sugar
    }))

  }

  const handleSize = (newSize: number, cost: number) => {
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      size: newSize,
      totalPrice: toppingsPrice + cost
    }))

  }

const getIceButtonStyle = (iceLevel: number) => {
  return selectedOptions.iceLevel === iceLevel ? "bg-rose-700 text-white font-semibold" : "bg-slate-100 hover:bg-rose-700 hover:text-white";
}

const getSugarButtonStyle = (sugarLevel: number) => {
  return selectedOptions.sugarLevel === sugarLevel ? "bg-rose-700 text-white font-semibold" : "bg-slate-100 hover:bg-rose-700 hover:text-white";
}

const getSizeButtonStyle = (size: number) => {
  return selectedOptions.size === size ? "bg-rose-700 text-white font-semibold" : "bg-slate-100 hover:bg-rose-700 hover:text-white";
}
  const modals = [
    (
      <>
      <div className="Overlay_Styles"></div>
    <div  className="Modal_Styles bg-slate-200 justify-evenly text-rose-800 font-semibold">
      <div className="text-4xl">Customize Your {drinkName}</div>
      {/* {drinkName} */}
      {/* Normal and large div */}
      <div className="flex-row flex justify-evenly h-1/5">
        <button className= {`${getSizeButtonStyle(0)} options rounded-3xl border-rose-700 border-4 w-1/5`}onClick={() => (handleSize(0, nmDrinkPrice))}>Normal</button>
        <button className={`${getSizeButtonStyle(1)} options rounded-3xl border-rose-700 border-4 w-1/5`} onClick={() => (handleSize(1, lgDrinkPrice))}>Large</button>
      </div>

      {/* ice and sugar divs */}
      <div className="flex-row flex h-1/5">
      <div className=" w-1/2 left-0 justify-evenly flex">
        <button className={`${getIceButtonStyle(1)} options rounded-3xl border-rose-700 border-4 w-1/4 h-full p-2`} onClick={() => (handleIce(1))}>No Ice</button>
        <button className={`${getIceButtonStyle(2)} options rounded-3xl border-rose-700 border-4 w-1/4 h-full p-2`} onClick={() => (handleIce(2))}>Less Ice</button>
        <button className={`${getIceButtonStyle(3)} options rounded-3xl border-rose-700 border-4 w-1/4 h-full p-2`} onClick={() => (handleIce(3))}>More Ice</button>
      </div>

      <div className=" w-1/2 left-0 justify-evenly space-between flex">
        <button className={`${getSugarButtonStyle(0)} options rounded-3xl border-rose-700 border-4 w-1/6 h-full`} onClick={() => (handleSugar(0))}>0% Sugar</button>
        <button className={`${getSugarButtonStyle(1)} options rounded-3xl border-rose-700 border-4 w-1/6 h-full`} onClick={() => (handleSugar(1))}>30% Sugar</button>
        <button className={`${getSugarButtonStyle(2)} options rounded-3xl border-rose-700 border-4 w-1/6 h-full`} onClick={() => (handleSugar(2))}>50% Sugar</button>
        <button className={`${getSugarButtonStyle(3)} options rounded-3xl border-rose-700 border-4 w-1/6 h-full`} onClick={() => (handleSugar(3))}>70% Sugar</button>
        <button className={`${getSugarButtonStyle(4)} options rounded-3xl border-rose-700 border-4 w-1/6 h-full`} onClick={() => (handleSugar(4))}>100% Sugar</button>
      </div>
      </div>

      <div className="flex justify-evenly">
      <button onClick={() => {handleClose()}} className="options rounded-3xl border-rose-700 border-4 w-1/4 bg-slate-100 hover:bg-rose-700 hover:text-white">Exit</button>
      <button  onClick={handleNext} className="options rounded-3xl border-rose-700 border-4 w-1/4 bg-slate-100 hover:bg-rose-700 hover:text-white">Next</button>
      </div>
      
    </div>
    </>
    ),
    
    (  
      <>
      <div className="Overlay_Styles"></div>
    <div  className="Modal_Styles bg-slate-200 justify-evenly text-rose-800 font-semibold">
    <div className="text-4xl">Customize Your {drinkName}</div>
      <div className="flex-col justify-evenly border-white border-2 rounded-3xl bg-slate-200 p-1" style={{ maxHeight: '200px', overflowY: 'auto' }}>
        
        {ingredients.filter((ingredient) => ingredient.id >= 26 && ingredient.id <= 40 )
        .map((ingredient, index) => (
          
          <Topping
            key={index}
            toppingName={ingredient.name}
            price={ingredient.price}
            toppingID={ingredient.id}
            addTopping={() => addTopping(ingredient.price, {id: ingredient.id, toppingName: ingredient.name})}
            removeTopping={() => removeTopping(ingredient.price,  {id: ingredient.id, toppingName: ingredient.name})}
            toppings={toppings}
            toppingAmounts={ingredientQuantities}
        />
      ))}
       
      </div>
     

      <div className="flex justify-evenly  ">
      <button  onClick={handleBack} className="options rounded-3xl border-rose-700 border-4 w-1/4 bg-slate-100 hover:bg-rose-700 hover:text-white">Back</button>
        
      <button onClick={() => {handleClose()}} className="options rounded-3xl border-rose-700 border-4 w-1/4 bg-slate-100 hover:bg-rose-700 hover:text-white">Exit</button>
      <button  onClick={() => {handleStateUpdate(); handleClose()}} className="options rounded-3xl border-rose-700 border-4 w-1/4 bg-slate-100 hover:bg-rose-700 hover:text-white">Add Drink</button>
      </div>
      <div className="w-full place-items-center flex justify-center">
        <div className="options rounded-3xl border-rose-700 border-4 w-1/4 bg-slate-100">
            $: {toppingsPrice}
        </div>
      </div>
      
      
    </div>
    </>
    )
  ];

  if (!open) return null
  return modals[currentModal]
}
