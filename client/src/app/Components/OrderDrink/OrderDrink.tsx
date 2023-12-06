"use client"

import { useState,useEffect } from "react";

interface OrderDrinkProps {

    key: number;
    drinkName: string;
    sugar: number;
    ice: number;
    size: number;
    price: number;
    toppings: Topping[];
    toppingAmounts: number[];
}

interface Topping {
    id: number;
    toppingName: string;
  }

export default function OrderDrink({key, drinkName, sugar, ice, size, price, toppings, toppingAmounts}: OrderDrinkProps){

    const sizeLabels: { [key: number]: string } = {
        0: "Normal",
        1: "Large"
      };

    const sugarLabels: { [key: number]: string } = {
        0: "0%",
        1: "30%",
        2: "50%",
        3: "70%",
        4: "100%",
    }

    const iceLabels: { [key: number]: string } = {
        0: "No Ice",
        1: "Less Ice",
        2: "More Ice"
    }

    console.log(toppings);
    return (
        <div className="flex-col w-11/12 bg-rose-800 p-3 text-sm rounded-3xl mt-3 text-slate-100 font-semibold">
            <div className="flex justify-evenly">
                <div className="text-sm">
                    {drinkName}
                    <div className="">Toppings {toppings.map((topping, index) => <p key={index}>{topping.toppingName}</p>
                        )}
                    </div>

                </div>
                <div className="text-sm">
                    <div>
                        Size: {sizeLabels[size]}
                    </div>
                    <div>
                        Sugar: {sugarLabels[sugar]}
                    </div>
                    <div>
                        Ice: {iceLabels[ice]}
                    </div>
                    <div>
                        Price: {price}
                        
                    </div>
                </div>
            </div>
        </div>
    )
}