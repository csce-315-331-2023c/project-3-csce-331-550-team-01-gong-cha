'use client'
import React, { useState, useEffect, useCallback, useReducer } from 'react';
import './styles.css'
import OrderDrinkItem from '../TabelItems/OrderDrink/OrderDrink';
import { useForceUpdate } from 'framer-motion';

interface ModalProps {
    open: boolean;
    children: React.ReactNode;
    OrderId: number;
    onClose: () => void;
    setAdding: (b: boolean) => any;
    closeAll: () => any;
    closeEdit: () => any;
}

export default function OrderDrinkModal({open, children, onClose, setAdding, closeAll, OrderId, closeEdit}: ModalProps){

    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

    const [size, setSize] = useState<string>('');
    const [ice, setIce] = useState<string>('');
    const [sugar, setSugar] = useState<string>('');

    const [opened, setOpened] = useState<boolean>(false);

    const [seed, reset] = useState(0);

    const [employeeIsA, setEmployeeIsA] = useState<boolean>(false);
    const [styleA, setStyleA] = useState<string>('bg-rose-700');
    const [styleM, setStyleM] = useState<string>('bg-rose-700');

    const [oPk, setOPk] = useState<number>(0);

    interface OrderDrink{
        id: number;
        total_price: number;
        size: number;
        menu_drink_id: number;
        ice_level: number;
        sugar_level: number;
        name: string;
    };

    var myDiv = [];

    const [orderDrinkArray, setOrderDrinkArray] = useState<OrderDrink[]>([]);
    
    function getOrderDrinks(){}

    // async function getOrderDrinks(){
    //     const response = await fetch(`http://18.223.2.65:5000/get-order-drinks-for-order/${OrderId}`) // Replace with the actual API endpoint URL
    //     //console.log(await response.json());
    //     const orderDrinkJson = await response.json();
 
    //     const orderDrinks: OrderDrink[] = [];
        
        // for(const id of orderDrinkJson){
        //     console.log(id);
        // }
       // orderDrinkJson.orderDrinkIDs.forEach(async (item: any) => {
            
            // console.log(item);
    //         const responseOD = await fetch(`http://18.223.2.65:5000/get-order-drink/${item}`)
    //         //console.log(await responseOD.json());
    //         const drinkJson = await responseOD.json();
            
    //         // console.log(drinkJson.orderDrink.menu_drink_id);
    //         const response3 = await fetch(`http://18.223.2.65:5000/get-drink/${drinkJson.orderDrink.menu_drink_id}`)
    //         // console.log(await response3.json());
    //         const name2 = await response3.json();
    //         // const drinkNameJson = await response.json();
    //         // const name2 = await drinkNameJson.drinkName;

    //         orderDrinks.push({id: drinkJson.orderDrink.id,
    //             total_price: drinkJson.orderDrink.total_price,
    //             size: drinkJson.orderDrink.size,
    //             menu_drink_id: drinkJson.orderDrink.menu_drink_id,
    //             ice_level: drinkJson.orderDrink.ice_level,
    //             sugar_level: drinkJson.orderDrink.sugar_level,
    //             name: name2.drinkName,
    //         });
    //     });
        
    //     setOrderDrinkArray(orderDrinks);
    //     forceUpdate();
    // }

    // async function kms(){
    //     await getOrderDrinks();
    //     setOrderDrinkArray([...orderDrinkArray]);
    // }

    // useEffect(() =>{
    //     // if(!opened && open){
    //         //setOrderDrinkArray([]);
    //         getOrderDrinks();
    //         // setOpened(true);
    //     // }
    // }, [])

    // useEffect(() =>{
        
    // })

    // useEffect(() => {
        //useForceUpdate();
        // myDiv = []
        // orderDrinkArray.forEach((item) => {
        //     myDiv.push(<OrderDrinkItem
        //         key={index}
        //         id={item.id}
        //         total_price={item.total_price}
        //         name={item.name}
        //         menu_drink_id={item.menu_drink_id}
        //         ice_level={item.ice_level}
        //         sugar_level={item.sugar_level}
        //         size={item.size}
        //     />);
        // });
    //     forceUpdate();
    // }, [orderDrinkArray])

    if (!open) return null

    return(
        <div>
            <div className='Overlay_StylesO'>
                    <div className='Modal_StylesO bg-slate-200 border-8 border-rose-700 rounded-3xl flex items-center justify-start'>
                        <div className='text-6xl text-rose-700 font-bold my-6'>
                            Edit Drinks In Order:
                        </div>
                        <div className='text-6xl text-rose-700 font-bold my-6'>
                            {OrderId}
                        </div>
                        <div className='w-full flex justify-center'>
                            <div className='employeeHolder flex justify-center h-10 mb-1 rounded-xl bg-rose-700'>
                            <div className='name flex justify-center items-center  text-center rounded-lg outline-none text-slate-200 font-bold'>Menu Drink</div>
                            <div className='prices flex justify-center items-center  text-center rounded-lg outline-none text-slate-200 font-bold'>Size</div>
                            <div className='prices flex justify-center items-center  text-center rounded-lg outline-none text-slate-200 font-bold'>Ice</div>
                            <div className='prices flex justify-center items-center  text-center rounded-lg outline-none text-slate-200 font-bold'>Sugar</div>
                            <div className='prices flex justify-center items-center  text-center rounded-lg outline-none text-slate-200 font-bold'>Price</div>
                            <div className='buttonn flex items-center'>
                                <div className="bg-rose-700 w-full h-5/6 items-center rounded-lg mr-1 text-slate-200">Delete</div>
                            </div>
                            </div>
                        </div>
                        <div className='employeeHolder h-3/5'>
                            <div key={seed} className="ingredientTabel flex-col justify-center items-center border-rose-700 border-4 h-full w-full overflow-auto rounded-xl">
                                {orderDrinkArray.map((item, index) => (
                                    <OrderDrinkItem
                                        key={index}
                                        id={item.id}
                                        total_price={item.total_price}
                                        name={item.name}
                                        menu_drink_id={item.menu_drink_id}
                                        ice_level={item.ice_level}
                                        sugar_level={item.sugar_level}
                                        size={item.size}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className='buttton1 w-full flex justify-center items-center mt-6'>
                            <button className='h-5/6 -mt-6 w-2/6 bg-rose-700 rounded-xl text-slate-200 text-4xl font-semibold' onClick={() => {setAdding(true), closeAll()}}>Add Drink</button>
                            <button className='h-5/6 -mt-6 w-2/6 bg-rose-700 rounded-xl text-slate-200 text-4xl font-semibold' onClick={() => {onClose(), setOpened(false), setOrderDrinkArray([])}}>Exit</button>
                        </div>
                    </div>
            </div>

        </div>
    );

                                }}