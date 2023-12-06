"use client"

import MenuItem from '../Components/MenuItem/MenuItem'
import defualtDrinkImg from '../../../public/defualtDrinkImg.png'
import { useGeolocated } from 'react-geolocated'
import React, { useState, useEffect } from 'react'
import Suggestion from '../Components/Suggestion/Suggestion'
import seasonalImage from '../../../public/drinkImages/seas.png'
import coffeeImage from '../../../public/drinkImages/53.png'
import bewedImage from '../../../public/drinkImages/49.png'
import milkImage from '../../../public/drinkImages/30.png'
import creImage from '../../../public/drinkImages/18.png'
import foamImage from '../../../public/drinkImages/31.png'
import slushImage from '../../../public/drinkImages/44.png'
import GoogleTranslate from '../GoogleTranslate/GoogleTranslate.js'
import Modal from '../Components/Modal/Modal'
import FullMenu from '../Components/FullMenu/FullMenu'
import { getCookie, hasCookie, setCookie } from 'cookies-next';
import Router from "next/router";
import OrderDrink from '../Components/OrderDrink/OrderDrink';
import ConfirmOrder from '../Components/ConfirmOrder/ConfirmOrder'
import CategoryPage from '../Components/CategoryPage/CategoryPage'

import './styles.css'

interface SelectedData {
    name: string;
    ID: number;
    normPrice: number;
    largePrice: number;
    normCost: number;
    largeCost: number;
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

  interface Topping {
    id: number;
    toppingName: string;
  }



export default function Order() {

    // const [transButton, setTransButton] = useState('');

    // const { coords, isGeolocationAvailable, isGeolocationEnabled } = 
    //     useGeolocated({positionOptions: {enableHighAccuracy: false,},userDecisionTimeout: 5000,});

    const [suggestionOpen, setSuggestionOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [tempVal, setTempVal] = useState(80);
    const [raining, setRaining] = useState(false);
    const [suggested, setSuggested] = useState(false);

    // function getData(suggested: boolean){
    //     if(!suggested){
    //         if(coords && isGeolocationAvailable && isGeolocationEnabled){
    //             fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coords?.latitude.toFixed(2)}&longitude=${coords?.longitude.toFixed(2)}&current=temperature_2m,is_day,rain,snowfall&temperature_unit=fahrenheit`) // Replace with the actual API endpoint URL
    //             .then((response) => {
    //                 if (!response.ok) {
    //                     throw new Error('Network response was not ok');
    //                 }
    //                 return response.json();
    //             })
    //             .then((data) => {
    //                 if(data?.current?.rain === 1){
    //                     setRaining(true);
    //                 }
    //                 setTempVal(parseFloat(data?.current?.temperature_2m));    
    //             })
    //             .then(() => {
    //                 setSuggestionOpen(true);
    //                 setSuggested(true);
    //             })
    //         }
    //     }
    // }
    // useEffect(() => {
    //     getData(suggested)  
    //     if(!hasCookie('googtrans')){
    //         setTransButton('普通话');
    //         setCookie('googtrans',decodeURI('/auto/en'));
    //     }
    //     if(getCookie('googtrans') === '/auto/en'){
    //         setTransButton('普通话');
    //     }
    //     else{
    //         setTransButton('English');
    //     }
    // });

    const [recommended, setRecommended] = useState(false);
    const [selectedData, setSelectedData] = useState<SelectedData>();

    const handleSelectedData = (data: SelectedData) => {
        setSelectedData(data);
        setRecommended(true);
    };
    function goToCategory(category: string){
        window.location.href = "Order/Catagories/" + category;
    }

    function goBack(){
        window.location.href = "../";
    }
    function setStateUpdate(state: boolean){
        setRecommended(false);}

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

    return (
        <main className="bg-slate-200 bg-cover h-screen w-screen flex">
            <div className='ml-6 catagoryContainer w-full flex-col h-full'>
                <div className="flex items-center justify-start border-black border-8 w-full">
                {recommended && (
                    <Modal
                    open={true} 
                    onClose={() => setRecommended(false)}
                    drinkName={selectedData?.name || ''}
                    drinkID={selectedData?.ID || 0}
                    nmDrinkPrice={selectedData?.normPrice || 0}
                    lgDrinkPrice={selectedData?.largePrice || 0}
                    nmCost={selectedData?.normCost || 0}
                    lgCost={selectedData?.largeCost || 0}
                    setStateUpdate={setStateUpdate}
                >Customize Ingredients</Modal>
                )}
                
                <CategoryPage categoryDrinks={["Milk Tea" , "Creative Mix", "Milk Foam", "Slush", "Tea Latte", "Brewed Tea", "Coffee", "Seasonal"]} categoryName={""}></CategoryPage> 

                </div>
            </div>
            
        </main>
    );
}