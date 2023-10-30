
"use client"


import MenuItem from '../Components/MenuItem/MenuItem'
import defualtDrinkImg from '../../../public/defualtDrinkImg.png'




export default function Order() {

  function goToCategory(category){
    // alert("../" + category)
    window.location.href = "../" + category;
  }
    return (
      <main className="bg-slate-400 bg-cover h-screen w-screen w-screenflex-row flex">
        <div className="flex flex-col items-center justify-start w-2/5 h-screen m-4">
            <div className='h-1/5 w-full m-4'>
                <MenuItem drinkName={"Milk Tea"} drinkImage={defualtDrinkImg} altTxt={"Test Drink"} thisOnClick={() => goToCategory("MilkTea")}/>
            </div>
            <div className='h-1/5 w-full m-4'>
                <MenuItem drinkName={"Creative Mix"} drinkImage={defualtDrinkImg} altTxt={"Test Drink"} thisOnClick={() => goToCategory("CreativeMix")}/>
            </div>
            <div className='h-1/5 w-full m-4'>
                <MenuItem drinkName={"Milk Foam"} drinkImage={defualtDrinkImg} altTxt={"Test Drink"} thisOnClick={() => goToCategory("MilkFoam")}/>
            </div>
            <div className='h-1/5 w-full m-4'>
                <MenuItem drinkName={"Slush"} drinkImage={defualtDrinkImg} altTxt={"Test Drink"} thisOnClick={() => goToCategory("Slush")}/>
            </div>
        </div>
        <div className="flex flex-col items-center justify-start w-2/5 h-screen  m-4">
            <div className='h-1/5 w-full m-4'>
                <MenuItem drinkName={"Tea Latte"} drinkImage={defualtDrinkImg} altTxt={"Test Drink"} thisOnClick={() => goToCategory("TeaLatte")}/>
            </div>
            <div className='h-1/5 w-full m-4'>
                <MenuItem drinkName={"Brewed Tea"} drinkImage={defualtDrinkImg} altTxt={"Test Drink"} thisOnClick={() => goToCategory("BrewedTea")}/>
            </div>
            <div className='h-1/5 w-full m-4'>
                <MenuItem drinkName={"Coffee"} drinkImage={defualtDrinkImg} altTxt={"Test Drink"} thisOnClick={() => goToCategory("Coffee")}/>
            </div>
            <div className='h-1/5 w-full m-4'>
                <MenuItem drinkName={"Seasonal"} drinkImage={defualtDrinkImg} altTxt={"Test Drink"} thisOnClick={() => goToCategory("Seasonal")}/>
            </div>
        </div>

        <div className="w-1/5 ml-14 my-10">
            <div className="bg-white h-full w-4/5 border-gray border-4 rounded-2xl text-center"> Orders </div>
        </div>
      </main>
    );
  }