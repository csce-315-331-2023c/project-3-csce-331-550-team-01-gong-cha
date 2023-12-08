"use client"
import './styles.css'
import React, { useState, useEffect } from 'react'

interface IngredientProps {
    pk: number;
    FIName: string;
    CurrentStock: string;
    IdealStock: string;
    FConsumerPrice: string;
    isIngre: boolean;
    reload: () => void;
}

export default function RestockReportIngredient({pk, FIName, CurrentStock, IdealStock, FConsumerPrice, isIngre, reload}: IngredientProps){

    const [style, setStyle] = useState(isIngre ? 'bg-green-600' : 'bg-red-600');
    const [letters, setLetters] = useState(isIngre ? 'Yes' : 'No');

    function updateIngredient(pkk: number, Iname: string, cStock: string, idealStock: string, price: string){

        var newName = "";
        var newCurStock = "";
        var newIdealStock = "";
        var newPrice = "";
        var isIngred = isIngre ? "TRUE" : "FALSE";

        if(Iname === newName){ newName = FIName; }
        else{ newName = Iname; }
        if(cStock === newCurStock){ newCurStock = CurrentStock; }
        else{ newCurStock = cStock; }
        if(idealStock === newIdealStock){ newIdealStock = IdealStock; }
        else{ newIdealStock = idealStock; }
        if(price === newPrice){ newPrice = FConsumerPrice; }
        else{ newPrice = price; }

        fetch(`http://18.191.166.59:5000/update-ingredient/${pkk}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({name: newName, currentAmount: newCurStock, idealAmount: newIdealStock, consumerPrice: newPrice, isIngredient: isIngred}),
          })
          .then((response) => {
            // alert(response);
            setIName('');
            setCurrentStock('');
            setIdealStock('');
            setAmountUsed('');
            setPrice('');
            reload();
          })
    }

    function deleteTopping(iPk: number){
        fetch(`http://18.191.166.59:5000/delete-ingredient/${iPk}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
              },
        })
        .then(() => {
            reload();
        });
    }

    function setTopping(iPk: number){
        fetch(`http://18.191.166.59:5000/change-is-ingredient/${iPk}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
              },
        })
        .then((response) => {
            reload();
        });
        
    }

    const [Iname, setIName] = useState('');
    const [IcurrentStock, setCurrentStock] = useState('');
    const [idealStock, setIdealStock] = useState('');
    const [IamountUsed, setAmountUsed] = useState('');
    const [Iprice, setPrice] = useState('');

    return(
        <div className='flex justify-center bg-slate-200 w-ful h-12 mt-1'>
            <div className='total bg-slate-100 w-full flex justify-start border-rose-700 border-2 rounded-lg'>
                <input className='name flex justify-center items-cente text-center rounded-lg bg-inherit outline-none text-rose-700' placeholder={FIName} type='Iname' id='IName' value={Iname} onChange={(e) => setIName(e.target.value)}/>
                <input className='currentStock flex justify-center items-center text-center bg-inherit outline-none text-rose-700' placeholder={CurrentStock} type='IcurrentStock' id='IcurrentStock' value={IcurrentStock} onChange={(e) => setCurrentStock(e.target.value)}/>
                <input className='idealStock flex justify-center items-center text-center bg-inherit outline-none text-rose-700' placeholder={IdealStock} type='idealStock' id='idealStock' value={idealStock} onChange={(e) => setIdealStock(e.target.value)}/>
                <input className='consumerPrice flex justify-center items-center text-center bg-inherit outline-none text-rose-700' placeholder={FConsumerPrice} type='Iprice' id='Iprice' value={Iprice} onChange={(e) => setPrice(e.target.value)}/>
                <div className='meer flex justify-center align-center items-center mr-1'>
                    <button className="w-full bg-rose-700 h-5/6 items-center rounded-md text-slate-200" onClick={() => deleteTopping(pk)}>Delete</button>
                </div>
                <div className='ingredient flex items-center w-1/6'>
                    <button className={`w-full ${style} items-center mr-2 rounded-lg h-5/6 text-slate-200`} onClick={() => setTopping(pk)}>{letters}</button>
                </div>
                <div className='mew flex justify-center align-center items-center mr-1'>
                    <button className="bg-rose-700 w-full h-5/6 items-center rounded-md text-slate-200" onClick={() => updateIngredient(pk, Iname, IcurrentStock, idealStock, IamountUsed)}>Update</button>
                </div>
            </div>
        </div>
    );
}