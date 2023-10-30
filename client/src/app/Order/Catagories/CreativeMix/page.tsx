"use client"

import MenuItem from '../../../Components/MenuItem/MenuItem'
import defualtDrinkImg from '../../../../../public/defualtDrinkImg.png'
import '../../styles.css'

export default function Order() {

    function goToCustomization(){
        alert("Customization");
    }
    function goBack(){
        window.location.href = "../";
    }
    return (
        <main className="backgroundC bg-slate-400 bg-cover h-screen w-screen w-screenflex-row flex flex-col">
            <button className='backContainter flex items-center' onClick={goBack}>
                <svg className='ml-4' xmlns="http://www.w3.org/2000/svg" height="5em" viewBox="0 0 448 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>
                <div className='ml-8 text-4xl'>Catagories</div>
                <div className='ml-80 text-6xl'>Creative Mix</div>
            </button>
            <div className='catagoryContainer w-screen w-screenflex-row flex h-full'>
                <div className="flex flex-col items-center justify-start w-2/5 h-full m-4">
                    <div className='h-1/5 w-full m-4'>
                        <MenuItem drinkName={"Caramel Chocolate"} drinkImage={defualtDrinkImg} altTxt={"Test Drink"} thisOnClick={goToCustomization}/>
                    </div>
                    <div className='h-1/5 w-full m-4'>
                        <MenuItem drinkName={"Grapefruit Green Tea"} drinkImage={defualtDrinkImg} altTxt={"Test Drink"} thisOnClick={goToCustomization}/>
                    </div>
                    <div className='h-1/5 w-full m-4'>
                        <MenuItem drinkName={"Grapefruit Yogurt Drink"} drinkImage={defualtDrinkImg} altTxt={"Test Drink"} thisOnClick={goToCustomization}/>
                    </div>
                    <div className='h-1/5 w-full m-4'>
                        <MenuItem drinkName={"Hibiscus Green Tea"} drinkImage={defualtDrinkImg} altTxt={"Test Drink"} thisOnClick={goToCustomization}/>
                    </div>
                    <div className='h-1/5 w-full m-4'>
                        <MenuItem drinkName={"Honey Green Tea"} drinkImage={defualtDrinkImg} altTxt={"Test Drink"} thisOnClick={goToCustomization}/>
                    </div>
                    <div className='h-1/5 w-full m-4'>
                        <MenuItem drinkName={"Lemon Ai-Yu White Pearls"} drinkImage={defualtDrinkImg} altTxt={"Test Drink"} thisOnClick={goToCustomization}/>
                    </div>
                    <div className='h-1/5 w-full m-4'>
                        <MenuItem drinkName={"Lemon Green Tea"} drinkImage={defualtDrinkImg} altTxt={"Test Drink"} thisOnClick={goToCustomization}/>
                    </div>
                    <div className='h-1/5 w-full m-4'>
                        <MenuItem drinkName={"Lemon Wintermellon Basil Seeds"} drinkImage={defualtDrinkImg} altTxt={"Test Drink"} thisOnClick={goToCustomization}/>
                    </div>
                    <div className='h-1/5 w-full m-4'>
                        <MenuItem drinkName={"Lemon Yogurt Drink"} drinkImage={defualtDrinkImg} altTxt={"Test Drink"} thisOnClick={goToCustomization}/>
                    </div>
                    <div className='h-1/5 w-full m-4'>
                        <MenuItem drinkName={"Lychee Oolong"} drinkImage={defualtDrinkImg} altTxt={"Test Drink"} thisOnClick={goToCustomization}/>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-start w-2/5 h-full m-4">
                    <div className='h-1/5 w-full m-4'>
                        <MenuItem drinkName={"Mango Green Tea"} drinkImage={defualtDrinkImg} altTxt={"Test Drink"} thisOnClick={goToCustomization}/>
                    </div>
                    <div className='h-1/5 w-full m-4'>
                        <MenuItem drinkName={"Mango Yogurt Drink"} drinkImage={defualtDrinkImg} altTxt={"Test Drink"} thisOnClick={goToCustomization}/>
                    </div>
                    <div className='h-1/5 w-full m-4'>
                        <MenuItem drinkName={"Passionfruit Green Tea"} drinkImage={defualtDrinkImg} altTxt={"Test Drinkx`"} thisOnClick={goToCustomization}/>
                    </div>
                    <div className='h-1/5 w-full m-4'>
                        <MenuItem drinkName={"Passionfruit Yogurt Drink"} drinkImage={defualtDrinkImg} altTxt={"Test Drink"} thisOnClick={goToCustomization}/>
                    </div>
                    <div className='h-1/5 w-full m-4'>
                        <MenuItem drinkName={"Peach Green Tea"} drinkImage={defualtDrinkImg} altTxt={"Test Drink"} thisOnClick={goToCustomization}/>
                    </div>
                    <div className='h-1/5 w-full m-4'>
                        <MenuItem drinkName={"Peach Yogurt Drink"} drinkImage={defualtDrinkImg} altTxt={"Test Drink"} thisOnClick={goToCustomization}/>
                    </div>
                    <div className='h-1/5 w-full m-4'>
                        <MenuItem drinkName={"Strawberry Green Tea"} drinkImage={defualtDrinkImg} altTxt={"Test Drink"} thisOnClick={goToCustomization}/>
                    </div>
                    <div className='h-1/5 w-full m-4'>
                        <MenuItem drinkName={"Strawberry Yogurt Drink"} drinkImage={defualtDrinkImg} altTxt={"Test Drink"} thisOnClick={goToCustomization}/>
                    </div>
                    <div className='h-1/5 w-full m-4'>
                        <MenuItem drinkName={"Taro Milk"} drinkImage={defualtDrinkImg} altTxt={"Test Drink"} thisOnClick={goToCustomization}/>
                    </div>
                </div>

                <div className="w-1/5 ml-14 my-10">
                    <div className="bg-white h-full w-4/5 border-gray border-4 rounded-2xl text-center"> Orders </div>
                </div>
            </div>
        </main>
    );
}