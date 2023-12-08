"use client"

import Image, { StaticImageData } from 'next/image'
import MenuItem from '../MenuItem/MenuItem';
import Modal from '../Modal/Modal'
import defualtDrinkImg from '../../../../public/defualtDrinkImg.png'
import defualtDrinkImg2 from '/public/DrinkImages/Black Milk Tea.png'
import {DrinkImage} from '../DinkImage/DrinkImage';
import { useState, useEffect} from 'react';
import OrderDrink from '../OrderDrink/OrderDrink';


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


interface ConfirmOrderProps{
    drinks: orderDrink[]
    onClose: () => void;
}


export default function ConfirmOrder({drinks, onClose}: ConfirmOrderProps){
    const [tip, setTip] = useState(0);
    const [isTakeout, setTakeOut] = useState(false);
    const [orderNumber, setOrderNumber] = useState(0);
    const [totalOrderPrice, setTotalOrderPrice] = useState(0);
    const [totalOrderCost, setTotalOrderCost] = useState(0);
    const [totalProfit, setTotalProfit] = useState(0);
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const date = today.getDate();
    const currentDate = year + "-" + month + "-" + date;
    const currentTime = today.getHours() + ":" + today.getMinutes();
    function handleTip(percent: number){
        setTip(percent);
    }
    function handleTakeOut(value: boolean){
        setTakeOut(value);
    }
    function goBack(){
        window.location.href = "../..";
    }

    function placeOrder() {
        const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        let localTotalOrderPrice = 0;
        let localTotalOrderCost = 0;
        let localOrderDrinkPks: number[] = [];
    
        const orderDrinkPromises = existingOrders.map((drink: orderDrink) => {
            localTotalOrderPrice += drink.totalPrice;
            return fetch('http://18.223.2.65:5000/create-order-drink/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ Total_Price: drink.totalPrice, Size: drink.sz, Menu_Drink_ID: drink.id, Ice_Level: drink.ice, Sugar_Level: drink.sugar })
            })
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                localTotalOrderCost += data.make_cost;
                localOrderDrinkPks.push(data.generatedKey);
                const toppingPks = drink.toppings.map(topping => topping.id);
                fetch(`http://18.223.2.65:5000/create-ingredient-order-drink`,{
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ toppingPKs: toppingPks, toppingAmounts: drink.toppingAmounts, orderDrinkPK: data.generatedKey})
                })
                .then(response => {
                    if (!response.ok) throw new Error('Network response was not ok');
                    return response.json();
                })
            });
        });
        Promise.all(orderDrinkPromises).then(() => {
            setTotalOrderPrice(localTotalOrderPrice);
            setTotalOrderCost(localTotalOrderCost);
            setTotalProfit(localTotalOrderPrice - localTotalOrderCost);
    
            return fetch("http://18.223.2.65:5000/create-order", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cost: localTotalOrderCost,
                    price: localTotalOrderPrice,
                    profit: localTotalOrderPrice - localTotalOrderCost,
                    tip: tip * localTotalOrderPrice,
                    takeout: isTakeout,
                    date: currentDate,
                    time: currentTime,
                    name: "Customer Order",
                    status: 1})
            });
        })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            setOrderNumber(data.orderID);
            return fetch('http://18.223.2.65:5000/create-order-order-drink/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderID: data.orderID,
                    orderDrinkIDs: localOrderDrinkPks
                })
            });
        })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            // Handle the final response
            setCurrentModal(1);
            localStorage.clear();
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    }

    const getTipStyle = (tipAmount: number) => {
        return tip == tipAmount ? "bg-rose-700 text-white font-semibold hover:bg-slate-100 hover:text-rose-800" : "bg-slate-100 hover:bg-rose-700 hover:text-white";
      }
    
    const getTakeoutStyle = (takeout: boolean) => {
        return takeout == isTakeout ? "bg-rose-700 text-white font-semibold hover:bg-slate-100 hover:text-rose-800" : "bg-slate-100 hover:bg-rose-700 hover:text-white";
    }
    
    const [currentModal, setCurrentModal] = useState(0);

    const modals = [(
        <>
  <div className="Overlay_Styles"></div>
  <div className="Modal_Styles bg-slate-200 justify-evenly text-rose-800 font-semibold text-4xl space-y-1flex flex-col h-full">
    <div className="flex-grow-container overflow-auto h-full">
      {drinks.map((drink, key) => (
        <OrderDrink
          key={key}
          drinkName={drink.name}
          ice={drink.ice}
          sugar={drink.sugar}
          size={drink.sz}
          price={drink.totalPrice}
          toppings={drink.toppings}
          toppingAmounts={drink.toppingAmounts}
        />
      ))}
    </div>
    <div className="flex-grow flex flex-col justify-between">
      <div className="flex-col justify-evenly h-1/6">
        <div>Tip</div>
        <div>
          <button onClick={() => handleTip(0)} className={`${getTipStyle(0)} options rounded-3xl w-1/6 `}>0%</button>
          <button onClick={() => handleTip(0.1)} className={`${getTipStyle(0.1)} options rounded-3xl w-1/6 `}>10%</button>
          <button onClick={() => handleTip(0.15)} className={`${getTipStyle(0.15)} options rounded-3xl w-1/6 `}>15%</button>
          <button onClick={() => handleTip(0.2)} className={`${getTipStyle(0.2)} options rounded-3xl w-1/6 `}>20%</button>
        </div>
      </div>
      <div className="flex-col justify-evenly h-1/6">
        <div>Takeout</div>
        <div>
          <button onClick={() => handleTakeOut(true)} className={`${getTakeoutStyle(true)} options rounded-3xl w-1/6`}>Yes</button>
          <button onClick={() => handleTakeOut(false)} className={`${getTakeoutStyle(false)} options rounded-3xl w-1/6 `}>No</button>
        </div>
      </div>
      <div className="flex justify-evenly h-1/6">
        <button onClick={onClose} className="options rounded-3xl w-1/4 bg-slate-100 hover:bg-rose-700">Exit</button>
        <button onClick={() => {placeOrder(); setCurrentModal(1)}} className="options rounded-3xl w-1/4 bg-slate-100 hover:bg-rose-700">Place Order</button>
      </div>
    </div>
  </div>
</>

    ),

        (
            <>
                <div className="Overlay_Styles"></div>
                <div className="Modal_Styles bg-rose-700 border-rose-900 border-8 justify-evenly ">
                    <div className="justify-evenly h-full flex-col text-5xl space-y-60 text-white font-semibolds">
                    <p className="mb-10">Thank You for Choosing Gong Cha!</p>
                    Your Order Number is #{orderNumber}
                    <div>
                    <button onClick={() => {onClose; goBack();}} className="border-white border-2 rounded-3xl w-1/4 text-white bg-rose-700 hover:bg-slate-100 hover:text-rose-700">Exit</button>
                    </div>
                    
                    </div>
                    
                </div>
                
            </>
        )]

        return modals[currentModal]
}