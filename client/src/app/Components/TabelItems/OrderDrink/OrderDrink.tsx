"use client"
import React, { useState, useEffect } from 'react'
import './styles.css'

interface OrderDrinkProps {
    id: number;
    total_price: number;
    size: number;
    menu_drink_id: number;
    ice_level: number;
    sugar_level: number;
    name: string;
}

export default function OrderDrink({id, name, sugar_level, ice_level, menu_drink_id, size, total_price}: OrderDrinkProps){

    const [sizeT, setSize] = useState<string>(size === 0 ? 'Nm' : 'Lg');
    const [iceT, setIce] = useState<string>(ice_level === 0 ? "No" : ice_level === 1 ? "Sm" : "Nm");
    const [sugarT, setSugar] = useState<string>(sugar_level === 0 ? "0%" : sugar_level === 1 ? "30%" : sugar_level === 2 ? "50%" : sugar_level === 3 ? "70%" : "100%");
    
    function deleteOrderDrink(){
        fetch(`http://18.223.2.65:5000/delete-menu-drink/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
              },
        })
        .then(() => {
            //reload();
        });
    }

    return(
        <div className='flex justify-center bg-slate-200 w-ful h-12 mt-1'>
            <div className='total bg-slate-100 w-full flex justify-start border-rose-700 border-2 rounded-lg'>
                <div className='name flex justify-center items-center  text-center rounded-lg outline-none text-rose-700 font-bold'>{name}</div>
                <div className='prices flex justify-center items-center  text-center rounded-lg outline-none text-rose-700 font-bold'>{sizeT}</div>
                <div className='prices flex justify-center items-center  text-center rounded-lg outline-none text-rose-700 font-bold'>{iceT}</div>
                <div className='prices flex justify-center items-center  text-center rounded-lg outline-none text-rose-700 font-bold'>{sugarT}</div>
                <div className='prices flex justify-center items-center  text-center rounded-lg outline-none text-rose-700 font-bold'>{total_price}</div>
                <div className='buttonn flex items-center'>
                    <button className="bg-rose-700 w-full h-5/6 items-center rounded-lg mr-1 text-slate-200" onClick={deleteOrderDrink}>Delete</button>
                </div>
            </div>
        </div>
    );
}