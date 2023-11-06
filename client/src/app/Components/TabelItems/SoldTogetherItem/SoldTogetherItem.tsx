"use client"

interface SoldTogetherProps {
    MenuDrink1: string;
    MenuDrink2: number;
    SalesCount: number;
}

export default function RestockReportIngredient({MenuDrink1, MenuDrink2, SalesCount}: SoldTogetherProps){

    return(
        <div className='bg-cyan-200 w-full flex justify-evenly border-white border-2 h-10'>
            <div className='flex justify-center items-center w-2/6'>
                {MenuDrink1}
            </div>
            <div className="flex justify-evenly w-2/6">
                {MenuDrink2}
            </div>
            <div className='w-2/6'>
                {SalesCount}
            </div>
        </div>
    );
}