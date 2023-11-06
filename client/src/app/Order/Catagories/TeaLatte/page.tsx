"use client"
import Modal from '@/app/Components/Modal/Modal'
import { useState } from 'react';
import MenuItem from '../../../Components/MenuItem/MenuItem'
import defualtDrinkImg from '../../../../../public/defualtDrinkImg.png'
import '../../styles.css'

export default function Order() {
    const [isOpen, setIsOpen] = useState(false)

    function goToCustomization(){
        alert("Customization");
    }
    function goBack(){
        window.location.href = "../";
    }
    return (
        <main className="bg-slate-400 bg-cover h-screen w-screen w-screenflex-row flex flex-col">
            <button className='backContainter flex items-center' onClick={goBack}>
                <svg className='ml-4' xmlns="http://www.w3.org/2000/svg" height="5em" viewBox="0 0 448 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>
                <div className='ml-8 text-4xl'>Catagories</div>
                <div className='ml-80 text-6xl'>Tea Latte</div>
            </button>
            <div className='catagoryContainer w-screen w-screenflex-row flex h-full'>
                <div className="flex flex-col items-center justify-start w-2/5 h-full m-4">
                    <div className='h-1/5 w-full m-4'>
                        <MenuItem drinkName={"Black Tea Latte"} drinkImage={defualtDrinkImg} altTxt={"Test Drink"} thisOnClick={() => setIsOpen(true)}/>
                        <Modal open={isOpen} onClose={() => setIsOpen(false)} >Customize Ingredients</Modal>
                    </div>
                    <div className='h-1/5 w-full m-4'>
                        <MenuItem drinkName={"Fresh Milk with Herbal Jelly"} drinkImage={defualtDrinkImg} altTxt={"Test Drink"} thisOnClick={() => setIsOpen(true)}/>
                        <Modal open={isOpen} onClose={() => setIsOpen(false)} >Customize Ingredients</Modal>
                    </div>
                    <div className='h-1/5 w-full m-4'>
                        <MenuItem drinkName={"Macha Tea Latte"} drinkImage={defualtDrinkImg} altTxt={"Test Drink"} thisOnClick={() => setIsOpen(true)}/>
                        <Modal open={isOpen} onClose={() => setIsOpen(false)} >Customize Ingredients</Modal>
                    </div>
                    <div className='h-1/5 w-full m-4'>
                        <MenuItem drinkName={"Strawberry Macha Latte"} drinkImage={defualtDrinkImg} altTxt={"Test Drink"} thisOnClick={() => setIsOpen(true)}/>
                        <Modal open={isOpen} onClose={() => setIsOpen(false)} >Customize Ingredients</Modal>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-start w-2/5 h-full m-4">
                    <div className='h-1/5 w-full m-4'>
                        <MenuItem drinkName={"Earl Grey Tea Latte"} drinkImage={defualtDrinkImg} altTxt={"Test Drink"} thisOnClick={() => setIsOpen(true)}/>
                        <Modal open={isOpen} onClose={() => setIsOpen(false)} >Customize Ingredients</Modal>
                    </div>
                    <div className='h-1/5 w-full m-4'>
                        <MenuItem drinkName={"Green Tea Latte"} drinkImage={defualtDrinkImg} altTxt={"Test Drink"} thisOnClick={() => setIsOpen(true)}/>
                        <Modal open={isOpen} onClose={() => setIsOpen(false)} >Customize Ingredients</Modal>
                    </div>
                    <div className='h-1/5 w-full m-4'>
                        <MenuItem drinkName={"Oolong Tea Latte"} drinkImage={defualtDrinkImg} altTxt={"Test Drinkx`"} thisOnClick={() => setIsOpen(true)}/>
                        <Modal open={isOpen} onClose={() => setIsOpen(false)} >Customize Ingredients</Modal>
                    </div>
                    <div className='h-1/5 w-full m-4'>
                        <MenuItem drinkName={"Thai Tea Latte"} drinkImage={defualtDrinkImg} altTxt={"Test Drink"} thisOnClick={() => setIsOpen(true)}/>
                        <Modal open={isOpen} onClose={() => setIsOpen(false)} >Customize Ingredients</Modal>
                    </div>
                </div>

                <div className="w-1/5 ml-14 my-10">
                    <div className="bg-white h-full w-4/5 border-gray border-4 rounded-2xl text-center"> Orders </div>
                </div>
            </div>
        </main>
    );
}