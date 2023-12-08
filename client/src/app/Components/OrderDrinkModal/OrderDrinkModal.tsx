'use clinet'
import React, { useState, useEffect, useCallback, useReducer } from 'react';
import OrderItem from '../TabelItems/OrderItem/OrderItem';
import './styles.css'
import OrderDrink from '../OrderDrink/OrderDrink';

interface ModalProps {
    open: boolean;
    children: React.ReactNode;
    OrderId: number;
    onClose: () => void;
    setAdding: (b: boolean) => any;
    closeAll: () => any;
}

export default function OrderDrinkModal({open, children, onClose, setAdding, closeAll, OrderId}: ModalProps){

    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

    const [size, setSize] = useState<string>('');
    const [ice, setIce] = useState<string>('');
    const [sugar, setSugar] = useState<string>('');

    const [opened, setOpened] = useState<boolean>(false);


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

    const [orderDrinkArray, setOrderDrinkArray] = useState<OrderDrink[]>([]);
    const [date, setDate] = useState<string>('');

    async function getOrderDrinks(){
        const response = await fetch(`http://18.191.166.59:5000/get-orders-of-day/${date}`) // Replace with the actual API endpoint URL

        const orderA = await response.json();
 
        const orderDrinks: OrderDrink[] = await orderA.map((item: any) => ({
            id: item.id,
            total_price: item.total_price,
            size: item.size,
            menu_drink_id: item.menu_drink_id,
            ice_level: item.ice_level,
            sugar_level: item.sugar_level,
        }));

        orderDrinks.forEach(async (orderDrink: OrderDrink) => {
            const response = await fetch(`http://18.191.166.59:5000/get-orders-of-day/${date}`)
            const drinkNameJson = await response.json();
            orderDrink.name = drinkNameJson.drinkName;
        });

        setOrderDrinkArray(orderDrinks);
    } 

    useEffect(() =>{
        if(!opened){
            setOpened(false);
            getOrderDrinks();
        }
    })

    if (!open) return null

    return(
        <div>
            <div className='Overlay_StylesO'>
                    <div className='Modal_StylesO bg-slate-200 border-8 border-rose-700 rounded-3xl flex items-center justify-start'>
                        <div className='text-6xl text-rose-700 font-bold my-6'>
                            Edit Orders
                        </div>
                        <div className='w-full flex justify-center'>
                            <div className='employeeHolder flex justify-center h-10 mb-1 rounded-xl bg-rose-700'>
                                <div className='employeeHolder flex justify-start'>
                                <div className='prices w-2/6 flex justify-center items-center  text-center rounded-lg outline-none text-slate-200 font-bold'>ID</div>
                                <div className='name w-2/6 flex justify-center items-center  text-center rounded-lg outline-none text-slate-200 font-bold'>Time</div>
                                <div className='name w-2/6 flex justify-center items-center  text-center rounded-lg outline-none text-slate-200 font-bold'>Name</div>
                                <div className='prices w-2/6 flex justify-center items-center  text-center rounded-lg outline-none text-slate-200 font-bold'>Price</div>
                                <div className='prices w-2/6 flex justify-center items-center  text-center rounded-lg outline-none text-slate-200 font-bold'>Tip</div>
                                <div className='ingredient flex justify-center items-center w-1/6'>
                                    <div className={`w-full items-center mr-2 rounded-lg h-5/6 text-slate-200 font-bold`}>Status</div>
                                </div>
                                <div className='ingredient flex justify-center items-center w-1/6'>
                                    <div className="w-full bg-rose-700 items-center mr-2 rounded-lg h-5/6 text-slate-200 font-bold">Edit</div>
                                </div>
                                <div className='buttonn w-1/6 flex items-center justify-center'>
                                    <div className="bg-rose-700 w-full h-5/6 items-center rounded-lg mr-1 text-slate-200 font-bold">Delete</div>
                                </div>
                                </div>
                            </div>
                        </div>
                        <div className='employeeHolder h-3/5'>
                            <div className="ingredientTabel flex-col justify-center items-center border-rose-700 border-4 h-full w-full overflow-auto rounded-xl">
                                {orderDrinkArray.map((item, index) => (
                                    <OrderItem
                                        key={index}
                                        id={item.id}
                                        price={item.price}
                                        name={item.name}
                                        takeout={item.takeout}
                                        date={item.date}
                                        time={item.time}
                                        status={item.status}
                                        openEditor={openEditor}
                                        tip={item.tip}
                                        setPk={setOPk}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className='buttton1 flex justify-evenly w-full mt-4'>
                            <input className='w-2/6 h-5/6 bg-slate-100 mx-4 border-4 border-rose-700 rounded-xl text-2xl outline-none text-rose-700 text-center' type="startDate" id="startDate" placeholder="Start: YYYY-MM-DD" value={date} onChange={(e) => setDate(e.target.value)}/>
                            <button className='w-2/6 h-5/6 bg-rose-700 text-slate-200 text-4xl font-semibold rounded-xl' onClick={() => getOrders()}>Enter</button>
                        </div>  
                        <div className='buttton1 w-full flex justify-center items-center mt-6'>
                            <button className='h-5/6 -mt-6 w-2/6 bg-rose-700 rounded-xl text-slate-200 text-4xl font-semibold' onClick={onClose}>Exit</button>
                        </div>
                    </div>
            </div>

        </div>
    );

}