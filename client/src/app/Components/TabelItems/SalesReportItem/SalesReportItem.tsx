"use client"

import "./styles.css"

interface SalesReportProps {
    MenuDrinkName: string;
    MenuDrinkPrice: number;
    AmountSold: number;
}

export default function SalesReportIngredient({MenuDrinkName, MenuDrinkPrice, AmountSold}: SalesReportProps){

    return(
        <div className="flex justify-center">
            <div className='inner bg-rose-700 w-full flex justify-evenly text-slate-200 font-semibold text-xl h-12 my-1 rounded-xl'>
                <div className='flex justify-center items-center w-4/6'>
                    {MenuDrinkName}
                </div>
                <div className="flex justify-evenly w-1/6">
                    {MenuDrinkPrice}
                </div>
                <div className='w-1/6'>
                    {AmountSold}
                </div>
            </div>
        </div>
    );
}