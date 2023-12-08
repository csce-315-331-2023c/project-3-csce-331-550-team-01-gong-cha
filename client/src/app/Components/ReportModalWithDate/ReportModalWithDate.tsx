"use client"

import React, { useState, useEffect, useReducer } from 'react'
import SalesReportItem from '../TabelItems/SalesReportItem/SalesReportItem'
import SoldTogetherItem from '../TabelItems/SoldTogetherItem/SoldTogetherItem'
import ExcessItem from '../TabelItems/excessItens/excessItems'
import './styles.css'
import ExcessItems from '../TabelItems/excessItens/excessItems'
import UsageItem from '../TabelItems/UsageItem/UsageItem'
import { useForceUpdate } from 'framer-motion'

interface ModalProps {
    open: boolean;
    children: React.ReactNode;
    onClose: () => void;
    whichReport: number;
}

export default function ReportsModal({open, children, onClose, whichReport}: ModalProps) {

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [seed, setSeed] = useState(1);  
    

    const [opened, setOpened] = useState(false);

    const reset = () => {
        setSeed(Math.random());
    }

    const Conditional = ({condition, children,}: 
        {condition: boolean, children: React.ReactNode}) => {
            if(condition) return <>{children}</>;
            return <></>;
    };

    interface SalesReportItem {
        MenuDrinkName: string;
        MenuDrinkPrice: number;
        AmountSold: number;
        MenuDrinkID: number;
    }

    interface SoldTogetherItem {
        MenuDrink1: string;
        MenuDrink2: number;
        SalesCount: number;
    }

    interface ExcessItem {
        IngredientName: string;
        IngredientNumber: number;
    }

    interface UsageItem{
        ingredientName: string;
        amountUsed: number;
    }

    const [salesReportItems, setSalesReportItems] = useState<SalesReportItem[]>([]);
    const [soldTogetherItems, setSoldTogetherItems] = useState<SoldTogetherItem[]>([]);
    const [excessItems, setExcessItems] = useState<ExcessItem[]>([]);
    const [usageItems, setUsageItems] = useState<[string, number][]>([]);
    
    async function saleReport(date1: string, date2: string){

        const response = await fetch(`http://18.223.2.65:5000/sales-report/${date1}/${date2}`);
        const responseJson = await response.json();
        var salesReportData: SalesReportItem[] = await responseJson.map((item: any) => ({
            MenuDrinkName: item.MenuDrinkName,
            MenuDrinkPrice: item.MenuDrinkPrice,
            AmountSold: parseInt(item.AmountSold),
            MenuDrinkID: item.MenuDrinkID
        }));
        //console.log(salesReportData);
        setSalesReportItems(salesReportData);
    }

    useEffect(() => {
        if(whichReport === 3 && opened){
            setOpened(false);
            usageReportCalcs()
        }    
    }, [salesReportItems, opened])

    async function usageReportCalcs(){
        const menuDrinkIds: [number, number][] = salesReportItems.map((drink: SalesReportItem) => (
            [drink.MenuDrinkID, drink.AmountSold]
        ));

        menuDrinkIds.forEach(async (drink: [number, number]) => {

            const response = await fetch(`http://18.223.2.65:5000/ingredients-for-menu-drinks/${drink[0]}`);
            const responseJson = await response.json();
            let localAmount = drink[1];
            await responseJson[0].forEach(async (id: number) => {
                    
                const response2 = await fetch(`http://18.223.2.65:5000/get-ingredient-name/${id}`);
                const response2Json = await response2.json();
                updateIngredientAmounts(response2Json.ingredientName, localAmount);
            })
        })
        console.log(usageItems);
        // reset();
        // setIgnore(!ignore);
        // setUsageItems()
        // setUsageItems((items) => {
        //     return [...items, ["why", 2]];
        // });
        //window.location.reload();
    }

    async function usageReport(date1: string, date2: string){
        console.log(usageItems);
        setUsageItems([]);
        await saleReport(date1, date2);
        setOpened(true);
        // await usageReportCalcs();
        // setUsageItems(usageItems);
        // console.log(usageItems);
        // reset();
    }

    // useEffect(() => {
    //     // setUsageItems((items) => {
    //     //     return [...items];
    //     // });
    //     // reset();
    // }, [usageItems])

    // useEffect(() => {

    // });

    const [ignore, setIgnore] = useState(false);

    function updateIngredientAmounts(ingredientName: string, amount: number) {
        if(!usageItems.find((item) => item[0] === ingredientName)){
            //console.log(usageItems);
            usageItems.push([ingredientName, amount]);
        }
        else{
            const item = usageItems.find((item) => item[0] === ingredientName);
            if (item){
                item[1] = item[1] + 1;
            }
        }
        setIgnore(!ignore);

        // if(!usageItems.find((item) => item[0] === ingredientName)){
        //     console.log(usageItems);
        //     var mut = [...usageItems];
        //     mut.push([ingredientName, amount]);
        //     setUsageItems(mut); 
        // }
        // else{
        //     var mut = [...usageItems];
        //     var neww = mut.find((item) => item[0] === ingredientName);
        //     if (neww){
        //         neww[1] = neww[1] + 1;
        //     }
            
        //     setUsageItems(mut); 
        // }
    }
    

    function soldTogether(date1: string, date2: string){
        fetch(`http://18.223.2.65:5000/sold-together/:${date1}/:${date2}`) // Replace with the actual API endpoint URL
            .then((response) => {
                if (!response.ok) {
                // alert("did not pass");
                throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                const soldTogetherData: SoldTogetherItem[] = data.map((item: any) => ({
                    MenuDrink1: item.MenuDrink1,
                    MenuDrink2: item.MenuDrink2,
                    SalesCount: item.SalesCount
                }));
                setSoldTogetherItems(soldTogetherData);
            })
    }

    function excess(date1: string){
        fetch(`http://18.223.2.65:5000/excess-report/:${date1}`) // Replace with the actual API endpoint URL
            .then((response) => {
                if (!response.ok) {
                // alert("did not pass");
                throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                const excessData: ExcessItem[] = data.map((item: any) => ({
                    IngredientName: item.Ingredient_Name,
                    IngredientNumber: item.Ingredient_ID
                }));
                setExcessItems(excessData);
            })
    }
    
    if (!open) return null

    return (
        <div>
            <div className='Overlay_Styles'>
                <div className='Modal_Styles bg-slate-200 flex items-center justify-start border-rose-700 border-8 rounded-3xl'>
                    <div className='mb-8 text-5xl font-semibold text-rose-700'>{children}</div>
                    <Conditional condition={whichReport === 0}>
                        <div className='w-full'>
                            <div className='bg-rose-700 font-bold text-slate-200 text-xl w-full flex justify-evenly h-14 rounded-xl mb-2'>
                                <div className='flex justify-center items-center w-4/6'>
                                    Topping Name
                                </div>
                                <div className="flex justify-evenly w-1/6 items-center">
                                    Topping Price
                                </div>
                                <div className='w-1/6 items-center'>
                                    Amount Sold
                                </div>
                            </div>
                        </div>
                        <div className="viewer flex-col justify-evenly border-rose-700 border-4 rounded-md h-full w-full overflow-auto">
                        {salesReportItems.map((salesReportItem, index) => (
                            <SalesReportItem
                                key={index}
                                MenuDrinkName={salesReportItem.MenuDrinkName}
                                MenuDrinkPrice={salesReportItem.MenuDrinkPrice}
                                AmountSold={salesReportItem.AmountSold}
                            />
                        ))}
                        </div>
                    </Conditional>
                    <Conditional condition={whichReport === 1}>
                        <div className='w-full'>
                            <div className='bg-rose-700 font-bold text-slate-200 text-xl w-full flex justify-evenly h-14 rounded-xl mb-2'>
                                <div className='flex justify-center items-center w-2/6'>
                                    Drink 1 Name
                                </div>
                                <div className="flex justify-evenly w-2/6 items-center">
                                    Drink 2 Name
                                </div>
                                <div className='flex w-2/6 items-center'>
                                    Amount Sold Together
                                </div>
                            </div>
                        </div>
                        <div className="flex-col justify-evenly border-white border-2 rounded-md h-full w-full overflow-auto">
                        {soldTogetherItems.map((soldTogethertItem, index) => (
                            <SoldTogetherItem
                                key={index}
                                MenuDrink1={soldTogethertItem.MenuDrink1}
                                MenuDrink2={soldTogethertItem.MenuDrink2}
                                SalesCount={soldTogethertItem.SalesCount}
                            />
                        ))}
                        </div>
                    </Conditional>
                    <Conditional condition={whichReport === 2}>
                        <div className='w-full'>
                            <div className='bg-rose-700 font-bold text-slate-200 text-xl w-full flex justify-center h-14 rounded-xl mb-2'>
                                <div className='flex justify-center items-center w-2/6'>
                                    Drink Name
                                </div>
                            </div>
                        </div>
                        <div className="flex-col justify-evenly border-white border-2 rounded-md h-full w-full overflow-auto">
                        {excessItems.map((soldTogethertItem, index) => (
                            <ExcessItem
                                key={index}
                                IngredientName={soldTogethertItem.IngredientName}
                                IngredientNumber={soldTogethertItem.IngredientNumber}
                            />
                        ))}
                        </div>
                    </Conditional>
                    <Conditional condition={whichReport === 3}>
                        <div className='w-full'>
                            <div className='bg-rose-700 font-bold text-slate-200 text-xl w-full flex justify-center h-14 rounded-xl mb-2'>
                                <div className='flex justify-center items-center w-4/6'>
                                    Ingredient Name
                                </div>
                                <div className='flex justify-center items-center w-1/6'>
                                    Amount
                                </div>
                            </div>
                        </div>
                        <div className="flex-col justify-evenly border-white border-2 rounded-md h-full w-full overflow-auto">
                            {usageItems.map((usageItem, index) => (
                                <UsageItem
                                    key={index}
                                    ingredientName={usageItem[0]}
                                    amountUsed={usageItem[1]}
                                />
                            ))}
                        </div>
                    </Conditional>
                
                    <div className='h-1/6 w-full mb-8 mt-10 flex justify-center'>
                       
                        {whichReport === 2 ?
                            <input className='input bg-slate-100 h-full mx-4 border-4 border-rose-700 rounded-xl text-md outline-none text-rose-700 text-center' type="startDate" id="startDate" placeholder="Start: YYYY-MM-DD" value={startDate} onChange={(e) => setStartDate(e.target.value)}/>
                            :
                            <div className='w-full flex justify-center'>
                                <input className='input bg-slate-100 h-full mx-4 border-4 border-rose-700 rounded-xl text-md outline-none text-rose-700 text-center' type="startDate" id="startDate" placeholder="Start: YYYY-MM-DD" value={startDate} onChange={(e) => setStartDate(e.target.value)}/>
                                <div className='text-6xl text-rose-700 h-full mx-1'>-</div>
                                <input className='input bg-slate-100 h-full mx-4 border-4 border-rose-700 rounded-xl outline-none text-rose-700 text-center' type="endDate" id="endDate" placeholder="End: YYYY-MM-DD" value={endDate} onChange={(e) => setEndDate(e.target.value)}/>
                            </div>
                        }
                        <Conditional condition={whichReport === 0}>
                            <button className='button bg-rose-700 h-full mx-8 border-4 border-rose-700 rounded-xl text-slate-200 font-semibold text-2xl' onClick={() => saleReport(startDate, endDate)}>Enter Range</button>
                        </Conditional>
                        <Conditional condition={whichReport === 1}>
                            <button className='button bg-rose-700 h-full mx-8 border-4 border-rose-700 rounded-xl text-slate-200 font-semibold text-2xl' onClick={() => soldTogether(startDate, endDate)}>Enter Range</button>
                        </Conditional>
                        <Conditional condition={whichReport === 2}>
                            <button className='button bg-rose-700 h-full mx-8 border-4 border-rose-700 rounded-xl text-slate-200 font-semibold text-2xl' onClick={() => excess(startDate)}>Enter Range</button>
                        </Conditional>
                        <Conditional condition={whichReport === 3}>
                            <button className='button bg-rose-700 h-full mx-8 border-4 border-rose-700 rounded-xl text-slate-200 font-semibold text-2xl' onClick={() => usageReport(startDate, endDate)}>Enter Range</button>
                        </Conditional>
                    </div>
                    <div className='w-full -mt-2 flex justify-center'>
                        <button className='exit bg-rose-700 rounded-xl font-semibold text-slate-200 text-3xl' onClick={() => onClose()}>Exit</button>
                    </div>
                </div>
            </div>
        </div>

    );
}
