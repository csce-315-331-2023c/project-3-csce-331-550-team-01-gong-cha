"use client"

interface SalesReportProps {
    MenuDrinkName: string;
    MenuDrinkPrice: number;
    AmountSold: number;
}

export default function SalesReportIngredient({MenuDrinkName, MenuDrinkPrice, AmountSold}: SalesReportProps){

    return(
        <div className='bg-cyan-200 w-full flex justify-evenly border-white border-2 h-10'>
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
    );
}