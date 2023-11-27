"use client"
import Modal from '@/app/Components/Modal/Modal'
import { useEffect, useState } from 'react';
import MenuItem from '../../../Components/MenuItem/MenuItem'
import defualtDrinkImg from '../../../../../public/defualtDrinkImg.png'
import OrderDrink from '../../../Components/OrderDrink/OrderDrink'
import '../../styles.css'
import CategoryPage from '../../../Components/CategoryPage/CategoryPage';

export default function Order() {
    function goBack(){
        window.location.href = "../";
    }

    interface orderDrink {
        name: string;
        ice: number;
        sugar: number;
        sz: number;
      }

      type Drink = {
        id: number;
        name: string;
        normal_cost: number;
        large_cost: number;
        norm_consumer_price: number;
        lg_consumer_price: number;
      };
    
    const [drinks, setDrinks] = useState([]);

    const [loaded, setLoaded] = useState(false);

    //const drinkNames

    function getDrinks(){
      if(!loaded){
        fetch('http://18.191.166.59:5000/drinks-from-category/4') // Replace with the actual API endpoint URL
            .then((response) => {
              if (!response.ok) {
                alert("did not pass");
                throw new Error('Network response was not ok');
              }
              return response.json();
            })
            .then((data) => {
                //onst drinkNames = data.drinks.map((drink : Drink) => drink);
                setDrinks(data.drinks.map((drink : Drink) => drink));
              })
            .catch((error) => {
              console.error('There was a problem with the fetch operation:', error);
            });
            setLoaded(true);
      }
    }

    useEffect(() => {
        getDrinks();
        }
      , []);
    return (
        <main className="backgroundS bg-slate-400 bg-cover w-screen w-screenflex-row flex flex-col h-full">
            <button className='backContainter flex items-center' onClick={goBack}>
                <svg className='ml-4' xmlns="http://www.w3.org/2000/svg" height="5em" viewBox="0 0 448 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>
                <div className='ml-8 text-4xl'>Catagories</div>
                <div className='ml-80 text-6xl'>Tea Latte</div>
            </button>
            <div className='catagoryContainer w-screen w-screenflex-row flex h-full'>
                <div className="flex items-center justify-start w-full h-full">
                <CategoryPage categoryDrinks={drinks}></CategoryPage> 
                </div>

                
            </div>
        </main>
    );
}