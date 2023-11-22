'use client'
import React, { useState, useEffect } from 'react'
import './styles.css'
import Ingredient from '../Components/TabelItems/Ingredient/Ingredient'
import MenuItem from '../Components/TabelItems/MenuDrink/MenuDrink'
import ReportsModal from '../Components/ReportModal/ReportModal';
import ReportModalWithDate from '../Components/ReportModalWithDate/ReportModalWithDate';
import { useSession, signIn, signOut } from 'next-auth/react'

export default function Dashboard() {

  const { data: session } = useSession();

  function goBack(){
    signOut({ callbackUrl: 'http://localhost:3000' });
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
    category: string;
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

  const [restockReportOpen, setRestockReportOpen] = useState(false)
  const [salesReportOpen, setSalesReportOpen] = useState(false)
  const [soldTogetherReportOpen, setSoldTogetherReportOpen] = useState(false)
  const [excessReportOpen, setExcessReportOpen] = useState(false)

  function getIngredients(){
    // fetch(`http://18.191.166.59:5000/ingredients`) // Replace with the actual API endpoint URL
    //     .then((response) => {
    //         if (!response.ok) {
    //         alert("did not pass");
    //         throw new Error('Network response was not ok');
    //         }
    //         return response.json();
    //     })
    //     .then((data) => {
    //         // Process the data received from the API and store it in the state
            
    //         const ingredientData: IngredientItem[] = data.map((item: any) => ({
    //             pk: item.id,
    //             name: item.ingredient_name,
    //             CurrentStock: item.current_amount,
    //             IdealStock: item.ideal_amount,
    //             AmountUsed: item.amount_used,
    //             ConsumerPrice: item.consumer_price,
    //         }));
    //         setIngredientItems(ingredientData);
    //     })
    IngredientItems.push({pk: 1, name: 'test', CurrentStock: '100', IdealStock: '200', AmountUsed: '0.25', ConsumerPrice: '0.5'})
    IngredientItems.push({pk: 1, name: 'test', CurrentStock: '100', IdealStock: '200', AmountUsed: '0.25', ConsumerPrice: '0.5'})
    IngredientItems.push({pk: 1, name: 'test', CurrentStock: '100', IdealStock: '200', AmountUsed: '0.25', ConsumerPrice: '0.5'})
    IngredientItems.push({pk: 1, name: 'test', CurrentStock: '100', IdealStock: '200', AmountUsed: '0.25', ConsumerPrice: '0.5'})
    IngredientItems.push({pk: 1, name: 'test', CurrentStock: '100', IdealStock: '200', AmountUsed: '0.25', ConsumerPrice: '0.5'})
    IngredientItems.push({pk: 1, name: 'test', CurrentStock: '100', IdealStock: '200', AmountUsed: '0.25', ConsumerPrice: '0.5'})
    IngredientItems.push({pk: 1, name: 'test', CurrentStock: '100', IdealStock: '200', AmountUsed: '0.25', ConsumerPrice: '0.5'})
    IngredientItems.push({pk: 1, name: 'test', CurrentStock: '100', IdealStock: '200', AmountUsed: '0.25', ConsumerPrice: '0.5'})
    IngredientItems.push({pk: 1, name: 'test', CurrentStock: '100', IdealStock: '200', AmountUsed: '0.25', ConsumerPrice: '0.5'})
    IngredientItems.push({pk: 1, name: 'test', CurrentStock: '100', IdealStock: '200', AmountUsed: '0.25', ConsumerPrice: '0.5'})
    IngredientItems.push({pk: 1, name: 'test', CurrentStock: '100', IdealStock: '200', AmountUsed: '0.25', ConsumerPrice: '0.5'})
    IngredientItems.push({pk: 1, name: 'test', CurrentStock: '100', IdealStock: '200', AmountUsed: '0.25', ConsumerPrice: '0.5'})
    IngredientItems.push({pk: 1, name: 'test', CurrentStock: '100', IdealStock: '200', AmountUsed: '0.25', ConsumerPrice: '0.5'})
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
    // fetch(`http://18.191.166.59:5000/menu-drink`) // Replace with the actual API endpoint URL
    //     .then((response) => {
    //         if (!response.ok) {
    //         alert("did not pass");
    //         throw new Error('Network response was not ok');
    //         }
    //         return response.json();
    //     })
    //     .then((data) => {
    //         // Process the data received from the API and store it in the state
            
    //         const menuDrinkData: MenuDrink[] = data.map((item: any) => ({
    //             pk: item.id,
    //             name: item.name,
    //             priceNormal: item.norm_consumer_price,
    //             priceLarge: item.lg_consumer_price,
    //             category: item.category_id,
    //         }));
    //         setmenuDrinkItems(menuDrinkData);
    //     })
        menuDrinkItems.push({pk: 1, name: 'Hello', priceNormal: '10', priceLarge: '15', category: '1'})
        menuDrinkItems.push({pk: 1, name: 'Hello', priceNormal: '10', priceLarge: '15', category: '1'})
        menuDrinkItems.push({pk: 1, name: 'Hello', priceNormal: '10', priceLarge: '15', category: '1'})
        menuDrinkItems.push({pk: 1, name: 'Hello', priceNormal: '10', priceLarge: '15', category: '1'})
        menuDrinkItems.push({pk: 1, name: 'Hello', priceNormal: '10', priceLarge: '15', category: '1'})
        menuDrinkItems.push({pk: 1, name: 'Hello', priceNormal: '10', priceLarge: '15', category: '1'})
        menuDrinkItems.push({pk: 1, name: 'Hello', priceNormal: '10', priceLarge: '15', category: '1'})
        menuDrinkItems.push({pk: 1, name: 'Hello', priceNormal: '10', priceLarge: '15', category: '1'})
  }

  const [loaded, setLoaded] = useState(false);

  function getMenuInital(loaded : boolean){
    if(!loaded){
      getMenuDrinks();
      getIngredients();
      setLoaded(true);
    }
  }

  useEffect(() => {getMenuInital(loaded)});

  return (
    <main className="flex-col w-screen h-screen bg-slate-200">
      {!session  ?
      <div>
      <div className='backContainter flex items-center'>
        <button className='h-full flex items-center' onClick={goBack}>
          <svg className='ml-4 fill-rose-700' xmlns="http://www.w3.org/2000/svg" height="5em" viewBox="0 0 448 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>
          <div className='ml-4 text-5xl text-rose-700 font-semibold'>Home</div>
        </button>
        <div className='flex items-center justify-evenly w-full h-full'>
          <button onClick={() => setRestockReportOpen(true)} className='bg-rose-700 h-4/6 w-1/5 rounded-2xl text-slate-200 text-3xl font-semibold'>Restock Report</button>
          <button onClick={() => setSalesReportOpen(true)} className='bg-rose-700 h-4/6 w-1/5 rounded-2xl text-slate-200 text-3xl font-semibold'>Sales Report</button>
          <button onClick={() => setSoldTogetherReportOpen(true)} className='bg-rose-700 h-4/6 w-1/5 rounded-2xl text-slate-200 text-3xl font-semibold'>Sold Together</button>
          <button onClick={() => setRestockReportOpen(true)} className='bg-rose-700 h-4/6 w-1/5 rounded-2xl text-slate-200 text-3xl font-semibold'>Excess Report</button>
        </div>
        <ReportsModal open={restockReportOpen} onClose={() => setRestockReportOpen(false)}>Restock Report</ReportsModal>
        <ReportModalWithDate open={salesReportOpen} onClose={() => setSalesReportOpen(false)} whichReport={0}>Sales Report</ReportModalWithDate>
        <ReportModalWithDate open={soldTogetherReportOpen} onClose={() => setSoldTogetherReportOpen(false)} whichReport={1}>Sold Together Report</ReportModalWithDate>
      </div>
      <div className='mainContainer w-full flex items-top justify-center'>
        <div className='flex-col align-center items-center justify-center w-full bg-slate-200 rounded-3xl border-rose-700 border-8 mx-6'>
          <div className='flex align-center items-center justify-center mb-4 mt-1'>
            <div className='text-6xl font-bold text-rose-700'>Ingredients</div>
          </div>
          <div className='flex items-center justify-center'>
            <div className='ingredientHeader bg-rose-700 font-bold flex justify-start items-center h-14 text-slate-200 rounded-xl'>
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
          </div>
          <div className='ingredientTableOuter flex justify-center mt-4'>
            <div className="ingredientTabel flex-col justify-center items-center border-rose-700 border-4 h-full w-full overflow-auto rounded-xl">
              {IngredientItems.map((ingredientItem, index) => (
                <Ingredient
                    key={index}
                    pk={ingredientItem.pk}
                    FIName={ingredientItem.name}
                    CurrentStock={ingredientItem.CurrentStock}
                    IdealStock={ingredientItem.IdealStock}
                    FAmountUsed={ingredientItem.AmountUsed}
                    FConsumerPrice={ingredientItem.ConsumerPrice}
                    reload={getIngredients}
                />
              ))}
            </div>
          </div>
          
            <div className='createIng flex align-center items-start justify-center w-full mt-4'>
              <input className='name h-2/5 mx-2 text-center bg-slate-100 rounded-lg border-rose-700 border-2' placeholder='Name' type='Iname' id='IName' value={Iname} onChange={(e) => setIName(e.target.value)}/>
              <input className='currentStock h-2/5 mr-2 text-center bg-slate-100 rounded-lg border-rose-700 border-2' placeholder='Current' type='currentStock' id='currentStock' value={currentStock} onChange={(e) => setCurrentStock(e.target.value)}/>
              <input  className='idealStock h-2/5 mr-2 text-center bg-slate-100 rounded-lg border-rose-700 border-2' placeholder='Ideal' type='idealStock' id='idealStock' value={idealStock} onChange={(e) => setIdealStock(e.target.value)}/>
              <input  className='amountUsed h-2/5 mr-2 text-center bg-slate-100 rounded-lg border-rose-700 border-2'  placeholder='Used' type='amountUsed' id='amountUsed' value={amountUsed} onChange={(e) => setAmountUsed(e.target.value)}/>
              <input  className='consumerPrice h-2/5 mr-2 text-center bg-slate-100 rounded-lg border-rose-700 border-2' placeholder='Price' type='price' id='price' value={price} onChange={(e) => setPrice(e.target.value)}/>
              <button className='button h-2/5 bg-rose-700 mr-2 text-center text-slate-200 rounded-lg' onClick={() => createIngredient(Iname, currentStock, idealStock, price, amountUsed)}>Create Ingredient</button>
            </div>
          </div>
          <div className='flex-col w-full bg-slate-200 rounded-3xl border-rose-700 border-8 mx-6'>
            <div className='flex align-center items-center justify-center mb-4 mt-1'>
              <div className='text-6xl font-bold text-rose-700'>Drinks</div>
            </div>
            <div className='flex items-center justify-center'>
              <div className='ingredientHeader bg-rose-700 font-bold w-full flex justify-start items-center text-slate-200 rounded-xl h-14'>
                <div className='name flex justify-center text-center'>
                    Drink Name
                </div>
                <div className="normPrice flex justify-center text-center">
                    Price Normal
                </div>
                <div className="lgPrice flex justify-center text-center">
                    Price Large
                </div>
                <div className="ingredient flex justify-center text-center">
                    In Stock
                </div>
                <div className='button flex justify-center text-center'>
                    Update
                </div>
              </div>
            </div>
            <div className='ingredientTableOuter flex justify-center mt-4'>
              <div className="ingredientTabel flex-col justify-evenly border-rose-700 border-4 rounded-xl h-full w-full overflow-auto">
              {menuDrinkItems.map((menuDrinkItem, index) => (
                  <MenuItem
                      key={index}
                      pk={menuDrinkItem.pk}
                      name={menuDrinkItem.name}
                      priceNormal={menuDrinkItem.priceNormal}
                      priceLarge={menuDrinkItem.priceLarge}
                      category={menuDrinkItem.category}
                      reload={getMenuDrinks}
                  />
              ))}
              </div>
            </div>
            <div className='createIng flex align-center items-start justify-center h-1/6 mt-4'>
              <input className='w-2/5 h-2/5 mx-2 text-center border-rose-700 border-2 bg-slate-100 rounded-lg' placeholder='Name' type='drinkName' id='drinkName' value={drinkName} onChange={(e) => setDrinkName(e.target.value)} />
              <input className='w-1/5 h-2/5 mr-2 text-center border-rose-700 border-2 bg-slate-100 rounded-lg' placeholder='Normal Price' type='normalPrice' id='normalPrice' value={normalPrice} onChange={(e) => setNormalPrice(e.target.value)} />
              <input className='w-1/5 h-2/5 mr-2 text-center border-rose-700 border-2 bg-slate-100 rounded-lg' placeholder='Large Price' type='largePrice' id='largePrice' value={largePrice} onChange={(e) => setLargePrice(e.target.value)} />
              <button className='w-1/5 h-2/5 bg-rose-700 text-slate-200 rounded-lg mr-2'>Create Drink</button>
            </div> 
          </div>
      </div>
      </div>
      : 
      <div>You need to login</div>
      }
    </main>
  );
}