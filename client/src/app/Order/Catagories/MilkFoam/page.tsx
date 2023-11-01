"use client"

import Image from 'next/image'
import React from 'react'
import MenuItem from '../../../Components/MenuItem/MenuItem'
import defualtDrinkImg from '../../../../../public/defualtDrinkImg.png'
import { useState } from 'react';
//import Button from 'react-bootstrap/Button';
import Modal from '../../../Components/Modal/Modal';  

export default function MilkFoam() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState({})
  
  const updateOptions = (options) => {
    setSelectedOptions(options);
  };


  return (
    <main className="bg-slate-400 bg-cover h-screen w-screen w-screenflex-row flex">
      <div className="flex flex-col items-center justify-start w-2/5 h-screen m-4">
          <div className='h-1/5 w-full m-4'>    
              <MenuItem drinkName={"Some Drink"} drinkImage={defualtDrinkImg} altTxt={"Test Drink"} thisOnClick={() => setIsOpen(true)}/>
              <Modal open={isOpen} onClose={() => setIsOpen(false)} updateOptions={updateOptions}>Customize Ingredients</Modal>
          </div>
          <div className='h-1/5 w-full m-4'>
              <MenuItem drinkName={"Some Drink"} drinkImage={defualtDrinkImg} altTxt={"Test Drink"} thisOnClick={() => setIsOpen(true)}/>
          </div>
          <div className='h-1/5 w-full m-4'>
              <MenuItem drinkName={"Some Drink"} drinkImage={defualtDrinkImg} altTxt={"Test Drink"} thisOnClick={() => setIsOpen(true)}/>
          </div>
          <div className='h-1/5 w-full m-4'>
              <MenuItem drinkName={"Some Drink"} drinkImage={defualtDrinkImg} altTxt={"Test Drink"} thisOnClick={() => setIsOpen(true)}/>
          </div>
      </div>
      <div className="flex flex-col items-center justify-start w-2/5 h-screen  m-4">
          <div className='h-1/5 w-full m-4'>
              <MenuItem drinkName={"Some Drink"} drinkImage={defualtDrinkImg} altTxt={"Test Drink"} thisOnClick={() => setIsOpen(true)}/>
          </div>
          <div className='h-1/5 w-full m-4'>
              <MenuItem drinkName={"Some Drink"} drinkImage={defualtDrinkImg} altTxt={"Test Drink"} thisOnClick={() => setIsOpen(true)}/>
          </div>
          <div className='h-1/5 w-full m-4'>
              <MenuItem drinkName={"Some Drink"} drinkImage={defualtDrinkImg} altTxt={"Test Drink"} thisOnClick={() => setIsOpen(true)}/>
          </div>
          <div className='h-1/5 w-full m-4'>
              <MenuItem drinkName={"Some Drink"} drinkImage={defualtDrinkImg} altTxt={"Test Drink"} thisOnClick={() => setIsOpen(true)}/>
          </div>
      </div>

      <div className="w-1/5 ml-14 my-10">
          <div className="bg-white h-full w-4/5 border-gray border-4 rounded-2xl text-center"> Orders </div>
          
      </div>
    </main>
  );
}