"use client"

import React, { useState, useEffect } from 'react'
import SalesReportItem from '../TabelItems/SalesReportItem/SalesReportItem'
import SoldTogetherItem from '../TabelItems/SoldTogetherItem/SoldTogetherItem'
import './styles.css'

interface ModalProps {
    open: boolean;
    children: React.ReactNode
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

    const [salesReportItems, setSalesReportItems] = useState<SalesReportItem[]>([]);
    const [soldTogetherItems, setSoldTogetherItems] = useState<SoldTogetherItem[]>([]);

    function saleReport(date1: string, date2: string){
        fetch(`http://18.191.166.59:5000/salesReport/:${date1}/:${date2}`) // Replace with the actual API endpoint URL
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

    function soldTogether(date1: string, date2: string){
        fetch(`http://18.191.166.59:5000/soldTogether/:${date1}/:${date2}`) // Replace with the actual API endpoint URL
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

    if (!open) return null

    return (
        <div>
            <div className='Overlay_Styles'>
                <div className='Modal_Styles bg-slate-400 flex items-center justify-start'>
                    <div className='mb-8 text-2xl'>{children}</div>
                    <Conditional condition={whichReport === 0}>
                        <div className='w-4/5'>
                            <div className='bg-cyan-300 font-bold w-full flex justify-evenly border-white border-2 h-10'>
                                <div className='flex justify-center items-center w-4/6'>
                                    Topping Name
                                </div>
                                <div className="flex justify-evenly w-1/6">
                                    Topping Price
                                </div>
                                <div className='w-1/6'>
                                    Amount Sold
                                </div>
                            </div>
                        </div>
                        <div className="flex-col justify-evenly border-white border-2 rounded-md h-full w-4/5 overflow-auto">
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
                        <div className='w-4/5'>
                            <div className='bg-cyan-300 font-bold w-full flex justify-evenly border-white border-2 h-10'>
                                <div className='flex justify-center items-center w-2/6'>
                                    Drink 1 Name
                                </div>
                                <div className="flex justify-evenly w-2/6">
                                    Drink 2 Name
                                </div>
                                <div className='w-2/6'>
                                    Amount Sold Together
                                </div>
                            </div>
                        </div>
                        <div className="flex-col justify-evenly border-white border-2 rounded-md h-full w-4/5 overflow-auto">
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
                
                    <div className=' h-1/6 w-full mb-8 mt-10 flex justify-center'>
                        <input className='bg-cyan-200 h-full w-1/6 mx-8' type="startDate" id="startDate" placeholder="Start: YYYY-MM-DD" value={startDate} onChange={(e) => setStartDate(e.target.value)}/>
                        <div className='text-6xl h-full mx-1'>-</div>
                        <input className='bg-cyan-200 h-full w-1/6 mx-8' type="endDate" id="endDate" placeholder="End: YYYY-MM-DD" value={endDate} onChange={(e) => setEndDate(e.target.value)}/>
                        <Conditional condition={whichReport === 0}>
                            <button className='bg-cyan-200 h-full w-1/6 mx-8' onClick={() => saleReport(startDate, endDate)}>Enter Range</button>
                        </Conditional>
                        <Conditional condition={whichReport === 1}>
                            <button className='bg-cyan-200 h-full w-1/6 mx-8' onClick={() => soldTogether(startDate, endDate)}>Enter Range</button>
                        </Conditional>
                    </div>
                    <button className='bg-cyan-200 h-2/6 w-1/6 mb-8 mt-5' onClick={() => onClose()}>Exit</button>
                </div>
            </div>
        </div>

    );
}
