"use client"

import React, { useState, useEffect, useCallback } from 'react'
import DrinkIngredient from '../TabelItems/DrinkIngredient/DrinkIngredient'
import './styles.css'

interface ModalProps {
  open: boolean;
  onClose: () => void;
  drinkName: string;
  pkDrink: number;
}

export default function EditIngredients({open, onClose, drinkName, pkDrink}: ModalProps) {
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
    added: boolean;
  }
  
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  const [newMenuDrink, setNewMenuDrink] = useState();

  const addIngredients = useCallback((): void => {
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
      }
    }
  }, [DrinkIngredients, newMenuDrink]);

  function removeIngredients(){

  }

  function updateDrinkIngredients(){
    // probably call add and remove ingredient
  }


  useEffect(() => {
      if (open) {
        // fetch the ingredients used for that drink

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
              added: false
            }));
            setIngredients(ingredientData);
          })
          .catch((error) => {
            console.error('There was a problem with the fetch operation:', error);
          });

          // update the added to true for ingredients in the array that are part of the menu drink

      }
    }, [open]);
    
    if (!open) return null;

    return(
        <div className='Overlay_Styles'>
            <div className='Modal_Styles bg-slate-200 flex items-center justify-start border-8 border-rose-700 rounded-3xl'>
                <div className='font-semibold text-rose-700 text-4xl mb-4 -mt-8'>Select Ingredients for:</div>
                <div className='font-semibold text-rose-700 text-4xl mb-4'>{drinkName}</div>
                <div className='list border-rose-700 border-4 rounded-md w-full flex justify-center'>
                    <div className="innerList flex-col justify-evenly" style={{overflowY: 'auto' }}>
                        {ingredients.map((ingredient, index) => (
                            <DrinkIngredient
                                key={index}
                                toppingName={ingredient.name}
                                toppingID={ingredient.id}
                                addTopping={addIngredient}
                                removeTopping={removeIngredient}
                                addedI={ingredient.added}
                            />
                        ))}
                    </div>
                </div>
                <div className='buttonRow2 flex w-full justify-evenly mt-8'>
                    <button className='bg-rose-700 text-slate-200 text-3xl font-semibold rounded-xl w-2/6' onClick={onClose}>Exit</button>
                    <button className='bg-rose-700 text-slate-200 text-3xl font-semibold rounded-xl w-2/6 h-full' onClick={() => {updateDrinkIngredients(), addIngredients(), removeIngredients(), onClose()}}>Update</button>
                </div>
            </div>
        </div>
  );
}