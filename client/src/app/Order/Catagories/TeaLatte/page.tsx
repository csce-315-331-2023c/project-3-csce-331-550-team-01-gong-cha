"use client"
import Modal from '@/app/Components/Modal/Modal'
import { useEffect, useState } from 'react';
import MenuItem from '../../../Components/MenuItem/MenuItem'
import defualtDrinkImg from '../../../../../public/defualtDrinkImg.png'
import OrderDrink from '../../../Components/OrderDrink/OrderDrink'
import '../../styles.css'
import CategoryPage from '../../../Components/CategoryPage/CategoryPage';

export default function Order() {
      type Drink = {
        id: number;
        name: string;
        normal_cost: number;
        large_cost: number;
        norm_consumer_price: number;
        lg_consumer_price: number;
      };
    
    const [drinks, setDrinks] = useState([]);
    useEffect(() => {
        
          fetch('http://18.191.166.59:5000/drinks-from-category/2') // Replace with the actual API endpoint URL
            .then((response) => {
              if (!response.ok) {
                alert("did not pass");
                throw new Error('Network response was not ok');
              }
              return response.json();
            })
            .then((data) => {
                const drinkNames = data.drinks.map((drink : Drink) => drink);
                setDrinks(drinkNames);
              })
            .catch((error) => {
              console.error('There was a problem with the fetch operation:', error);
            });
        }
      , []);
    return (
        <main className="backgroundS bg-slate-400 bg-cover w-screen w-screenflex-row flex flex-col h-full">
            <div className='catagoryContainer w-screen w-screenflex-row flex h-full'>
                <div className="flex items-center justify-start w-full h-full">
                <CategoryPage categoryDrinks={drinks}></CategoryPage> 
                </div>

                
            </div>
        </main>
    );
}