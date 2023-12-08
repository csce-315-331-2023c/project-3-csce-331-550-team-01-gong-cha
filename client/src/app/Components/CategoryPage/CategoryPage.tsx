"use client"

import Image, { StaticImageData } from 'next/image'
import MenuItem from '../MenuItem/MenuItem';
import Modal from '../Modal/Modal'
import defualtDrinkImg from '../../../../public/defualtDrinkImg.png'
import { useGeolocated } from 'react-geolocated'
import defualtDrinkImg2 from '/public/DrinkImages/Black Milk Tea.png'
import {DrinkImage} from '../DinkImage/DrinkImage';
import { useState, useEffect} from 'react';
import OrderDrink from '../OrderDrink/OrderDrink';
import ConfirmOrder from '../ConfirmOrder/ConfirmOrder'
import "./styles.css"
import GoogleTranslate from '../../GoogleTranslate/GoogleTranslate';
import seasonalImage from '../../../../public/DrinkImages/seas.png'
import coffeImage from '../../../../public/DrinkImages/53.png';
import beweDImage from '../../../../public/DrinkImages/49.png';
import milkImage from '../../../../public/DrinkImages/30.png'
import creImage from '../../../../public/DrinkImages/18.png'
import foamImage from '../../../../public/DrinkImages/31.png'
import slushImage from '../../../../public/DrinkImages/44.png'
import { useSession, signIn, signOut } from 'next-auth/react'
import OrderModal from '../OrderModal/OrderModal';

// import FullMenu from '../Components/FullMenu/FullMenu'
import { getCookie, hasCookie, setCookie } from 'cookies-next';
import Router from "next/router";
import FullMenu from '../FullMenu/FullMenu';



interface OpenModals {
  [key:string]: boolean;
  
}

type Drink = {
  id: number;
  name: string;
  normal_cost: number;
  large_cost: number;
  norm_consumer_price: number;
  lg_consumer_price: number;
};

type DrinkOrNames = Drink[] | string[];



interface CategoryPageProps {
  categoryDrinks: DrinkOrNames;
  categoryName: string;
  
}
  
export default function CategoryPage({categoryDrinks, categoryName}: CategoryPageProps){

  const { data: session } = useSession();
  const [acess, setAcess] = useState(false);
  const [first, setFirst] = useState(false);

  const [addingToOrder, setAddingToOrder] = useState(false);
  const [openOrder, setOpenOrder] = useState(false);
  const [openOrderEdit, setOrderEdit] = useState(false);

  const isDrinkArray = Array.isArray(categoryDrinks) && categoryDrinks.length > 0 && typeof categoryDrinks[0] === 'object' && 'name' in categoryDrinks[0];
  function goBack(){
    signOut({ callbackUrl: 'http://localhost:3000'});
}
  const [openModals, setOpenModals] = useState<OpenModals>({});
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  const firstPictures: StaticImageData[] = [milkImage, creImage, foamImage, slushImage];
  const secondPictures: StaticImageData[] = [beweDImage, beweDImage, coffeImage, seasonalImage];

  let pictures;

  if (isDrinkArray) {
    // Assuming categoryDrinks is Drink[], and each element has a 'name' property
    pictures = categoryDrinks.map(drink => typeof drink === 'object' ? `../../../../public/DrinkImages/${drink.name}` : `../../../../public/DrinkImages/${drink}`);
} else {
  // Assuming categoryDrinks is string[]
  pictures = categoryDrinks.map((name) => `../../../../public/DrinkImages/${name}`);
}

  const openModal = (category: string) => {
    setOpenModals({...openModals, [category]: true});
  };

  const closeModal = (category: string) => {
    setOpenModals({...openModals, [category]: false});
  };

  const closeConfirmOrder = () => {
    setIsOrderPlaced(false);
  };

  function goToCategory(category: string){
    window.location.href = "Order/Catagories/" + category;
}


const halfLength = Math.ceil(categoryDrinks.length / 2);

const firstHalfCategories = categoryDrinks.slice(0, halfLength);
const secondHalfCategories = categoryDrinks.slice(halfLength);

const firstHalfPictures = pictures.slice(0, halfLength);
const secondHalfPictures = pictures.slice(halfLength);

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
  id: number,
  toppings: Topping[],
  toppingAmounts: number[],
}

