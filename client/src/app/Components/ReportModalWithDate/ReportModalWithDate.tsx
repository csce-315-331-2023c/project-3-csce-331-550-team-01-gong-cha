"use client"

import React, { useState, useEffect } from 'react'
import SalesReportItem from '../TabelItems/SalesReportItem/SalesReportItem'
import SoldTogetherItem from '../TabelItems/SoldTogetherItem/SoldTogetherItem'
import ExcessItem from '../TabelItems/excessItens/excessItems'
import './styles.css'
import ExcessItems from '../TabelItems/excessItens/excessItems'

interface ModalProps {
    open: boolean;
    children: React.ReactNode;
    onClose: () => void;
    whichReport: number;
}


export default function ReportsModal({open, children, onClose, whichReport}: ModalProps) {

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const Conditional = ({condition, children,}: 
        {condition: boolean, children: React.ReactNode}) => {
            if(condition) return <>{children}</>;
            return <></>;
    };

    interface SalesReportItem {
        MenuDrinkName: string;
        MenuDrinkPrice: number;
        AmountSold: number;
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

    const [salesReportItems, setSalesReportItems] = useState<SalesReportItem[]>([]);
    const [soldTogetherItems, setSoldTogetherItems] = useState<SoldTogetherItem[]>([]);
    const [excessItems, setExcessItems] = useState<ExcessItem[]>([]);
    

    function saleReport(date1: string, date2: string){
        fetch(`http://18.191.166.59:5000/sales-report/:${date1}/:${date2}`) // Replace with the actual API endpoint URL
            .then((response) => {
                if (!response.ok) {
                alert("did not pass");
                throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                // Process the data received from the API and store it in the state
                
                const salesReportData: SalesReportItem[] = data.map((item: any) => ({
                    MenuDrinkName: item.MenuDrinkName,
                    MenuDrinkPrice: item.MenuDrinkPrice,
                    AmountSold: item.AmountSold
                }));
                setSalesReportItems(salesReportData);
            })
    }

    function usageReport(date1: string, date2: string){
        saleReport(date1, date2);
        const menuDrinkNames = salesReportItems.map((drinkName: SalesReportItem) => (
            drinkName.MenuDrinkName
        ));
        

        
    }

    function soldTogether(date1: string, date2: string){
        fetch(`http://18.191.166.59:5000/sold-together/:${date1}/:${date2}`) // Replace with the actual API endpoint URL
            .then((response) => {
                if (!response.ok) {
                alert("did not pass");
                throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                // Process the data received from the API and store it in the state
                
                const soldTogetherData: SoldTogetherItem[] = data.map((item: any) => ({
                    MenuDrink1: item.MenuDrink1,
                    MenuDrink2: item.MenuDrink2,
                    SalesCount: item.SalesCount
                }));
                setSoldTogetherItems(soldTogetherData);
            })
    }

    function excess(date1: string){
        fetch(`http://18.191.166.59:5000/excess-report/:${date1}`) // Replace with the actual API endpoint URL
            .then((response) => {
                if (!response.ok) {
                alert("did not pass");
                throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                // Process the data received from the API and store it in the state
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
                    </div>
                    <div className='w-full -mt-2 flex justify-center'>
                        <button className='exit bg-rose-700 rounded-xl font-semibold text-slate-200 text-3xl' onClick={() => onClose()}>Exit</button>
                    </div>
                </div>
            </div>
        </div>

    );
}
