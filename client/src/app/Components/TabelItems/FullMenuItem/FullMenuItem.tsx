"use client"

import "./styles.css"

interface FullMenuProps {
    MenuDrinkName: string;
    LargePrice: number;
    NormalPrice: number;
    category_id: number;
}

export default function FullMenuItem({MenuDrinkName, NormalPrice, LargePrice, category_id }: FullMenuProps){

    return(
        <div className="flex w-full justify-center">
            { !category_id ?
            <div className={`bg-rose-700 text-slate-200 text-sm inner w-full flex justify-evenly font-semibold h-10 mt-1 rounded-lg`}>
                <div className={`namee flex justify-center items-center rows`}>
                    {MenuDrinkName}
                </div>
                <div className="flex justify-evenly items-center">
                    {NormalPrice}
                </div>
                <div className='flex items-center'>
                    
                </div>
                <div className='flex items-center'>
                    {LargePrice}
                </div>
            </div>
            :
            <div className={`bg-slate-200 text-rose-700 text-md inner w-full flex justify-evenly font-bold h-10 mt-1 rounded-lg`}>
                <div className={`namee flex justify-center items-center rows`}>
                    {MenuDrinkName}
                </div>
            </div>
            }
        </div>
    );
}