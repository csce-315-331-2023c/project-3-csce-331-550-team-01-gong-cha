'use client'
import Image from 'next/image'
import TEA from '../../public/homeBackground.png'

import React, { useState } from 'react';

export default function Dashboard() {

  function managerLogin(){
    window.location.href = "/Manager";
  }

  function gotToOrder(){
    window.location.href = "/Order";
  }

  return (
    <div className='h-screen'>
        <Image
        className='back -z-10'
        src={TEA}
        alt='Background image of tea leaves being processed'
        layout='fill'
        objectFit='cover'
        />
    <div className='flex justify-end items-right w-full h-1/6'>
      <button onClick={managerLogin}>
        <svg className='pt-8 pr-12 fill-rose-700' xmlns="http://www.w3.org/2000/svg" height="8em" viewBox="0 0 448 512"><path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"/></svg>
      </button> 
    </div>
    <div className='flex justify-center items-center w-full h-5/6'>
      <button onClick={gotToOrder} className='bg-rose-700 h-1/6 w-1/6'>
        Start Order
      </button>
    </div>
  </div>
  );
}