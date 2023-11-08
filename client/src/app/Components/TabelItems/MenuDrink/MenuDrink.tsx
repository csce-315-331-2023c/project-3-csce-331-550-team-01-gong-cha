"use client"

interface MenuDrinkProps {
    pk: number;
    name: string;
    priceNormal: string;
    priceLarge: string;
  }

export default function RestockReportIngredient({pk, name, priceNormal, priceLarge}: MenuDrinkProps){

    function updateIngredientData(){
        alert("Meer");
    }

    return(
        <div className='bg-cyan-200 w-full flex justify-start border-white border-2 h-10'>
            <input className='w-2/5 flex justify-center items-center bg-cyan-200 text-center' placeholder={name}/>
            <input className='w-1/5 flex justify-center items-center bg-cyan-200 text-center' placeholder={priceNormal}/>
            <input className='w-1/5 flex justify-center items-center bg-cyan-200 text-center' placeholder={priceLarge}/>
            <div className='w-1/5'>
                <button className="bg-cyan-500 w-full h-full items-center" onClick={updateIngredientData}>Update</button>
            </div>
        </div>
    );
}