'use client'
import React, { useState, useEffect } from 'react'
import './styles.css'
import Ingredient from '../Components/TabelItems/Ingredient/Ingredient'
import MenuItem from '../Components/TabelItems/MenuDrink/MenuDrink'
import ReportsModal from '../Components/ReportModal/ReportModal';
import ReportModalWithDate from '../Components/ReportModalWithDate/ReportModalWithDate';
import { useSession, signIn, signOut } from 'next-auth/react'
import AddIngredients from '../Components/AddIngredients/AddIngredients'
import ExcessItems from '../Components/TabelItems/excessItens/excessItems'
import EditIngredients from '../Components/EditIngredients/EditIngredients'
import { getCookie, hasCookie, setCookie } from 'cookies-next';

export default function Dashboard() {

  const [acess, setAcess] = useState(false);
  const [first, setFirst] = useState(false);

  const [addIngredintOpen, setAddIngredintOpen] = useState(false);
  const [editIngredientOpen, setEditIngredientOpen] = useState(false);
  const [editPk, setEditPk] = useState(0);
  const [editName, setEditName] = useState('');

  const { data: session } = useSession();

  function goBack(){
    signOut({ callbackUrl: 'http://localhost:3000'});
  }

  interface IngredientItem {
    pk: number;
    name: string;
    CurrentStock: string;
    IdealStock: string;
    AmountUsed: string;
    ConsumerPrice: string;
    isIngredient: boolean;
  }

  interface MenuDrink {
    pk: number;
    name: string;
    priceNormal: string;
    priceLarge: string;
    category: string;
    isOffered: boolean;
  }

  const [IngredientItems, setIngredientItems] = useState<IngredientItem[]>([]);
  const [menuDrinkItems, setmenuDrinkItems] = useState<MenuDrink[]>([]);

  const [Iname, setIName] = useState('');
  const [currentStock, setCurrentStock] = useState('');
  const [idealStock, setIdealStock] = useState('');
  const [amountUsed, setAmountUsed] = useState('');
  const [price, setPrice] = useState('');
  const [isIngredient, setIsIngredient] = useState();

  const [drinkName, setDrinkName] = useState('');
  const [largePrice, setLargePrice] = useState('');
  const [normalPrice, setNormalPrice] = useState('');

  const [restockReportOpen, setRestockReportOpen] = useState(false)
  const [salesReportOpen, setSalesReportOpen] = useState(false)
  const [soldTogetherReportOpen, setSoldTogetherReportOpen] = useState(false)
  const [excessReportOpen, setExcessReportOpen] = useState(false)
  const [usageReportOpen, setUsageReportOpen] = useState(false)

  function getIngredients(){
    fetch(`http://18.223.2.65:5000/ingredients`) // Replace with the actual API endpoint URL
        .then((response) => {
            if (!response.ok) {
            // alert("did not pass");
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
                isIngredient: item.is_ingredient,
            }));
            setIngredientItems(ingredientData);
        })
  }

  function createIngredient(nameI: string, curA: string, idealA: string, consumP: string, isIng: boolean){
    fetch('http://18.223.2.65:5000/create-ingredient', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({name: nameI, currentAmount: curA, idealAmount: idealA, consumerPrice: consumP, isIngredient: isIng}),
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
    fetch(`http://18.223.2.65:5000/menu-drink`) // Replace with the actual API endpoint URL
        .then((response) => {
            if (!response.ok) {
            // alert("did not pass");
            throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            // Process the data received from the API and store it in the state
            
            const menuDrinkData: MenuDrink[] = data.map((item: any) => ({
                pk: item.id,
                name: item.name,
                priceNormal: item.norm_consumer_price,
                priceLarge: item.lg_consumer_price,
                category: item.category_id,
                isOffered: item.is_offered
            }));
            setmenuDrinkItems(menuDrinkData);
        })
  }

  function clearFeilds(){
    setDrinkName("");
    setNormalPrice("");
    setLargePrice("");
  }

  const [loaded, setLoaded] = useState(false);

  function getMenuInital(loaded : boolean){
    if(!loaded){
      getMenuDrinks();
      getIngredients();
      setLoaded(true);
    }
  }

  function getEmail(email: string) {
      setFirst(true);
      fetch(`http://18.223.2.65:5000/get-email/${email}`)
      .then((response) => {
        if (!response.ok) {
        // alert("did not pass");
        throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log(parseInt(data.exist));
        setAcess(parseInt(data.exist) >= 2);
      })
  }

  useEffect(() => {
    if (!first && session && session.user && session.user.email) {
      setFirst(true);
      getEmail(session.user.email); // Now guaranteed to be a string
    }
  }, [session]);

  return (
    <main className="flex-col w-screen h-screen bg-slate-200">
      {acess ?
      <div>
      <div className='backContainter flex items-center'>
        <button className='h-full flex items-center' onClick={goBack}>
          <svg className='ml-4 fill-rose-700' xmlns="http://www.w3.org/2000/svg" height="5em" viewBox="0 0 448 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>
          <div className='ml-4 text-5xl text-rose-700 font-semibold'>Home</div>
        </button>
        <div className='flex items-center justify-evenly w-full h-full'>
          <button onClick={() => setRestockReportOpen(true)} className='bg-rose-700 h-4/6 w-1/6 rounded-2xl text-slate-200 text-3xl font-semibold'>Restock Report</button>
          <button onClick={() => setSalesReportOpen(true)} className='bg-rose-700 h-4/6 w-1/6 rounded-2xl text-slate-200 text-3xl font-semibold'>Sales Report</button>
          <button onClick={() => setUsageReportOpen(true)} className='bg-rose-700 h-4/6 w-1/6 rounded-2xl text-slate-200 text-3xl font-semibold'>Usage Report</button>
          <button onClick={() => setSoldTogetherReportOpen(true)} className='bg-rose-700 h-4/6 w-1/6 rounded-2xl text-slate-200 text-3xl font-semibold'>Sold Together</button>
          <button onClick={() => setExcessReportOpen(true)} className='bg-rose-700 h-4/6 w-1/6 rounded-2xl text-slate-200 text-3xl font-semibold'>Excess Report</button>
        </div>
        <ReportsModal open={restockReportOpen} onClose={() => setRestockReportOpen(false)}>Restock Report</ReportsModal>
        <ReportModalWithDate open={salesReportOpen} onClose={() => setSalesReportOpen(false)} whichReport={0}>Sales Report</ReportModalWithDate>
        <ReportModalWithDate open={soldTogetherReportOpen} onClose={() => setSoldTogetherReportOpen(false)} whichReport={1}>Sold Together Report</ReportModalWithDate>
        <ReportModalWithDate open={excessReportOpen} onClose={() => setExcessReportOpen(false)} whichReport={2}>Excess Report</ReportModalWithDate>
        <ReportModalWithDate open={usageReportOpen} onClose={() => setUsageReportOpen(false)} whichReport={3}>Usage Report</ReportModalWithDate>
        <EditIngredients open={editIngredientOpen} onClose={() => setEditIngredientOpen(false)} drinkName={editName} pkDrink={editPk}></EditIngredients>
      </div>
      <div className='mainContainer w-full flex items-top justify-center'>
        <div className='flex-col align-center items-center justify-center w-full bg-slate-200 rounded-3xl border-rose-700 border-8 mx-6'>
          <div className='flex align-center items-center justify-center mb-4 mt-1'>
            <div className='text-6xl font-bold text-rose-700'>Ingredients</div>
          </div>
          <div className='flex items-center justify-center'>
            <div className='ingredientHeader bg-rose-700 font-bold flex justify-start items-center h-14 text-slate-200 rounded-xl'>
              <div className='name ml-4 flex justify-center text-center'>
                  Ingredient Name
              </div>
              <div className="flex items-center w-full ml-10 justify-evenly">
              <div className="currentStock flex justify-center text-center">
                  Current Stock
              </div>
              <div className="idealStock flex justify-center text-center">
                  Ideal Stock
              </div>
              <div className="amountUsed flex justify-center text-center">
                  Price
              </div>
              </div>
              <div className="consumerPrice flex mr-4 justify-center text-center">
                  Delete
              </div>
              <div className="consumerPrice flex justify-center text-center">
                  Topping
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
                    FConsumerPrice={ingredientItem.ConsumerPrice}
                    isIngre={ingredientItem.isIngredient}
                    reload={() => {getIngredients()}}
                />
              ))}
            </div>
          </div>
          
            <div className='createIng flex align-center items-start justify-center w-full mt-4'>
              <input className='name h-2/5 mx-2 text-center bg-slate-100 rounded-lg border-rose-700 border-2 outline-none text-rose-700' placeholder='Name' type='Iname' id='IName' value={Iname} onChange={(e) => setIName(e.target.value)}/>
              <input className='currentStock h-2/5 mr-2 text-center bg-slate-100 rounded-lg border-rose-700 border-2 outline-none text-rose-700' placeholder='Current' type='currentStock' id='currentStock' value={currentStock} onChange={(e) => setCurrentStock(e.target.value)}/>
              <input  className='idealStock h-2/5 mr-2 text-center bg-slate-100 rounded-lg border-rose-700 border-2 outline-none text-rose-700' placeholder='Ideal' type='idealStock' id='idealStock' value={idealStock} onChange={(e) => setIdealStock(e.target.value)}/>
              <input  className='consumerPrice h-2/5 mr-2 text-center bg-slate-100 rounded-lg border-rose-700 border-2 outline-none text-rose-700' placeholder='Price' type='price' id='price' value={price} onChange={(e) => setPrice(e.target.value)}/>
              <button className='button h-2/5 bg-rose-700 mr-2 text-center text-slate-200 rounded-lg' onClick={() => createIngredient(Iname, currentStock, idealStock, price, false)}>Create Ingredient</button>
            </div>
          </div>
          <div className='flex-col w-full bg-slate-200 rounded-3xl border-rose-700 border-8 mx-6'>
            <div className='flex align-center items-center justify-center mb-4 mt-1'>
              <div className='text-6xl font-bold text-rose-700'>Drinks</div>
            </div>
            <div className='flex items-center justify-center'>
              <div className='ingredientHeader bg-rose-700 font-bold w-full flex justify-start items-center text-slate-200 rounded-xl h-14'>
                <div className='name flex ml-20 justify-center text-center'>
                    Drink Name
                </div>
                <div className="flex items-center prices w-3/4 space-x-10 w-full justify-evenly">
                <div className="normPrice flex justify-center text-center">
                    Price Normal
                </div>
                <div className="lgPrice flex justify-center text-center">
                    Price Large
                </div>
                </div>
                
                <div className="flex items-center w-full space-x-5 justify-evenly">
                <div className="ingredient flex justify-center text-center">
                    Edit
                </div>
                <div className="ingredient flex justify-center text-center">
                    Delete
                </div>
                <div className='button flex justify-center text-center'>
                    Update
                </div>
                </div>
                
              </div>
            </div>
            <div className='ingredientTableOuter flex justify-center mt-4'>
              <div className="ingredientTabel flex-col justify-evenly border-rose-700 border-4 rounded-xl h-full w-full overflow-auto">
              {menuDrinkItems.filter((drink) => drink.isOffered).map((menuDrinkItem, index) => (
                  <MenuItem
                      key={index}
                      pk={menuDrinkItem.pk}
                      name={menuDrinkItem.name}
                      priceNormal={menuDrinkItem.priceNormal}
                      priceLarge={menuDrinkItem.priceLarge}
                      category={menuDrinkItem.category}
                      reload={getMenuDrinks}
                      openEditor={() => setEditIngredientOpen(true)}
                      setName={setEditName}
                      setPk={setEditPk}
                  />
              ))}
              </div>
            </div>
            <div className='createIng flex align-center items-start justify-center h-1/6 mt-4'>
              <input className='w-2/5 h-2/5 mx-2 text-center border-rose-700 border-2 bg-slate-100 rounded-lg outline-none text-rose-700' placeholder='Name' type='drinkName' id='drinkName' value={drinkName} onChange={(e) => setDrinkName(e.target.value)} />
              <input className='w-1/5 h-2/5 mr-2 text-center border-rose-700 border-2 bg-slate-100 rounded-lg outline-none text-rose-700' placeholder='Normal Price' type='normalPrice' id='normalPrice' value={normalPrice} onChange={(e) => setNormalPrice(e.target.value)} />
              <input className='w-1/5 h-2/5 mr-2 text-center border-rose-700 border-2 bg-slate-100 rounded-lg outline-none text-rose-700' placeholder='Large Price' type='largePrice' id='largePrice' value={largePrice} onChange={(e) => setLargePrice(e.target.value)} />
              <button className='w-1/5 h-2/5 bg-rose-700 text-slate-200 rounded-lg mr-2' onClick={() => {setAddIngredintOpen(true)}}>Create Drink</button>
            </div> 
            <AddIngredients open={addIngredintOpen} onClose={() => {setAddIngredintOpen(false), getMenuDrinks()}} clearFeilds={() => clearFeilds()} drinkName={drinkName} lgDrinkPrice={parseFloat(largePrice)} nmDrinkPrice={parseFloat(normalPrice)}></AddIngredients>
          </div>
      </div>
      </div>
      : 
      <div>You need to login</div>
      }
    </main>
  );
}