"use client"

import Image from 'next/image'
import React, { Component } from 'react';
import MenuItem from '../../../Components/MenuItem/MenuItem'
import defualtDrinkImg from '../../../../../public/defualtDrinkImg.png'
import { useState } from 'react';
//import Button from 'react-bootstrap/Button';
import Modal from '../../../Components/Modal/Modal';  
import OrderDrink from '../../../Components/OrderDrink/OrderDrink';
import { clear } from 'console';



export default function MilkFoam() {
  const [isOpen, setIsOpen] = useState(false)
 

  interface orderDrink {
    name: string;
    ice: number;
    sugar: number;
    sz: number;
  }

const [drinksState, setDrinksState] = useState<orderDrink[]>([]);
const clearOrders = () => {
  setDrinksState([]);
} 


  return (
    <main className="bg-slate-400 bg-cover h-screen w-screen w-screenflex-row flex">
      <div className="flex flex-col items-center justify-start w-2/5 h-screen m-4">
          <div className='h-1/5 w-full m-4'>    
              <MenuItem drinkName={"Some Drink"} drinkImage={defualtDrinkImg} altTxt={"Test Drink"} thisOnClick={() => setIsOpen(true)}/>
              <Modal open={isOpen} onClose={() => setIsOpen(false)} drinkName={"Some Drink"} setDrinkState={setDrinksState} >Customize Ingredients</Modal>
          </div>
          <div className='h-1/5 w-full m-4'>
              <MenuItem drinkName={"Some Drink"} drinkImage={defualtDrinkImg} altTxt={"Test Drink"} thisOnClick={() => setIsOpen(true)}/>
              <Modal open={isOpen} onClose={() => setIsOpen(false)} drinkName={"Some Drink"} setDrinkState={setDrinksState} >Customize Ingredients</Modal>
          </div>
          <div className='h-1/5 w-full m-4'>
              <MenuItem drinkName={"Some Drink"} drinkImage={defualtDrinkImg} altTxt={"Test Drink"} thisOnClick={() => setIsOpen(true)}/>
              <Modal open={isOpen} onClose={() => setIsOpen(false)} drinkName={"Some Drink"} setDrinkState={setDrinksState} >Customize Ingredients</Modal>
          </div>
          <div className='h-1/5 w-full m-4'>
              <MenuItem drinkName={"Some Drink"} drinkImage={defualtDrinkImg} altTxt={"Test Drink"} thisOnClick={() => setIsOpen(true)}/>
              <Modal open={isOpen} onClose={() => setIsOpen(false)} drinkName={"Some Drink"} setDrinkState={setDrinksState} >Customize Ingredients</Modal>
          </div>
      </div>
      <div className="flex flex-col items-center justify-start w-2/5 h-screen  m-4">
          <div className='h-1/5 w-full m-4'>
              <MenuItem drinkName={"Some Drink"} drinkImage={defualtDrinkImg} altTxt={"Test Drink"} thisOnClick={() => setIsOpen(true)}/>
              <Modal open={isOpen} onClose={() => setIsOpen(false)} drinkName={"Some Drink"} setDrinkState={setDrinksState} >Customize Ingredients</Modal>
          </div>
          <div className='h-1/5 w-full m-4'>
              <MenuItem drinkName={"Some Drink"} drinkImage={defualtDrinkImg} altTxt={"Test Drink"} thisOnClick={() => setIsOpen(true)}/>
              <Modal open={isOpen} onClose={() => setIsOpen(false)} drinkName={"Some Drink"} setDrinkState={setDrinksState} >Customize Ingredients</Modal>
          </div>
          <div className='h-1/5 w-full m-4'>
              <MenuItem drinkName={"Some Drink"} drinkImage={defualtDrinkImg} altTxt={"Test Drink"} thisOnClick={() => setIsOpen(true)}/>
              <Modal open={isOpen} onClose={() => setIsOpen(false)} drinkName={"Some Drink"} setDrinkState={setDrinksState} >Customize Ingredients</Modal>
          </div>
          <div className='h-1/5 w-full m-4'>
              <MenuItem drinkName={"Some Drink"} drinkImage={defualtDrinkImg} altTxt={"Test Drink"} thisOnClick={() => setIsOpen(true)}/>
              <Modal open={isOpen} onClose={() => setIsOpen(false)} drinkName={"Some Drink"} setDrinkState={setDrinksState} >Customize Ingredients</Modal>
          </div>
      </div>

      <div className="w-1/5 ml-14 my-10">
  <div className="bg-white h-full w-4/5 border-gray border-4 rounded-2xl text-center"> Orders 
      {drinksState.length !== 0 && (
        <>
          {drinksState.map((drink, index) => (
      <OrderDrink
        key={index}
        drinkName={drink.name}
        sugar={drink.sugar}
        ice={drink.ice}
        size={drink.sz}
      />
          ))}
          <button onClick={clearOrders}>Place Order</button>
        </>
      )}
    
  </div>
</div>
    </main>
  );
}