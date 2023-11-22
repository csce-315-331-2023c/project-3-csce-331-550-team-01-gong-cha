"use client"

import MenuItem from '../Components/MenuItem/MenuItem'
import defualtDrinkImg from '../../../public/defualtDrinkImg.png'
import { useGeolocated } from 'react-geolocated'
import React, { useState, useEffect } from 'react'
import './styles.css'



export default function Order() {

    const { coords, isGeolocationAvailable, isGeolocationEnabled } = 
    useGeolocated({positionOptions: {enableHighAccuracy: false,},userDecisionTimeout: 5000,});

    useEffect(() => {
        if(coords && isGeolocationAvailable && isGeolocationEnabled){
            fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coords?.latitude.toFixed(2)}&longitude=${coords?.longitude.toFixed(2)}&current=temperature_2m,is_day,rain,snowfall&temperature_unit=fahrenheit`) // Replace with the actual API endpoint URL
            .then((response) => {
                if (!response.ok) {
                alert("did not pass");
                throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                // Process the data received from the API and store it in the state
                if(parseFloat(data?.current?.temperature_2m) > 90){
                    alert(`Recommend hot drink, Temp: ${data?.current?.temperature_2m}F`);
                }
                else if(parseFloat(data?.current?.temperature_2m) > 65){
                    alert(`Recomend Normal Drink, Temp: ${data?.current?.temperature_2m}F`);
                }
                else{
                    alert(`Recommend cold drink, Temp: ${data?.current?.temperature_2m}F`);
                }         
            })
        }
    });

    function goToCategory(category: string){
        window.location.href = "Order/Catagories/" + category;
    }
    function goBack(){
        window.location.href = "../";
    }
    return (
        <main className="bg-slate-400 bg-cover h-screen w-screen w-screenflex-row flex flex-col">
            <button className='backContainter flex items-center' onClick={goBack}>
                <svg className='ml-4' xmlns="http://www.w3.org/2000/svg" height="5em" viewBox="0 0 448 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>
                <div className='ml-8 text-4xl'>Home Page</div>
            </button>
            <div className='catagoryContainer w-screen w-screenflex-row flex h-full'>
                <div className="flex flex-col items-center justify-start w-2/5 h-full m-4">
                    <div className='h-1/5 w-full m-4'>
                        <MenuItem drinkName={"Milk Tea"} drinkImage={defualtDrinkImg} altTxt={"Test Drink"} thisOnClick={() => goToCategory("MilkTea")}/>
                    </div>
                    <div className='h-1/5 w-full m-4'>
                        <MenuItem drinkName={"Creative Mix"} drinkImage={defualtDrinkImg} altTxt={"Test Drink"} thisOnClick={() => goToCategory("CreativeMix")}/>
                    </div>
                    <div className='h-1/5 w-full m-4'>
                        <MenuItem drinkName={"Milk Foam"} drinkImage={defualtDrinkImg} altTxt={"Test Drink"} thisOnClick={() => goToCategory("MilkFoam")}/>
                    </div>
                    <div className='h-1/5 w-full m-4'>
                        <MenuItem drinkName={"Slush"} drinkImage={defualtDrinkImg} altTxt={"Test Drink"} thisOnClick={() => goToCategory("Slush")}/>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-start w-2/5 h-full m-4">
                    <div className='h-1/5 w-full m-4'>
                        <MenuItem drinkName={"Tea Latte"} drinkImage={defualtDrinkImg} altTxt={"Test Drink"} thisOnClick={() => goToCategory("TeaLatte")}/>
                    </div>
                    <div className='h-1/5 w-full m-4'>
                        <MenuItem drinkName={"Brewed Tea"} drinkImage={defualtDrinkImg} altTxt={"Test Drink"} thisOnClick={() => goToCategory("BrewedTea")}/>
                    </div>
                    <div className='h-1/5 w-full m-4'>
                        <MenuItem drinkName={"Coffee"} drinkImage={defualtDrinkImg} altTxt={"Test Drink"} thisOnClick={() => goToCategory("Coffee")}/>
                    </div>
                    <div className='h-1/5 w-full m-4'>
                        <MenuItem drinkName={"Seasonal"} drinkImage={defualtDrinkImg} altTxt={"Test Drink"} thisOnClick={() => goToCategory("Seasonal")}/>
                    </div>
                </div>

                <div className="w-1/5 ml-14 my-10">
                    <div className="bg-white h-full w-4/5 border-gray border-4 rounded-2xl text-center"> Orders </div>
                </div>
            </div>
        </main>
    );
}