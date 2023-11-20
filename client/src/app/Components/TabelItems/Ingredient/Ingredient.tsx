"use client"
import './styles.css'
import React, { useState, useEffect } from 'react'

interface IngredientProps {
    pk: number;
    FIName: string;
    CurrentStock: string;
    IdealStock: string;
    FAmountUsed: string;
    FConsumerPrice: string;
    reload: () => void;
}

export default function RestockReportIngredient({pk, FIName, CurrentStock, IdealStock, FAmountUsed, FConsumerPrice, reload}: IngredientProps){

    function updateIngredient(pkk: number, Iname: string, cStock: string, idealStock: string, aUsed: string, price: string){

        var newName = "";
        var newCurStock = "";
        var newIdealStock = "";
        var newAmountUsed = "";
        var newPrice = "";

        if(Iname === newName){ newName = FIName; }
        else{ newName = Iname; }
        if(cStock === newCurStock){ newCurStock = CurrentStock; }
        else{ newCurStock = cStock; }
        if(idealStock === newIdealStock){ newIdealStock = IdealStock; }
        else{ newIdealStock = idealStock; }
        if(aUsed === newAmountUsed){ newAmountUsed = FAmountUsed; }
        else{ newAmountUsed = aUsed; }
        if(price === newPrice){ newPrice = FConsumerPrice; }
        else{ newPrice = price; }
        
        fetch(`http://18.191.166.59:5000/update-ingredient/${pkk}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({name: newName, currentAmount: newCurStock, idealAmount: newIdealStock, restockPrice: '0', consumerPrice: newPrice, amountUsed: newAmountUsed}),
          })
          .then(() => {
            setIName('');
            setCurrentStock('');
            setIdealStock('');
            setAmountUsed('');
            setPrice('');
            reload();
          })
    }

    const [Iname, setIName] = useState('');
    const [IcurrentStock, setCurrentStock] = useState('');
    const [idealStock, setIdealStock] = useState('');
    const [IamountUsed, setAmountUsed] = useState('');
    const [Iprice, setPrice] = useState('');

    return(
        <div className='bg-cyan-200 w-full flex justify-start border-white border-2 h-10'>
            <input className='name flex justify-center items-center bg-cyan-200 text-center' placeholder={FIName} type='Iname' id='IName' value={Iname} onChange={(e) => setIName(e.target.value)}/>
            <input className='currentStock flex justify-center items-center bg-cyan-200 text-center' placeholder={CurrentStock} type='IcurrentStock' id='IcurrentStock' value={IcurrentStock} onChange={(e) => setCurrentStock(e.target.value)}/>
            <input className='idealStock flex justify-center items-center bg-cyan-200 text-center' placeholder={IdealStock} type='idealStock' id='idealStock' value={idealStock} onChange={(e) => setIdealStock(e.target.value)}/>
            <input className='amountUsed flex justify-center items-center bg-cyan-200 text-center' placeholder={FAmountUsed} type='IamountUsed' id='IamountUsed' value={IamountUsed} onChange={(e) => setAmountUsed(e.target.value)}/>
            <input className='consumerPrice flex justify-center items-center bg-cyan-200 text-center' placeholder={FConsumerPrice} type='Iprice' id='Iprice' value={Iprice} onChange={(e) => setPrice(e.target.value)}/>
            <div className='button'>
                <button className="bg-cyan-500 w-full h-full items-center" onClick={() => updateIngredient(pk, Iname, IcurrentStock, idealStock, IamountUsed, Iprice)}>Update</button>
            </div>
        </div>
    );
}