const [drinksState, setDrinksState] = useState<orderDrink[]>([]);
const [stateUpdate, setStateUpdate] = useState(false);
const [transButton, setTransButton] = useState('');

    const { coords, isGeolocationAvailable, isGeolocationEnabled } = 
        useGeolocated({positionOptions: {enableHighAccuracy: false,},userDecisionTimeout: 5000,});


        const [suggestionOpen, setSuggestionOpen] = useState(false);
        const [menuOpen, setMenuOpen] = useState(false);
        const [tempVal, setTempVal] = useState(80);
        const [raining, setRaining] = useState(false);
        const [suggested, setSuggested] = useState(false);
    
        function getData(suggested: boolean){
            if(!suggested){
                if(coords && isGeolocationAvailable && isGeolocationEnabled){
                    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coords?.latitude.toFixed(2)}&longitude=${coords?.longitude.toFixed(2)}&current=temperature_2m,is_day,rain,snowfall&temperature_unit=fahrenheit`) // Replace with the actual API endpoint URL
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then((data) => {
                        if(data?.current?.rain === 1){
                            setRaining(true);
                        }
                        setTempVal(parseFloat(data?.current?.temperature_2m));    
                    })
                    .then(() => {
                        setSuggestionOpen(true);
                        setSuggested(true);
                    })
                }
            }
        }
        useEffect(() => {
            getData(suggested)  
            if(!hasCookie('googtrans')){
                setTransButton('普通话');
                setCookie('googtrans',decodeURI('/auto/en'));
            }
            if(getCookie('googtrans') === '/auto/en'){
                setTransButton('普通话');
            }
            else{
                setTransButton('English');
            }
        });

        function changeLang(){
          const googtransCookie = getCookie('googtrans');
  
          if (googtransCookie && decodeURI(googtransCookie) === '/auto/en') {
              setCookie('googtrans', '/auto/zh-CN');
              location.reload();
          }
          else{
              setCookie('googtrans',decodeURI('/auto/en'));
              location.reload();
          }
      }
  
      function getCookie(key: string) {
          var b = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
          return b ? b.pop() : "";
      }

      function getEmail(email: string) {
        setFirst(true);
        fetch(`http://18.191.166.59:5000/get-email/${email}`)
        .then((response) => {
          if (!response.ok) {
          alert("did not pass");
          throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          setAcess(parseInt(data.exist) >= 2);
        })
    }


useEffect(() => {
  const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
  //alert(storedOrders)
  setDrinksState(storedOrders);
  setStateUpdate(false);
}, [stateUpdate])

useEffect(() =>{
  if(!first && session){
    setFirst(true);
    getEmail(session?.user.email);
  }
}, [session])

    return(
      
      <div className='w-full'>
        {isOrderPlaced && (
        <ConfirmOrder 
            drinks={drinksState}
            onClose={() => closeConfirmOrder()}
        />
    )}
    <div className="w-full flex">
    <div className="w-full">
      <div className='flex justify-start align-center items-center font-semibold text-rose-700 text-2xl space-x-48'>
                    {!isDrinkArray ? 
                    <div className='flex justify-evenly w-full items-center'>
                    <div className='homButton'>
                        <button className='backContainter flex items-center w-full' onClick={goBack}>
                            <svg className='fill-rose-700 ml-4' xmlns="http://www.w3.org/2000/svg" height="3em" viewBox="0 0 448 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>
                            <div className='ml-8 text-5xl text-rose-700 font-semibold'>Home Page</div>
                        </button>
                    </div>
                    {acess ? 
                      <div className='topCon flex justify-evenly'>
                        <div className='bg-rose-700 w-3/5 h-16 text-slate-200 flex items-center justify-center text-4xl font-semibold notranslate rounded-xl'>  
                          <button onClick={() => setOpenOrder(true)}>View Orders</button>
                        </div>
                      </div>
                    :
                    <div className='topCon flex justify-evenly'>
                        <div className='bg-rose-700 w-2/5 h-16 text-slate-200 flex items-center justify-center text-4xl font-semibold notranslate rounded-xl'>  
                            <button onClick={() => setMenuOpen(true)}>Full Menu</button>
                        </div>
                        <div className='bg-rose-700 w-2/5 h-16 text-slate-200 flex items-center justify-center text-4xl font-semibold notranslate rounded-xl'>  
                            <button onClick={changeLang}>{transButton}</button>
                        </div>
                    </div>
                    }
                </div>
                        
                    : 
                    <div className="flex">
                      <button className='backContainter flex items-center w-full' onClick={goBack}>
                            <svg className='fill-rose-700 ml-4' xmlns="http://www.w3.org/2000/svg" height="5em" viewBox="0 0 448 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>
                            <div className='ml-8 text-5xl text-rose-700 font-semibold'>Categories</div>
                        </button>
                      <div className="w-full text-5xl ml-64">
                          {categoryName}
                        </div>
                    </div>
                    
                        }
                    
            
                </div>
      <div className='catagoryContainer  position-fixed w-screenflex-row flex h-full space-between text-xl'>
        {menuOpen && <FullMenu open={menuOpen} onClose={() => setMenuOpen(false)}>Meer</FullMenu>}
      <div className="overflow-auto flex">
      <div className="flex flex-col items-center justify-start w-1/2 h-full m-4">
      <div>
        <GoogleTranslate/>
        <OrderModal open={openOrder} onClose={() => setOpenOrder(false)} setAdding={setAddingToOrder} openEditor={setOrderEdit}>hello</OrderModal>
      </div>
      {isDrinkArray ? (
        // Render this if categoryDrinks is an array of Drink objects
        (firstHalfCategories as Drink[]).map((drink: Drink) => (
          <div className="h-1/4 w-full mt-10" key={drink.name}>
            <MenuItem 
              drinkName={drink.name}
              drinkImage={DrinkImage[`_${drink.id}` as keyof typeof DrinkImage]}
              altTxt={"Test Drink"}
              thisOnClick={() => openModal(drink.name)}
            />
            <Modal
              open={openModals[drink.name]}
              onClose={() => closeModal(drink.name)}
              drinkName={drink.name}
              lgDrinkPrice={drink.lg_consumer_price}
              nmDrinkPrice={drink.norm_consumer_price}
              lgCost={drink.large_cost}
              nmCost={drink.normal_cost}
              drinkID={drink.id}
              setStateUpdate={setStateUpdate}
            >
              Customize Ingredients
            </Modal>
          </div>
        ))
      ) : (
        // Render this if categoryDrinks is an array of strings
        (firstHalfCategories as string[]).map((name: string, index) => (
          <div className="h-1/4 w-full mt-10" key={name}>
            <MenuItem 
              drinkName={name}
              drinkImage={firstPictures[index]} // Use a default image or some other logic for image
              altTxt={"Test Drink"}
              thisOnClick={() => goToCategory(name.replace(/\s+/g, ''))}
            />
          </div>
        ))
      )}
      </div>
      <div className="flex flex-col items-center justify-start w-1/2 h-full m-4">
      {isDrinkArray ? (
        // Render this if categoryDrinks is an array of Drink objects
        (secondHalfCategories as Drink[]).map((drink: Drink) => (
          <div className="h-1/4 w-full mt-10" key={drink.name}>
            <MenuItem 
              drinkName={drink.name}
              drinkImage={DrinkImage[`_${drink.id}` as keyof typeof DrinkImage]}
              altTxt={"Test Drink"}
              thisOnClick={() => openModal(drink.name)}
            />
            <Modal
              open={openModals[drink.name]}
              onClose={() => closeModal(drink.name)}
              drinkName={drink.name}
              lgDrinkPrice={drink.lg_consumer_price}
              nmDrinkPrice={drink.norm_consumer_price}
              lgCost={drink.large_cost}
              nmCost={drink.normal_cost}
              drinkID={drink.id}
              setStateUpdate={setStateUpdate}
            >
              Customize Ingredients
            </Modal>
          </div>
        ))
      ) : (
        // Render this if categoryDrinks is an array of strings
        (secondHalfCategories as string[]).map((name: string, index: number) => (
          <div className="h-1/4 w-full mt-10" key={name}>
            <MenuItem 
              drinkName={name}
              drinkImage={secondPictures[index]} // Use a default image or some other logic for image
              altTxt={"Test Drink"}
              thisOnClick={() => goToCategory(name.replace(/\s+/g, ''))}
            />
          </div>
        ))
      )}
      </div>
      </div>
      </div>
      </div>
      <div className="orderContainer relative bg-slate-100 rounded-3xl border-rose-700 border-4 text-center text-rose-700 font-bold h-11/12">
  <div className="text-4xl p-1 justify-center">Order</div>
  {drinksState.map((drink, key) => (
    <div className="w-full flex justify-center">
      <OrderDrink
          key = {key}
          drinkName= {drink.name}
          ice = {drink.ice}
          sugar = {drink.sugar}
          size={drink.sz}
          price={drink.totalPrice}
          toppings={drink.toppings}
          toppingAmounts={drink.toppingAmounts}
          />
    </div>
  ))}
  <div className="flex flex-col items-center justify-center absolute bottom-0 left-0 right-0 mx-auto mb-10">
    <button className="bg-rose-700 text-white rounded-3xl p-2 w-2/3 mb-2" onClick={() => {setIsOrderPlaced(true) ;setStateUpdate(true)}}>Place Order</button>
    <button className="bg-rose-700 text-white rounded-3xl p-2 w-2/3 mb-2" onClick={() => {localStorage.clear(); setStateUpdate(true)}}>Clear Order</button>
  </div>
</div>

      </div>
      </div>
    );
}