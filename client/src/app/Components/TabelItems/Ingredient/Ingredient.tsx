"use client"
import './styles.css'
import React, { useState, useEffect } from 'react'

interface IngredientProps {
    pk: number;
    name: string;
    CurrentStock: string;
    IdealStock: string;
    AmountUsed: string;
    ConsumerPrice: string;
}

export default function RestockReportIngredient({pk, name, CurrentStock, IdealStock, AmountUsed, ConsumerPrice}: IngredientProps){

    function updateIngredientData(){
        alert("Meer");
    }

    function updateIngredient(Iname: string, currentStock: string, idealStock: string, amountUsed: string, price: string){

        var newName = "";
        var newCurStock = "";
        var newIdealStock = "";
        var newAmountUsed = "";
        var newPrice = "";

        if(Iname.localeCompare(newName)){ newName = name; }
        if(currentStock.localeCompare(newCurStock)){ newCurStock = CurrentStock; }
        if(idealStock.localeCompare(newIdealStock)){ newIdealStock = IdealStock; }
        if(amountUsed.localeCompare(newAmountUsed)){ newAmountUsed = AmountUsed; }
        if(price.localeCompare(newPrice)){ newPrice = ConsumerPrice; }

        // fetch('http://18.191.166.59:5000/manager-update-ingredient', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({}),
        // })
      }

    const [Iname, setIName] = useState('');
    const [currentStock, setCurrentStock] = useState('');
    const [idealStock, setIdealStock] = useState('');
    const [amountUsed, setAmountUsed] = useState('');
    const [price, setPrice] = useState('');

    return(
        <div className='bg-cyan-200 w-full flex justify-start border-white border-2 h-10'>
            <input className='name flex justify-center items-center bg-cyan-200 text-center' placeholder={name} type='Iname' id='IName' value={Iname} onChange={(e) => setIName(e.target.value)}/>
            <input className='currentStock flex justify-center items-center bg-cyan-200 text-center' placeholder={CurrentStock} type='currentStock' id='currentStock' value={currentStock} onChange={(e) => setCurrentStock(e.target.value)}/>
            <input className='idealStock flex justify-center items-center bg-cyan-200 text-center' placeholder={IdealStock} type='idealStock' id='idealStock' value={idealStock} onChange={(e) => setIdealStock(e.target.value)}/>
            <input className='amountUsed flex justify-center items-center bg-cyan-200 text-center' placeholder={AmountUsed} type='amountUsed' id='amountUsed' value={amountUsed} onChange={(e) => setAmountUsed(e.target.value)}/>
            <input className='consumerPrice flex justify-center items-center bg-cyan-200 text-center' placeholder={ConsumerPrice} type='price' id='price' value={price} onChange={(e) => setPrice(e.target.value)}/>
            <div className='button'>
                <button className="bg-cyan-500 w-full h-full items-center" onClick={() => updateIngredient(name, CurrentStock, IdealStock, AmountUsed, ConsumerPrice)}>Update</button>
            </div>
        </div>
    );
}