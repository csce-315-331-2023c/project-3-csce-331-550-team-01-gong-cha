'use client'

import bobaSvg from '../../../public/boba.svg'
import Image from 'next/image'
import './styles.css'

export default function Manager(){

    function goToInventory(){
        alert("Go to inventory");
    }

    function goToReports(){
        alert("Go to Reports");
    }


    return(
        <main className="bg-slate-400 bg-cover h-screen w-screen flex items-center justify-center">
            <button className="w-2/6 h-4/6 bg-cyan-200 mr-20 flex flex-col items-center justify-center" onClick={goToInventory}>
                <div className='text-6xl mt-10'>Edit Inventory</div>
                <Image 
                    className='bobaSvgForm'
                    alt='Boba Line Art'
                    src={bobaSvg}
                    />
            </button>
            <button className="w-2/6 h-4/6 bg-cyan-200 ml-20 flex flex-col items-center justify-center" onClick={goToReports}>
                <div className='text-6xl'>View Reports</div>
                <svg className='h-5/6' viewBox="0 0 24.00 24.00" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9 17H15M9 13H15M9 9H10M13 3H8.2C7.0799 3 6.51984 3 6.09202 3.21799C5.71569 3.40973 5.40973 3.71569 5.21799 4.09202C5 4.51984 5 5.0799 5 6.2V17.8C5 18.9201 5 19.4802 5.21799 19.908C5.40973 20.2843 5.71569 20.5903 6.09202 20.782C6.51984 21 7.0799 21 8.2 21H15.8C16.9201 21 17.4802 21 17.908 20.782C18.2843 20.5903 18.5903 20.2843 18.782 19.908C19 19.4802 19 18.9201 19 17.8V9M13 3L19 9M13 3V7.4C13 7.96005 13 8.24008 13.109 8.45399C13.2049 8.64215 13.3578 8.79513 13.546 8.89101C13.7599 9 14.0399 9 14.6 9H19" stroke="#000000" stroke-width="1.392" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
            </button>
        </main>
    );
}