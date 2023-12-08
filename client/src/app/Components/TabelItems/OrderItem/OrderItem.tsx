"use client"
import React, { useState, useEffect } from 'react'
import './styles.css'

interface MenuDrinkProps {
    id: number;
    price: number;
    name: string;
    takeout: boolean;
    date: string;
    time: string;
    status: number;
    tip: number;
    openEditor: (b: boolean) => any;
    setPk: (pkD: number) => any;
}

export default function OrderItem({id, name, price, takeout, date, time, status, tip, openEditor, setPk}: MenuDrinkProps){

    const [Istatus, setIlargePrice] = useState('');
    const [IstatusBS, setIlargePriceBS] = useState(status === 1 ? 'bg-rose-700' : 'bg-green-600');
    const [IstatusB, setIlargePriceB] = useState(status === 1 ? 'Fufill' : 'Fufilled');
    
    function deleteMenuDrink(){
        fetch(`http://18.191.166.59:5000/delete-menu-drink/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
              },
        })
        .then(() => {
            //reload();
        });
    }

    function deleteOrder(){

    }

    function setStatus(s: number){

    }

    return(
        <div className='flex justify-center bg-slate-200 w-ful h-12 mt-1'>
            <div className='total bg-slate-100 w-full flex justify-start border-rose-700 border-2 rounded-lg'>
                <div className='prices w-2/6 flex justify-center items-center  text-center rounded-lg outline-none text-rose-700 font-bold'>{id}</div>
                <div className='name w-2/6 flex justify-center items-center  text-center rounded-lg outline-none text-rose-700 font-bold'>{time}</div>
                <div className='name w-2/6 flex justify-center items-center  text-center rounded-lg outline-none text-rose-700 font-bold'>{name}</div>
                <div className='prices w-2/6 flex justify-center items-center  text-center rounded-lg outline-none text-rose-700 font-bold'>{price}</div>
                <div className='prices w-2/6 flex justify-center items-center  text-center rounded-lg outline-none text-rose-700 font-bold'>{tip}</div>
                <div className='ingredient flex items-center w-1/6'>
                    <button className={`w-full ${IstatusBS} items-center mr-2 rounded-lg h-5/6 text-slate-200`} onClick={() => {status === 1 ? setStatus(2) : "" }}>{IstatusB}</button>
                </div>
                <div className='ingredient flex items-center w-1/6'>
                    <button className="w-full bg-rose-700 items-center mr-2 rounded-lg h-5/6 text-slate-200" onClick={() => {setPk(id), openEditor(true)}}>Edit</button>
                </div>
                <div className='buttonn w-1/6 flex items-center'>
                    <button className="bg-rose-700 w-full h-5/6 items-center rounded-lg mr-1 text-slate-200" onClick={deleteOrder}>Delete</button>
                </div>
            </div>
        </div>
    );
}