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
  // price: number;
}

interface ModalProps {
  open: boolean;
  children: React.ReactNode
  onClose: () => void;
  drinkName: string;
  lgDrinkPrice: number;
  nmDrinkPrice: number;
  // lgCost: number;
  // nmCost: number;
  setDrinkState: (newState: (prevDrinkState: orderDrink[]) => orderDrink[]) => void;
  
}

export default function Modal({ open, children, onClose, drinkName, setDrinkState, lgDrinkPrice, nmDrinkPrice}: ModalProps) {
  const [currentModal, setCurrentModal] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedIce, setSetlectedIce] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  const [selectedSugar, setSelectedSugar] = useState(0);
  

  const [selectedOptions, setSelectedOptions] = useState({
    size: 0,
    iceLevel: 0,
    sugarLevel: 0,
    // price: 0
  });



  interface Ingredient {
    id: number;
    name: string;
    price: number;
  }

  const handleStateUpdate = () => {
    const newDrink: orderDrink = {
      name: drinkName,
      ice: selectedOptions.iceLevel,
      sugar: selectedOptions.sugarLevel,
      sz: selectedOptions.size,
      // price: selectedOptions.price
    }
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      localStorage.setItem('orders', JSON.stringify([...existingOrders, newDrink]));
  
    // Update the state
    // setDrinkState((prevDrinkState: orderDrink[]) => {
    //   const updatedDrinks = [...prevDrinkState, newDrink];
      
    //   // Update local storage
      
  
    //   return updatedDrinks;
    // });
  }

  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  useEffect(() => {
      if (open && currentModal == 1) {
        fetch('http://18.191.166.59:5000/ingredients') // Replace with the actual API endpoint URL
          .then((response) => {
            if (!response.ok) {
              alert("did not pass");
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then((data) => {
            // Process the data received from the API and store it in the state
            
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
  
  const addTopping = (price: number) => {
    setTotalPrice(totalPrice + price)
  }

  const removeTopping = (price: number) => {
    if (totalPrice >= price){
      setTotalPrice(totalPrice - price)
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
      setTotalPrice(0);
    }
  }

  const handleIce = (ice: number) => {
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      iceLevel: ice
    }))

    setSetlectedIce(ice);
  }

  const handleSugar = (sugar: number) => {
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      sugarLevel: sugar
    }))

    setSelectedSugar(sugar);
  }

  const handleSize = (newSize: number) => {
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      size: newSize
    }))

    setSelectedSize(newSize);
  }

const getIceButtonStyle = (iceLevel: number) => {
  return selectedIce === iceLevel ? "bg-rose-700" : "bg-white";
}

const getSugarButtonStyle = (sugarLevel: number) => {
  return selectedSugar === sugarLevel ? "bg-rose-700" : "bg-white";
}

const getSizeButtonStyle = (size: number) => {
  return selectedSize === size ? "bg-rose-700" : "bg-white";
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
        <button className={`${getSizeButtonStyle(0)} rounded-lg w-1/5 p-2`}onClick={() => (handleSize(0))}>Normal</button>
        <button className={`${getSizeButtonStyle(1)} rounded-lg w-1/5 p-2`} onClick={() => (handleSize(1))}>Large</button>
      </div>

      {/* ice and sugar divs */}
      <div className="flex-row flex h-1/5">
      <div className=" w-1/2 left-0 justify-evenly flex">
        <button className={`${getIceButtonStyle(0)} rounded-lg w-1/5 p-2`} onClick={() => (handleIce(0))}>No Ice</button>
        <button className={`${getIceButtonStyle(1)} rounded-lg w-1/5 p-2`} onClick={() => (handleIce(1))}>Less Ice</button>
        <button className={`${getIceButtonStyle(2)} rounded-lg w-1/5 p-2`} onClick={() => (handleIce(2))}>More Ice</button>
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
      <button onClick={() => {setCurrentModal(0); onClose(); setSetlectedIce(0); setSelectedSize(0); setSelectedSugar(0)}} className="border-white border-2 rounded-md w-1/4 bg-rose-700 hover:bg-white">Exit</button>
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
            addTopping={addTopping}
            removeTopping={removeTopping}
        />
      ))}
        
      </div>
     

      <div className="flex justify-evenly  ">
      <button  onClick={handleBack} className="border-white border-2 rounded-md w-1/4 bg-rose-700 hover:bg-white">Back</button>
        
      <button onClick={() => {setCurrentModal(0); onClose(); setSetlectedIce(0); setSelectedSize(0); setSelectedSugar(0)}} className="border-white border-2 rounded-md w-1/4 bg-rose-700 hover:bg-white">Exit</button>
      <button  onClick={() => {handleStateUpdate(); onClose(); handleBack()}} className="border-white border-2 rounded-md w-1/4 bg-rose-700 hover:bg-white">Add Drink</button>
      </div>
      <div className="w-full place-items-center flex justify-center">
        <div className="border-white border-2 rounded-md w-1/3 text-xl bg-rose-700">
            $: {totalPrice}
        </div>
      </div>
      
      
    </div>
    </>
    )
  ];

  if (!open) return null
  return modals[currentModal]
}
