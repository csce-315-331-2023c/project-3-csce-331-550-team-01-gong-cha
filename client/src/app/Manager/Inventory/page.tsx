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
    pk: number;
    name: string;
    CurrentStock: string;
    IdealStock: string;
    AmountUsed: string;
    ConsumerPrice: string;
  }

  interface MenuDrink {
    pk: number;
    name: string;
    priceNormal: string;
    priceLarge: string;
  }

  const [IngredientItems, setIngredientItems] = useState<IngredientItem[]>([]);
  const [menuDrinkItems, setmenuDrinkItems] = useState<MenuDrink[]>([]);

  const [Iname, setIName] = useState('');
  const [currentStock, setCurrentStock] = useState('');
  const [idealStock, setIdealStock] = useState('');
  const [amountUsed, setAmountUsed] = useState('');
  const [price, setPrice] = useState('');

  const [drinkName, setDrinkName] = useState('');
  const [largePrice, setLargePrice] = useState('');
  const [normalPrice, setNormalPrice] = useState('');

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
                pk: item.id,
                name: item.ingredient_name,
                CurrentStock: item.current_amount,
                IdealStock: item.ideal_amount,
                AmountUsed: item.amount_used,
                ConsumerPrice: item.consumer_price,
            }));
            setIngredientItems(ingredientData);
        })
  } 

  function updateStock(){
    fetch('http://18.191.166.59:5000/manager-update-ingredient', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ingredientID: 1, updateAmount: -100}),
    })
  }

  function createIngredient(nameI: string, curA: string, idealA: string, consumP: string, amountU: string){
    fetch('http://18.191.166.59:5000/create-ingredient', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({name: nameI, currentAmount: curA, idealAmount: idealA, restockPrice: 0, consumerPrice: consumP, amountUsed: amountU}),
    })
    .then(() => {
      setIName("");
      setCurrentStock("");
      setIdealStock("");
      setAmountUsed("");
      setPrice("");
      getIngredients();
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
                pk: item.id,
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
                    pk={ingredientItem.pk}
                    name={ingredientItem.name}
                    CurrentStock={ingredientItem.CurrentStock}
                    IdealStock={ingredientItem.IdealStock}
                    AmountUsed={ingredientItem.AmountUsed}
                    ConsumerPrice={ingredientItem.ConsumerPrice}
                />
            ))}
            </div>
            <div className='flex align-center items-center justify-center h-1/6 w-full'>
              <input className='name h-2/5 mx-2 text-center' placeholder='Name' type='Iname' id='IName' value={Iname} onChange={(e) => setIName(e.target.value)}/>
              <input className='currentStock h-2/5 mr-2 text-center' placeholder='Current' type='currentStock' id='currentStock' value={currentStock} onChange={(e) => setCurrentStock(e.target.value)}/>
              <input  className='idealStock h-2/5 mr-2 text-center' placeholder='Ideal' type='idealStock' id='idealStock' value={idealStock} onChange={(e) => setIdealStock(e.target.value)}/>
              <input  className='amountUsed h-2/5 mr-2 text-center'  placeholder='Used' type='amountUsed' id='amountUsed' value={amountUsed} onChange={(e) => setAmountUsed(e.target.value)}/>
              <input  className='consumerPrice h-2/5 mr-2 text-center' placeholder='Price' type='price' id='price' value={price} onChange={(e) => setPrice(e.target.value)}/>
              <button className='button h-2/5 bg-cyan-400 mr-2 text-center' onClick={() => createIngredient(Iname, currentStock, idealStock, price, amountUsed)}>Create Ingredient</button>
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
                    pk={menuDrinkItem.pk}
                    name={menuDrinkItem.name}
                    priceNormal={menuDrinkItem.priceNormal}
                    priceLarge={menuDrinkItem.priceLarge}
                />
            ))}
            </div>
            <div className='flex align-center items-center justify-center h-1/6'>
              <input className='w-2/5 h-2/5 mx-2 text-center' placeholder='Name' type='drinkName' id='drinkName' value={drinkName} onChange={(e) => setDrinkName(e.target.value)} />
              <input className='w-1/5 h-2/5 mr-2 text-center' placeholder='Normal Price' type='normalPrice' id='normalPrice' value={normalPrice} onChange={(e) => setNormalPrice(e.target.value)} />
              <input className='w-1/5 h-2/5 mr-2 text-center' placeholder='Large Price' type='largePrice' id='largePrice' value={largePrice} onChange={(e) => setLargePrice(e.target.value)} />
              <button className='w-1/5 h-2/5 bg-cyan-400 mr-2'>Create Drink</button>
            </div> 
          </div>
      </div>
    </main>
  );
}