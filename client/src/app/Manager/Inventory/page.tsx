'use client'
import React, { useState, useEffect } from 'react'
import '../styles.css'
import Ingredient from '../../Components/TabelItems/Ingredient/Ingredient'
import MenuItem from '../../Components/TabelItems/MenuDrink/MenuDrink'

export default function Dashboard() {

  function goBack(){
    window.location.href = "../Manager";
  }

  interface IngredientItem {
    name: string;
    CurrentStock: string;
    IdealStock: string;
    AmountUsed: string;
    ConsumerPrice: string;
  }

  interface MenuDrink {
    name: string;
    priceNormal: string;
    priceLarge: string;
  }

  const [IngredientItems, setIngredientItems] = useState<IngredientItem[]>([]);
  const [menuDrinkItems, setmenuDrinkItems] = useState<MenuDrink[]>([]);

  function getIngredients(){
    fetch(`http://18.191.166.59:5000/ingredients`) // Replace with the actual API endpoint URL
        .then((response) => {
            if (!response.ok) {
            alert("did not pass");
            throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            // Process the data received from the API and store it in the state
            
            const ingredientData: IngredientItem[] = data.map((item: any) => ({
                name: item.ingredient_name,
                CurrentStock: item.current_amount,
                IdealStock: item.ideal_amount,
                AmountUsed: item.amount_used,
                ConsumerPrice: item.consumer_price,
            }));
            setIngredientItems(ingredientData);
        })
  } 

  function getMenuDrinks(){
    fetch(`http://18.191.166.59:5000/menu-drink`) // Replace with the actual API endpoint URL
        .then((response) => {
            if (!response.ok) {
            alert("did not pass");
            throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            // Process the data received from the API and store it in the state
            
            const menuDrinkData: MenuDrink[] = data.map((item: any) => ({
                name: item.name,
                priceNormal: item.normal_cost,
                priceLarge: item.large_cost,
            }));
            setmenuDrinkItems(menuDrinkData);
        })
  }

  useEffect(() => {getMenuDrinks(); getIngredients();}, []);

  return (
    <main className="flex-col w-screen h-screen bg-slate-400">
      <div className='backContainter'>
        <button className='h-full flex items-center' onClick={goBack}>
            <svg className='ml-4' xmlns="http://www.w3.org/2000/svg" height="5em" viewBox="0 0 448 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>
            <div className='ml-8 text-4xl'>Manager Page</div>
        </button>
      </div>
      <div className='mainContainer w-full flex items-top justify-center'>
          <div className='flex-col w-full bg-slate-800 mx-6'>
          <div className='flex align-center items-center justify-center mb-4 mt-1'>
            <div className='text-6xl font-bold text-cyan-400'>Ingredients</div>
          </div>
          <div className='bg-cyan-300 font-bold w-full flex justify-start items-center border-white border-2 h-14'>
            <div className='name flex justify-center text-center'>
                Ingredient Name
            </div>
            <div className="currentStock flex justify-center text-center">
                Current Stock
            </div>
            <div className="idealStock flex justify-center text-center">
                Ideal Stock
            </div>
            <div className="amountUsed flex justify-center text-center">
                Amount Used
            </div>
            <div className="consumerPrice flex justify-center text-center">
                Price
            </div>
            <div className='button flex justify-center text-center'>
                Update
            </div>
          </div>
          <div className="flex-col justify-evenly border-white border-2 rounded-md h-4/6 w-full overflow-auto">
            {IngredientItems.map((ingredientItem, index) => (
                <Ingredient
                    key={index}
                    name={ingredientItem.name}
                    CurrentStock={ingredientItem.CurrentStock}
                    IdealStock={ingredientItem.IdealStock}
                    AmountUsed={ingredientItem.AmountUsed}
                    ConsumerPrice={ingredientItem.ConsumerPrice}
                />
            ))}
            </div>
            <div className='flex align-center items-center justify-center h-1/6'>
              <button className='w-3/6 h-4/6 bg-cyan-400'>Add Ingredient</button>
            </div>
          </div>
          <div className='flex-col w-full bg-slate-600 mx-6'>
            <div className='flex align-center items-center justify-center mb-4 mt-1'>
              <div className='text-6xl font-bold text-cyan-400'>Drinks</div>
            </div>
            <div className='bg-cyan-300 font-bold w-full flex justify-start items-center border-white border-2 h-14'>
              <div className='w-2/5 flex justify-center text-center'>
                  Drink Name
              </div>
              <div className="w-1/5 flex justify-center text-center">
                  Price Normal
              </div>
              <div className="w-1/5 flex justify-center text-center">
                  Price Large
              </div>
              <div className='w-1/5 flex justify-center text-center'>
                  Update
              </div>
            </div>
            <div className="flex-col justify-evenly border-white border-2 rounded-md h-4/6 w-full overflow-auto">
            {menuDrinkItems.map((menuDrinkItem, index) => (
                <MenuItem
                    key={index}
                    name={menuDrinkItem.name}
                    priceNormal={menuDrinkItem.priceNormal}
                    priceLarge={menuDrinkItem.priceLarge}
                />
            ))}
            </div>
            <div className='flex align-center items-center justify-center h-1/6'>
              <button className='w-3/6 h-4/6 bg-cyan-400'>Add Drink</button>
            </div>
          </div>
      </div>
    </main>
  );
}