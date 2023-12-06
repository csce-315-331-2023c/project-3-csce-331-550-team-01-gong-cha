"use client"

import React, { useState, useEffect, useCallback } from 'react'
import DrinkIngredient from '../TabelItems/DrinkIngredient/DrinkIngredient'
import './styles.css'

interface ModalProps {
  open: boolean;
  onClose: () => void;
  drinkName: string;
  lgDrinkPrice: number;
  nmDrinkPrice: number;
}

export default function AddIngredients({open, onClose, drinkName, lgDrinkPrice, nmDrinkPrice}: ModalProps) {
  const [DrinkIngredients, setDrinkIngredients] = useState<number[]>([]);

  const [catagory, setCatagory] = useState<number>();

  const [ButtonStyles, setButtonStyles] = useState<string[]>(['bg-rose-700 text-slate-200', 'text-rose-700 bg-slate-200', 'text-rose-700 bg-slate-200', 'text-rose-700 bg-slate-200', 'text-rose-700 bg-slate-200', 'text-rose-700 bg-slate-200', 'text-rose-700 bg-slate-200', 'text-rose-700 bg-slate-200']);

  function setButtons(num: number){
    ButtonStyles.fill('text-rose-700 bg-slate-200');
    ButtonStyles[num] = 'text-slate-200 bg-rose-700';
  }

  function addIngredient(pk: number){
    DrinkIngredients.push(pk);
  }

  function removeIngredient(pk: number){
    const idx = DrinkIngredients.indexOf(pk);
    delete DrinkIngredients[idx];
  }

  interface Ingredient {
    id: number;
    name: string;
  }
  
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  const [newMenuDrink, setNewMenuDrink] = useState();
  const [created, setCreated] = useState(false);

  function createMenuDrink(nameI: string, normP: number, lgP: number){
    alert(`${nameI} ${normP} ${lgP} ${catagory}`);
    const lgTemp = lgP * 0.8;
    const nTemp = normP * 0.8;
    fetch('http://18.191.166.59:5000/create-menu-drink', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({name: nameI, normalCost: nTemp, largeCost: lgTemp, normConsumerPrice: normP, lgConsumerPrice: lgP, categoryID: catagory, isOffered: true}),
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      setNewMenuDrink(data['id']);
    })
  }

  const addToppings = useCallback((): void => {
    var idx = 0;
    for(idx; idx < DrinkIngredients.length; idx++){
      if(DrinkIngredients[idx]){
        fetch('http://18.191.166.59:5000/create-menu-drink-ingredient', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ menuDrinkId: newMenuDrink, ingredientId: DrinkIngredients[idx] }),
        })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
      }
    }
    onClose();
  }, [onClose, DrinkIngredients, newMenuDrink]);

  useEffect(() => {
    addToppings();
  }, [newMenuDrink, addToppings]);




  useEffect(() => {
      if (open) {
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
            }));
            setIngredients(ingredientData);
          })
          .catch((error) => {
            console.error('There was a problem with the fetch operation:', error);
          });
      }
    }, [open]);

    if (!open) return null;

    return(
        <div className='Overlay_Styles'>
            <div className='Modal_Styles bg-slate-200 flex items-center justify-start border-8 border-rose-700 rounded-3xl'>
                <div className='font-semibold text-rose-700 text-4xl mb-4 -mt-8'>Select Ingredients</div>
                <div className='list border-rose-700 border-4 rounded-md w-full flex justify-center'>
                    <div className="innerList flex-col justify-evenly" style={{overflowY: 'auto' }}>
                        {ingredients.map((ingredient, index) => (
                            <DrinkIngredient
                                key={index}
                                toppingName={ingredient.name}
                                toppingID={ingredient.id}
                                addTopping={addIngredient}
                                removeTopping={removeIngredient}
                            />
                        ))}
                    </div>
                </div>
                <div className='font-semibold text-rose-700 text-4xl mb-4 mt-2'>Select Catagory</div>
                <div className='buttonRow flex w-full justify-evenly mb-4'>
                    <button className={`${ButtonStyles[0]} button1 text-2xl font-semibold rounded-xl border-4 border-rose-700`} onClick={() => {setButtons(0), setCatagory(3)}}>Creative Mix</button>
                    <button className={`${ButtonStyles[1]} button1 text-2xl font-semibold rounded-xl border-4 border-rose-700`} onClick={() => {setButtons(1), setCatagory(4)}}>Brewed Tea</button>
                    <button className={`${ButtonStyles[2]} button1 text-2xl font-semibold rounded-xl border-4 border-rose-700`} onClick={() => {setButtons(2), setCatagory(5)}}>Milk Foam</button>
                </div>
                <div className='buttonRow flex w-full justify-evenly'>
                    <button className={`${ButtonStyles[3]} button2 text-2xl font-semibold rounded-xl border-4 border-rose-700`} onClick={() => {setButtons(3), setCatagory(1)}}>Milk Tea</button>
                    <button className={`${ButtonStyles[4]} button2 text-2xl font-semibold rounded-xl border-4 border-rose-700`} onClick={() => {setButtons(4), setCatagory(2)}}>Tea Latte</button>
                    <button className={`${ButtonStyles[5]} button2 text-2xl font-semibold rounded-xl border-4 border-rose-700`} onClick={() => {setButtons(5), setCatagory(6)}}>Coffee</button>
                    <button className={`${ButtonStyles[6]} button2 text-2xl font-semibold rounded-xl border-4 border-rose-700`} onClick={() => {setButtons(6), setCatagory(7)}}>Slush</button>
                    <button className={`${ButtonStyles[7]} button2 text-2xl font-semibold rounded-xl border-4 border-rose-700`} onClick={() => {setButtons(7), setCatagory(8)}}>Seasonal</button>
                </div>
                <div className='buttonRow2 flex w-full justify-evenly mt-8'>
                    <button className='bg-rose-700 text-slate-200 text-3xl font-semibold rounded-xl w-2/6' onClick={onClose}>Exit</button>
                    <button className='bg-rose-700 text-slate-200 text-3xl font-semibold rounded-xl w-2/6 h-full' onClick={() => createMenuDrink(drinkName, nmDrinkPrice, lgDrinkPrice)}>Create Drink</button>
                </div>
            </div>
        </div>
  );
}