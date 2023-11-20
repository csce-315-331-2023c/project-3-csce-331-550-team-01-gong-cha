"use client"
import React, { useState, useEffect } from 'react'
import './styles.css'

interface MenuDrinkProps {
    pk: number;
    name: string;
    priceNormal: string;
    priceLarge: string;
    category: string;
    reload: () => void;
  }

export default function RestockReportIngredient({pk, name, priceNormal, priceLarge, category, reload}: MenuDrinkProps){

    function setInStock(){

    }

    function updateMenuDrink(pkk: number, Fname: string, FnormPrice: string, FlargePrice: string){

        var newName = "";
        var newNormPrice = "";
        var newLargePrice = "";

        if(Fname === newName){ newName = name; }
        else{ newName = Fname; }
        if(FlargePrice === newLargePrice){ newLargePrice = priceLarge; }
        else{ newLargePrice = FlargePrice; }
        if(FnormPrice === newNormPrice){ newNormPrice = priceNormal; }
        else{ newNormPrice = FnormPrice; }

        fetch(`http://18.191.166.59:5000/update-menu-drink/${pkk}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({name: newName, normalCost: parseFloat(newNormPrice) * 0.8, largeCost: parseFloat(newLargePrice) * 0.8, normConsumerPrice: newNormPrice, lgConsumerPrice: newLargePrice, category: category}),
          })
          .then(() => {
            setIname('');
            setInormalPrice('');
            setIlargePrice('');
            reload();
          })
    }

    const Conditional = ({condition, children,}: 
        {condition: boolean, children: React.ReactNode}) => {
            if(condition) return <>{children}</>;
            return <></>;
    };

    const [Iname, setIname] = useState('');
    const [InormalPrice, setInormalPrice] = useState('');
    const [IlargePrice, setIlargePrice] = useState('');

    return(
        <div className='bg-cyan-200 w-full flex justify-start border-white border-2 h-10'>
            <input className='name w-2/6 flex justify-center items-center bg-cyan-200 text-center' placeholder={name} type="Iname" id="Iname" value={Iname} onChange={(e) => setIname(e.target.value)}/>
            <input className='normPrice w-1/5 flex justify-center items-center bg-cyan-200 text-center' placeholder={priceNormal} type="InormalPrice" id="InormalPrice" value={InormalPrice} onChange={(e) => setInormalPrice(e.target.value)}/>
            <input className='lgPrice w-1/5 flex justify-center items-center bg-cyan-200 text-center' placeholder={priceLarge} type="IlargePrice" id="IlargePrice" value={IlargePrice} onChange={(e) => setIlargePrice(e.target.value)}/>
            <Conditional condition={true}>
                <button className="ingredient w-1/6 bg-green-600 h-full items-center" onClick={setInStock}>Yes</button>
            </Conditional>
            <div className='button w-1/6'>
                <button className="bg-cyan-500 w-full h-full items-center" onClick={() => updateMenuDrink(pk, Iname, InormalPrice, IlargePrice)}>Update</button>
            </div>
        </div>
    );
}