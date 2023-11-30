"use client"

import Image, { StaticImageData } from 'next/image'
import MenuItem from '../MenuItem/MenuItem';
import Modal from '../Modal/Modal'
import defualtDrinkImg from '../../../../public/defualtDrinkImg.png'
import defualtDrinkImg2 from '/public/DrinkImages/Black Milk Tea.png'
import {DrinkImage} from '../DinkImage/DrinkImage';
import { useState, useEffect} from 'react';
import OrderDrink from '../OrderDrink/OrderDrink';


interface orderDrink {
    name: string;
    ice: number;
    sugar: number;
    sz: number;
    totalPrice: number; // cost for customer
    costPrice: number; // cost for us to make
    id: number
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
        setTip(totalOrderPrice * percent);
    }
    function handleTakeOut(value: boolean){
        setTakeOut(value);
    }
    function goBack(){
        window.location.href = "../";
    }

    function placeOrder() {
        const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        let localTotalOrderPrice = 0;
        let localTotalOrderCost = 0;
        let localOrderDrinkPks: number[] = [];
    
        const orderDrinkPromises = existingOrders.map((drink: orderDrink) => {
            localTotalOrderPrice += drink.totalPrice;
            return fetch('http://18.191.166.59:5000/create-order-drink/', {
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
            });
        });
    
        Promise.all(orderDrinkPromises).then(() => {
            setTotalOrderPrice(localTotalOrderPrice);
            setTotalOrderCost(localTotalOrderCost);
            setTotalProfit(localTotalOrderPrice - localTotalOrderCost);
    
            return fetch('http://18.191.166.59:5000/create-order/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    total_cost: localTotalOrderCost,
                    price: localTotalOrderPrice,
                    profit: localTotalOrderPrice - localTotalOrderCost,
                    tipped: tip,
                    takeout: isTakeout,
                    date: currentDate,
                    time: currentTime,
                    name: "Customer Order"
                })
            });
        })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            setOrderNumber(data.orderID);
            return fetch('http://18.191.166.59:5000/create-order-order-drink/', {
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
            goBack();
            localStorage.clear();
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    }
    
    const [currentModal, setCurrentModal] = useState(0);

    const modals = [(
        <>
            <div className="Overlay_Styles"></div>
            <div className="Modal_Styles bg-slate-400 justify-evenly">
            {drinks.map((drink, key) => (
                <OrderDrink
                key = {key}
                drinkName= {drink.name}
                ice = {drink.ice}
                sugar = {drink.sugar}
                size={drink.sz}
                price={drink.totalPrice}
                />
                
            ))}
            <div className="flex-col justify-evenly  ">
                <div>Tip</div>
                <div>
                <button onClick={() => handleTip(0)} className="border-white border-2 rounded-md w-1/6 bg-rose-700 hover:bg-white">0%</button>
                <button onClick={() => handleTip(0.1)} className="border-white border-2 rounded-md w-1/6 bg-rose-700 hover:bg-white">10%</button>
                <button onClick={() => handleTip(0.15)} className="border-white border-2 rounded-md w-1/6 bg-rose-700 hover:bg-white">15%</button>
                <button onClick={() => handleTip(0.2)} className="border-white border-2 rounded-md w-1/6 bg-rose-700 hover:bg-white">20%</button>
                </div>
            </div>
            <div className="flex-col justify-evenly  ">
                <div>Takeout</div>
                <div>
                <button onClick={() => handleTakeOut(true)} className="border-white border-2 rounded-md w-1/6 bg-rose-700 hover:bg-white">Yes</button>
                <button onClick={() => handleTakeOut(false)} className="border-white border-2 rounded-md w-1/6 bg-rose-700 hover:bg-white">No</button>
                </div>
            </div>
            <div className="flex justify-evenly">
                <button onClick={onClose}className="border-white border-2 rounded-md w-1/4 bg-rose-700 hover:bg-white">Exit</button>
                <button onClick={() => {placeOrder(); setCurrentModal(1)}} className="border-white border-2 rounded-md w-1/4 bg-rose-700 hover:bg-white">Place Order</button>
            </div>
            </div>
            
        </>
    ),

        (
            <>
                <div className="Overlay_Styles"></div>
                <div className="Modal_Styles bg-slate-400 justify-evenly">
                    <div className="justify-evenly h-full flex-col">
                    <p>Thank you for your Money!</p>
                    Your Order Number is #{orderNumber}
                    <div>
                    <button onClick={onClose}className="border-white border-2 rounded-md w-1/4 bg-rose-700 hover:bg-white">Exit</button>
                    </div>
                    
                    </div>
                    
                </div>
                
            </>
        )]

        return modals[currentModal]
}