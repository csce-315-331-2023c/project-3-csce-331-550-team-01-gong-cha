"use client"

import React, { useState, useEffect } from 'react'
import MenuItem from '../Topping/Topping'
import Topping from '../Topping/Topping'
import './styles.css'

  
interface ModalProps {
  open: boolean;
  children: React.ReactNode
  onClose: () => void;
}

export default function Modal({ open, children, onClose}: ModalProps) {
  const [currentModal, setCurrentModal] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)
 

  const [selectedOptions, setSelectedOptions] = useState({
    size: 0,
    iceLevel: 0,
    sugarLevel: 0
  });

  interface Ingredient {
    id: number;
    name: string;
    price: number;
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
  


  const handleSize = (size: number) => {
    setSelectedOptions({
      ...selectedOptions,
      size: size,
    })
  }
  const handleIce = (ice: number) => {
    setSelectedOptions({
      ...selectedOptions,
      iceLevel: ice,
    })
  }
  const handleSugar = (sugar: number) => {
    setSelectedOptions({
      ...selectedOptions,
      sugarLevel: sugar,
    })
  }


  
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

  const modals = [
    (
      <>
      <div className="Overlay_Styles"></div>
    <div  className="Modal_Styles bg-slate-400 justify-evenly">
      { children }

      {/* Normal and large div */}
      <div className="flex-row flex justify-evenly h-1/5">
        <button className="bg-cyan-200 rounded-lg w-1/5 ml-4">Normal</button>
        <button className="bg-cyan-200 rounded-lg w-1/5">Large</button>
      </div>

      {/* ice and sugar divs */}
      <div className="flex-row flex h-1/5">
      <div className=" w-1/2 left-0 justify-evenly flex">
        <button className="bg-cyan-200 rounded-lg w-1/5 p-2">No Ice</button>
        <button className="bg-cyan-200 rounded-lg w-1/5 p-2">Less Ice</button>
        <button className="bg-cyan-200 rounded-lg w-1/5 p-2">More Ice</button>
      </div>

      <div className=" w-1/2 left-0 justify-evenly flex">
        <button className="bg-cyan-200 rounded-lg w-1/6 p-2">0% Sugar</button>
        <button className="bg-cyan-200 rounded-lg w-1/6 p-2">30% Sugar</button>
        <button className="bg-cyan-200 rounded-lg w-1/6 p-2">50% Sugar</button>
        <button className="bg-cyan-200 rounded-lg w-1/6 p-2">70% Sugar</button>
        <button className="bg-cyan-200 rounded-lg w-1/6 p-2">100% Sugar</button>
      </div>
      </div>

      <div className="flex justify-evenly">
      <button onClick={() => {setCurrentModal(0); onClose()}} className="border-white border-2 rounded-md w-1/4 bg-teal-300 hover:bg-white">Exit</button>
      <button  onClick={handleNext} className="border-white border-2 rounded-md w-1/4 bg-teal-300 hover:bg-white">Next</button>
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
      <button  onClick={handleBack} className="border-white border-2 rounded-md w-1/4 bg-teal-300 hover:bg-white">Back</button>
        
      <button onClick={() => {setCurrentModal(0); setTotalPrice(0); onClose()}} className="border-white border-2 rounded-md w-1/4 bg-teal-300 hover:bg-white">Exit</button>
      <button  onClick={handleNext} className="border-white border-2 rounded-md w-1/4 bg-teal-300 hover:bg-white">Add Drink</button>
      </div>
      <div className="w-full place-items-center flex justify-center">
        <div className="border-white border-2 rounded-md w-1/3 text-xl bg-teal-300">
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
