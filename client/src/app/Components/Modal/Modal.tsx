"use client"

import React, { useState, useEffect } from 'react'
import MenuItem from '../TabelItems/Topping/Topping'
import Topping from '../TabelItems/Topping/Topping'
import './styles.css'


interface orderDrink {
  name: string;
  ice: number;
  sugar: number;
  sz: number;
  totalPrice: number; // cost for customer
  costPrice: number; // cost for us to make
  id: number;
  toppingPks: number[];
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
  
}

export default function Modal({ open, children, onClose, drinkName, lgDrinkPrice, nmDrinkPrice, drinkID}: ModalProps) {
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
    toppingPks: [],
    toppingAmounts: [],

  });



  interface Ingredient {
    id: number;
    name: string;
    price: number;
  }

  const handleStateUpdate = () => {
    const newDrink: orderDrink = {
      name: selectedOptions.name,
      ice: selectedOptions.iceLevel,
      sugar: selectedOptions.sugarLevel,
      sz: selectedOptions.size,
      totalPrice: selectedOptions.totalPrice + toppingsPrice,
      costPrice: selectedOptions.totalCost,
      id: selectedOptions.id,
      toppingPks: toppingPks,
      toppingAmounts: ingredientQuantities,
    }
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      localStorage.setItem('orders', JSON.stringify([...existingOrders, newDrink]));
      // alert(newDrink.toppingPks);
      // alert(newDrink.toppingAmounts);
  
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
      toppingPks: [],
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
  const [toppingPks, setToppingPks] = useState<number[]>([]);
  const [ingredientQuantities, setIngredientQuantities] = useState<number[]>([]);
  
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

    setToppingPks([]);
    setIngredientQuantities([]);
  }
  
  const addTopping = (price: number, pk: number, name: string) => {
    setToppingsPrice(toppingsPrice + price)

    // toppingsInOrder.push({id: pk, name: name});
    const index = toppingPks.indexOf(pk);
    if (index >= 0) {
      const newQuantities = [...ingredientQuantities];
      newQuantities[index] += 1;
      setIngredientQuantities(newQuantities);
    } else {
      setToppingPks([...toppingPks, pk]);
      setIngredientQuantities([...ingredientQuantities, 1]);
  }
  }

  const removeTopping = (price: number, pk:number) => {
    if (toppingsPrice >= price){
      setToppingsPrice(toppingsPrice - price)
    }

    const index = toppingPks.indexOf(pk);
      if (index >= 0 && ingredientQuantities[index] > 0) {
        const newQuantities = [...ingredientQuantities];
        newQuantities[index] -= 1;
        setIngredientQuantities(newQuantities);
      }
      else if (index >= 0 && ingredientQuantities[index] == 0){
        delete ingredientQuantities[index];
      }
  }


  const [toppingsInOrder, setToppingsInOrder] = useState<Ingredient[]>([]);

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
  return selectedOptions.iceLevel === iceLevel ? "bg-rose-700" : "bg-white";
}

const getSugarButtonStyle = (sugarLevel: number) => {
  return selectedOptions.sugarLevel === sugarLevel ? "bg-rose-700" : "bg-white";
}

const getSizeButtonStyle = (size: number) => {
  return selectedOptions.size === size ? "bg-rose-700" : "bg-white";
}
  const modals = [
    (
      <>
      <div className="Overlay_Styles"></div>
    <div  className="Modal_Styles bg-slate-400 justify-evenly">
      { children }
      {/* {drinkName} */}
      {/* Normal and large div */}
      <div className="flex-row flex justify-evenly h-1/5">
        <button className={`${getSizeButtonStyle(0)} rounded-lg w-1/5 p-2`}onClick={() => (handleSize(0, nmDrinkPrice))}>Normal</button>
        <button className={`${getSizeButtonStyle(1)} rounded-lg w-1/5 p-2`} onClick={() => (handleSize(1, lgDrinkPrice))}>Large</button>
      </div>

      {/* ice and sugar divs */}
      <div className="flex-row flex h-1/5">
      <div className=" w-1/2 left-0 justify-evenly flex">
        <button className={`${getIceButtonStyle(1)} rounded-lg w-1/5 p-2`} onClick={() => (handleIce(1))}>No Ice</button>
        <button className={`${getIceButtonStyle(2)} rounded-lg w-1/5 p-2`} onClick={() => (handleIce(2))}>Less Ice</button>
        <button className={`${getIceButtonStyle(3)} rounded-lg w-1/5 p-2`} onClick={() => (handleIce(3))}>More Ice</button>
      </div>

      <div className=" w-1/2 left-0 justify-evenly flex">
        <button className={`${getSugarButtonStyle(0)} rounded-lg w-1/5 p-2`} onClick={() => (handleSugar(0))}>0% Sugar</button>
        <button className={`${getSugarButtonStyle(1)} rounded-lg w-1/5 p-2`} onClick={() => (handleSugar(1))}>30% Sugar</button>
        <button className={`${getSugarButtonStyle(2)} rounded-lg w-1/5 p-2`} onClick={() => (handleSugar(2))}>50% Sugar</button>
        <button className={`${getSugarButtonStyle(3)} rounded-lg w-1/5 p-2`} onClick={() => (handleSugar(3))}>70% Sugar</button>
        <button className={`${getSugarButtonStyle(4)} rounded-lg w-1/5 p-2`} onClick={() => (handleSugar(4))}>100% Sugar</button>
      </div>
      </div>

      <div className="flex justify-evenly">
      <button onClick={() => {setCurrentModal(0); onClose(); handleIce(1); handleSize(0, nmDrinkPrice); handleSugar(0)}} className="border-white border-2 rounded-md w-1/4 bg-rose-700 hover:bg-white">Exit</button>
      <button  onClick={handleNext} className="border-white border-2 rounded-md w-1/4 bg-rose-700 hover:bg-white">Next</button>
      </div>
      
    </div>
    </>
    ),


    // Modal for toppings
    (
      
      <>
      <div className="Overlay_Styles"></div>
    <div className="Modal_Styles bg-slate-400 justify-evenly">
      { children }

      {/* Toppings list */}
      

      <div className="flex-col justify-evenly border-white border-2 rounded-md" style={{ maxHeight: '200px', overflowY: 'auto' }}>
       {ingredients.filter((ingredient) => ingredient.id >= 26 && ingredient.id <= 40 )
        .map((ingredient, index) => (
          <Topping
            key={index}
            toppingName={ingredient.name}
            price={ingredient.price}
            toppingID={ingredient.id}
            addTopping={() => addTopping(ingredient.price, ingredient.id, ingredient.name)}
            removeTopping={() => removeTopping(ingredient.price, ingredient.id)}
            toppingPks={toppingPks}
            toppingAmounts={ingredientQuantities}
        />
      ))}
        
      </div>
     

      <div className="flex justify-evenly  ">
      <button  onClick={handleBack} className="border-white border-2 rounded-md w-1/4 bg-rose-700 hover:bg-white">Back</button>
        
      <button onClick={() => {handleClose()}} className="border-white border-2 rounded-md w-1/4 bg-rose-700 hover:bg-white">Exit</button>
      <button  onClick={() => {handleStateUpdate(); handleClose()}} className="border-white border-2 rounded-md w-1/4 bg-rose-700 hover:bg-white">Add Drink</button>
      </div>
      <div className="w-full place-items-center flex justify-center">
        <div className="border-white border-2 rounded-md w-1/3 text-xl bg-rose-700">
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
