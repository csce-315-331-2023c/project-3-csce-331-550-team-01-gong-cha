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
        <div className='flex justify-center bg-slate-200 w-ful h-12 mt-1'>
            <div className='total bg-slate-100 w-full flex justify-start border-rose-700 border-2 rounded-lg'>
                <input className='name w-2/6 flex justify-center items-center  text-center rounded-lg' placeholder={name} type="Iname" id="Iname" value={Iname} onChange={(e) => setIname(e.target.value)}/>
                <input className='normPrice w-1/5 flex justify-center items-center text-center' placeholder={priceNormal} type="InormalPrice" id="InormalPrice" value={InormalPrice} onChange={(e) => setInormalPrice(e.target.value)}/>
                <input className='lgPrice w-1/5 flex justify-center items-center text-center' placeholder={priceLarge} type="IlargePrice" id="IlargePrice" value={IlargePrice} onChange={(e) => setIlargePrice(e.target.value)}/>
                <Conditional condition={true}>
                    <div className='ingredient flex items-center w-1/6'>
                        <button className="w-full bg-green-600 items-center mr-2 rounded-lg h-5/6" onClick={setInStock}>Yes</button>
                    </div>
                </Conditional>
                <div className='button w-1/6 flex items-center'>
                    <button className="bg-rose-700 w-full h-5/6 items-center rounded-lg mr-1 text-slate-200" onClick={() => updateMenuDrink(pk, Iname, InormalPrice, IlargePrice)}>Update</button>
                </div>
            </div>
        </div>
    );
}