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

    // const [toppingNames, setToppingNames] = useState<string[]>([]);
    // const [toppingsLoaded, setToppingLoaded] = useState(false);

    // function getNameFromPk(){
    //     if (!toppingsLoaded) {
    //         setToppingLoaded(true);
    //         toppings.map((topping) =>
    //         fetch(`http://18.191.166.59:5000/get-ingredient-name/${topping.id}`)
    //         .then((response) => {
    //             if (!response.ok) {
    //                 throw new Error('Network response was not ok');
    //             }
    //             return response.json();
    //         })
    //         .then((data) => {
    //             toppingNames.push(data.ingredientName); //prevToppings => [...prevToppings, data.ingredientName]
    //             //alert(toppingNames);
    //         })
    //         )
    //     }
    // }
    
    // useEffect(() => {
    //     //alert(`First call ${toppingPks}`);
    //     //if (!toppingsLoaded) {
    //         //setToppingLoaded(true);
    //        // Promise.all(
    //         //alert(toppingPks);
    //         //setToppingLoaded(true);
    //         getNameFromPk();
    //             //toppingPks.map((pk) => alert(pk)
    //                 // fetch(`http://18.191.166.59:5000/get-ingredient-name/${pk}`)
    //                 // .then((response) => {
    //                 //     if (!response.ok) {
    //                 //         throw new Error('Network response was not ok');
    //                 //     }
    //                 //     return response.json();
    //                 // })
    //                 // .then((data) => {
    //                 //     toppingNames.push(data.ingredientName); //prevToppings => [...prevToppings, data.ingredientName]
    //                 //     alert(toppingNames);
    //                 // })
    //                 // .catch((error) => {
    //                 //     console.error('There was a problem with the fetch operation:', error);
    //                 // })
    //             //)
    //         // ).then(() => {
    //         //     //setToppingLoaded(true);
    //         // });
    //     //}
    // }, [toppingPks]);

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
        <div className="flex-col w-full bg-cyan-200 rounded-sm mt-3">
            <div className="flex justify-evenly">
                <div className="text-sm">
                    {drinkName}
                    <div className="overflow-scroll">Toppings: {toppings.map((topping, index) => <p key={index}>{topping.toppingName}</p>
                        )}</div>

                    
                </div>
                <div className="text-xs">
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