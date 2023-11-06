"use client"
import './styles.css'
import React, { useState, useEffect } from 'react'

interface IngredientProps {
    name: string;
    CurrentStock: string;
    IdealStock: string;
    AmountUsed: string;
    ConsumerPrice: string;
}

export default function RestockReportIngredient({name, CurrentStock, IdealStock, AmountUsed, ConsumerPrice}: IngredientProps){

    function updateIngredientData(){
        alert("Meer");
    }

    const [Iname, setIName] = useState(name);
    const [currentStock, setCurrentStock] = useState(CurrentStock);
    const [idealStock, setIdealStock] = useState(IdealStock);
    const [amountUsed, setAmountUsed] = useState(AmountUsed);
    const [price, setPrice] = useState(ConsumerPrice);

    return(
        <div className='bg-cyan-200 w-full flex justify-start border-white border-2 h-10'>
            <input className='name flex justify-center items-center bg-cyan-200 text-center' placeholder={name} type='Iname' id='IName' value={Iname} onChange={(e) => setIName(e.target.value)}/>
            <input className='currentStock flex justify-center items-center bg-cyan-200 text-center' placeholder={CurrentStock} type='currentStock' id='currentStock' value={currentStock} onChange={(e) => setCurrentStock(e.target.value)}/>
            <input className='idealStock flex justify-center items-center bg-cyan-200 text-center' placeholder={IdealStock} type='idealStock' id='idealStock' value={idealStock} onChange={(e) => setIdealStock(e.target.value)}/>
            <input className='amountUsed flex justify-center items-center bg-cyan-200 text-center' placeholder={AmountUsed} type='amountUsed' id='amountUsed' value={amountUsed} onChange={(e) => setAmountUsed(e.target.value)}/>
            <input className='consumerPrice flex justify-center items-center bg-cyan-200 text-center' placeholder={ConsumerPrice} type='price' id='price' value={price} onChange={(e) => setPrice(e.target.value)}/>
            <div className='button'>
                <button className="bg-cyan-500 w-full h-full items-center" onClick={updateIngredientData}>Update</button>
            </div>
        </div>
    );
}