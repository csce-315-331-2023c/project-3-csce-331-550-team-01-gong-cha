'use clinet'
import React, { useState, useEffect, useCallback } from 'react'
import FullMenuItem from '../TabelItems/FullMenuItem/FullMenuItem'
import './styles.css'

interface ModalProps {
    open: boolean;
    children: React.ReactNode;
    onClose: () => void;
}

export default function FullMenu({open, children, onClose}: ModalProps){

    type Drink = {
        id: number;
        name: string;
        normal_cost: number;
        large_cost: number;
        norm_consumer_price: number;
        lg_consumer_price: number;
        category_id: number;
      };

    const [rowOne, setRowOne] = useState<Drink[]>([]);
    const [rowTwo, setRowTwo] = useState<Drink[]>([]);
    const [rowThree, setRowThree] = useState<Drink[]>([]);
    const [rowFour, setRowFour] = useState<Drink[]>([]);
    const [rowFive, setRowFive] = useState<Drink[]>([]);


    const [called, setCalled] = useState(false);

    const [cats, setCats] = useState<Drink[]>([]);

    const doMath = useCallback(async () => {
        
            setCats([]);
            var numDrinks: number = parseInt(await getNumDrink()) + 8;
            const amountPerRow = Math.floor(numDrinks / 5);
            const remainder = numDrinks % 5;

            var counter: number = 0;
            const categoryNames = ['Milk Teas', 'Tea Lattes', 'Creative Mixes', 'Brewed Teas', 'Milk Foam Teas', 'Coffees', 'Slush Drinks', 'Seasonal Drinks'];

            for(let idx = 1; idx < 9; idx++){
                cats.push({id: 0, name: categoryNames[idx - 1], normal_cost: 0, large_cost: 0, norm_consumer_price: 0, lg_consumer_price: 0, category_id: 10})
                var drinkJson = await getDrinks(idx);
                var drinkArray = (await drinkJson).drinks;
                await drinkArray.map((item: any) => (cats.push({
                    id: item.id,
                    name: item.name,
                    normal_cost: item.normal_cost,
                    large_cost: item.large_cost,
                    norm_consumer_price: item. norm_consumer_price,
                    lg_consumer_price: item.lg_consumer_price,
                    category_id: item.category_id
                })));
            }
            console.log(numDrinks);
            console.log(cats);

            const firstEnd = remainder > 0 ? amountPerRow + 1: amountPerRow;
            const secEnd = remainder > 1 ? firstEnd * 2 : amountPerRow + firstEnd;
            const thirdEnd = remainder > 2 ? firstEnd * 3 : amountPerRow + secEnd;
            const fourthEnd = remainder > 3 ? firstEnd * 4 : amountPerRow + thirdEnd;

            await setRowOne(cats.slice(0, firstEnd - 1));
            await setRowTwo(cats.slice(firstEnd, secEnd - 1));
            await setRowThree(cats.slice(secEnd - 1, thirdEnd- 1));
            await setRowFour(cats.slice(thirdEnd - 1, fourthEnd-1));
            await setRowFive(cats.slice(fourthEnd-1));


    }, [getDrinks, getNumDrink, cats]); //getDrinks, getNumDrink, cats

    async function getDrinks(pk: number){
        const response = await fetch(`http://18.191.166.59:5000/drinks-from-category/${pk}`);
        return await response.json();
    }

    async function getNumDrink(){
        const response = await fetch('http://18.191.166.59:5000/get-offered-menu-drinks', {method: "GET"}) // Replace with the actual API endpoint URL
        const val = await response.json()
        const num = await val.offered_menu_drinks_count;
        return num
    }

    useEffect(() => {
        if(!called){
            setCalled(true);
            doMath();
        }
    }, [doMath])

    if (!open) return null

    return (
        <div>
            <div className='Overlay_Styles'>
                <div className='Modal_Styles bg-slate-200 border-8 border-rose-700 rounded-3xl flex-col items-center justify-start'>
                    <div className='text-rose-700 font-semibold text-5xl -mt-8 mb-4'>Gong Cha Menu</div>
                    <div className='flex w-full justify-center bg-rose-700 rounded-xl'>
                        <div className='flex roww justify-evenly text-lg font-bold text-slate-200'>
                            <div className='namee'>Name</div>
                            <div className=''>$N</div>
                            <div className=''>$L</div>
                        </div>
                        <div className='flex roww justify-evenly text-lg font-bold text-slate-200'>
                            <div className='namee'>Name</div>
                            <div className=''>$N</div>
                            <div className=''>$L</div>
                        </div>
                        <div className='flex roww justify-evenly text-lg font-bold text-slate-200'>
                            <div className='namee'>Name</div>
                            <div className=''>$N</div>
                            <div className=''>$L</div>
                        </div>
                        <div className='flex roww justify-evenly text-lg font-bold text-slate-200'>
                            <div className='namee'>Name</div>
                            <div className=''>$N </div>
                            <div className=''>$L </div>
                        </div>
                        <div className='flex roww justify-evenly text-lg font-bold text-slate-200'>
                            <div className='namee'>Name</div>
                            <div className=''>$N</div>
                            <div className=''>$L</div>
                        </div>


                    </div>
                    <div className='menuu flex w-full justify-center'>
                        <div className='roww flex-col overflow-auto w-1/6'>
                            {rowOne.map((item, index) => (
                                <FullMenuItem 
                                    key={index}
                                    MenuDrinkName={item.name}
                                    NormalPrice={item.norm_consumer_price}
                                    LargePrice={item.lg_consumer_price}
                                    category_id={item.category_id}
                                />
                            ))}
                        </div>
                        <div className='roww flex-col overflow-auto w-1/6'>
                            {rowTwo.map((item, index) => (
                                <FullMenuItem 
                                    key={index}
                                    MenuDrinkName={item.name}
                                    NormalPrice={item.norm_consumer_price}
                                    LargePrice={item.lg_consumer_price}
                                    category_id={item.category_id}
                                />
                            ))}
                        </div>
                        <div className='roww flex-col overflow-auto w-1/6'>
                            {rowThree.map((item, index) => (
                                <FullMenuItem 
                                    key={index}
                                    MenuDrinkName={item.name}
                                    NormalPrice={item.norm_consumer_price}
                                    LargePrice={item.lg_consumer_price}
                                    category_id={item.category_id}
                                />
                            ))}
                        </div>
                        <div className='roww flex-col overflow-auto w-1/6'>
                            {rowFour.map((item, index) => (
                                <FullMenuItem 
                                    key={index}
                                    MenuDrinkName={item.name}
                                    NormalPrice={item.norm_consumer_price}
                                    LargePrice={item.lg_consumer_price}
                                    category_id={item.category_id}
                                />
                            ))}
                        </div>
                        <div className='roww flex-col overflow-auto w-1/6'>
                            {rowFive.map((item, index) => (
                                <FullMenuItem 
                                    key={index}
                                    MenuDrinkName={item.name}
                                    NormalPrice={item.norm_consumer_price}
                                    LargePrice={item.lg_consumer_price}
                                    category_id={item.category_id}
                                />
                            ))}
                        </div>
                    </div>
                    <button className='exitt bg-rose-700 rounded-xl text-3xl font-semibold text-slate-200 mt-6 w-1/5 -mb-8' onClick={onClose}>Exit</button>
                </div>
            </div>
        </div>
    );
}