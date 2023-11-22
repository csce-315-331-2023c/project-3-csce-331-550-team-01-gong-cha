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
        <div className='flex justify-center bg-slate-200 w-ful h-12 mt-1'>
            <div className='total bg-slate-100 w-full flex justify-start border-rose-700 border-2 rounded-lg'>
                <input className='name flex justify-center items-cente text-center rounded-lg bg-inherit' placeholder={FIName} type='Iname' id='IName' value={Iname} onChange={(e) => setIName(e.target.value)}/>
                <input className='currentStock flex justify-center items-center text-center bg-inherit' placeholder={CurrentStock} type='IcurrentStock' id='IcurrentStock' value={IcurrentStock} onChange={(e) => setCurrentStock(e.target.value)}/>
                <input className='idealStock flex justify-center items-center text-center bg-inherit' placeholder={IdealStock} type='idealStock' id='idealStock' value={idealStock} onChange={(e) => setIdealStock(e.target.value)}/>
                <input className='amountUsed flex justify-center items-center text-center bg-inherit' placeholder={FAmountUsed} type='IamountUsed' id='IamountUsed' value={IamountUsed} onChange={(e) => setAmountUsed(e.target.value)}/>
                <input className='consumerPrice flex justify-center items-centertext-center bg-inherit' placeholder={FConsumerPrice} type='Iprice' id='Iprice' value={Iprice} onChange={(e) => setPrice(e.target.value)}/>
                <div className='button flex justify-center align-center items-center mr-1'>
                    <button className="bg-rose-700 w-full h-5/6 items-center rounded-md text-slate-200" onClick={() => updateIngredient(pk, Iname, IcurrentStock, idealStock, IamountUsed, Iprice)}>Update</button>
                </div>
            </div>
        </div>
    );
}