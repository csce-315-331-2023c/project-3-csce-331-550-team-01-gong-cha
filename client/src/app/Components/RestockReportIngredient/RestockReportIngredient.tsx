"use client"

interface IngredientProps {
    name: string;
    currentAmount: number;
    idealAmount: number;
}

export default function RestockReportIngredient({name, currentAmount, idealAmount}: IngredientProps){

    return(
        <div className='bg-cyan-200 w-full flex justify-evenly border-white border-2 h-10'>
            <div className='flex justify-center items-center w-4/6'>
                {name}
            </div>
            <div className="flex justify-evenly w-1/6">
                {currentAmount}
            </div>
            <div className='w-1/6'>
                {idealAmount}
            </div>
        </div>
    );
}