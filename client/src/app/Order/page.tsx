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
<<<<<<< HEAD
import Modal from '../Components/Modal/Modal'
// import FullMenu from '../Components/FullMenu/FullMenu'
=======
import FullMenu from '../Components/FullMenu/FullMenu'
>>>>>>> 468844c (Added full menu component)
import { getCookie, hasCookie, setCookie } from 'cookies-next';
import Router from "next/router";

import './styles.css'

interface SelectedData {
    name: string;
    ID: number;
    normPrice: number;
    largePrice: number;
    normCost: number;
    largeCost: number;
}

export default function Order() {
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
            <div className='ml-6 catagoryContainer w-4/5 flex-col h-full'>

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
                <div className='flex justify-start align-center items-center'>
                    <div className='homButton'>
                        <button className='backContainter flex items-center w-full' onClick={goBack}>
                            <svg className='fill-rose-700 ml-4' xmlns="http://www.w3.org/2000/svg" height="5em" viewBox="0 0 448 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>
                            <div className='ml-8 text-5xl text-rose-700 font-semibold'>Home Page</div>
                        </button>
                    </div>
                    <div className='topCon flex justify-evenly'>
                        <div className='bg-rose-700 w-2/5 h-16 text-slate-200 flex items-center justify-center text-4xl font-semibold notranslate rounded-xl'>  
                            <button onClick={() => setMenuOpen(true)}>Full Menu</button>
                        </div>
                        <div className='bg-rose-700 w-2/5 h-16 text-slate-200 flex items-center justify-center text-4xl font-semibold notranslate rounded-xl'>  
                            <button onClick={changeLang}>{transButton}</button>
                        </div>
                    </div>
                </div>
                <div>
                    <GoogleTranslate/>
                </div>
                <div className='flex h-full w-full'>
<<<<<<< HEAD
                    <Suggestion onDataSelect={handleSelectedData} open={suggestionOpen} onClose={() => setSuggestionOpen(false)} temp={tempVal} raning={raining}>hello</Suggestion>
                    {/* <FullMenu open={menuOpen} onClose={() => setMenuOpen(false)}>Meer</FullMenu> */}
=======
                    <Suggestion open={suggestionOpen} onClose={() => setSuggestionOpen(false)} temp={tempVal} raning={raining}>hello</Suggestion>
                    <FullMenu open={menuOpen} onClose={() => setMenuOpen(false)}>Meer</FullMenu>
>>>>>>> 468844c (Added full menu component)
                    <div className="flex flex-col items-center justify-start w-full h-full m-4">
                        <div className='h-1/5 w-full m-4'>
                            <MenuItem drinkName={"Milk Tea"} drinkImage={milkImage} altTxt={"Test Drink"} thisOnClick={() => goToCategory("MilkTea")}/>
                        </div>
                        <div className='h-1/5 w-full m-4'>
                            <MenuItem drinkName={"Creative Mix"} drinkImage={creImage} altTxt={"Test Drink"} thisOnClick={() => goToCategory("CreativeMix")}/>
                        </div>
                        <div className='h-1/5 w-full m-4'>
                            <MenuItem drinkName={"Milk Foam"} drinkImage={foamImage} altTxt={"Test Drink"} thisOnClick={() => goToCategory("MilkFoam")}/>
                        </div>
                        <div className='h-1/5 w-full m-4'>
                            <MenuItem drinkName={"Slush"} drinkImage={slushImage} altTxt={"Test Drink"} thisOnClick={() => goToCategory("Slush")}/>
                        </div>
                    </div>
                    <div className=" flex flex-col items-center justify-start w-full h-full ml-8 my-4">
                        <div className='h-1/5 w-full m-4'>
                            <MenuItem drinkName={"Tea Latte"} drinkImage={bewedImage} altTxt={"Test Drink"} thisOnClick={() => goToCategory("TeaLatte")}/>
                        </div>
                        <div className='h-1/5 w-full m-4'>
                            <MenuItem drinkName={"Brewed Tea"} drinkImage={bewedImage} altTxt={"Test Drink"} thisOnClick={() => goToCategory("BrewedTea")}/>
                        </div>
                        <div className='h-1/5 w-full m-4'>
                            <MenuItem drinkName={"Coffee"} drinkImage={coffeeImage} altTxt={"Test Drink"} thisOnClick={() => goToCategory("Coffee")}/>
                        </div>
                        <div className='h-1/5 w-full m-4'>
                            <MenuItem drinkName={"Seasonal"} drinkImage={seasonalImage} altTxt={"Test Drink"} thisOnClick={() => goToCategory("Seasonal")}/>
                        </div>
                    </div>
                </div>
            </div>
            <div className="orderContainer ml-12 my-10 flex mr-12 items-center">
                    <div className='h-5/6 separatorLine bg-rose-700'></div>
                    <div className="ml-4 h-full w-full text-center text-rose-700 text-6xl font-semibold"> Order </div>
                </div>
        </main>
    );
}