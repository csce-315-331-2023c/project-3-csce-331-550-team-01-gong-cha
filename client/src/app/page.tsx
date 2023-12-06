'use client'
import Image from 'next/image'
import TEA from '../../public/Gongcha.png'
import Login from './Components/LoginPopUp/LoginPopUp'
import EmployeeModal from './Components/EmployeeModal/EmployeeModal'

import React, { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react'

export default function Dashboard() {

  const [LoginOpen, LoginSetOpen] = useState(false);
  const { data: session } = useSession();
  const [opened, setOpned] = useState<boolean>(false);
  const [employeeEditor, setEmployeeEditor] = useState<boolean>(false);

  function gotToOrder(){
    window.location.href = "/Order";
  }

  function goBack(){
    signOut({ callbackUrl: 'http://localhost:3000'});
  }

  useEffect(() =>{
    if(!opened && session){
      setOpned(true);
      setEmployeeEditor(true);
    }
  })

  return (
    <div className='h-screen'>
        <Image
        className='back -z-10'
        src={TEA}
        alt='Background image of tea leaves being processed'
        fill={true}
        style={{objectFit: "cover"}}
        />
    <div className='flex justify-end items-right w-full h-1/6'>
      <EmployeeModal open={employeeEditor} onClose={() => {setEmployeeEditor(false), goBack()}}>hello</EmployeeModal>
      <button onClick={() => LoginSetOpen(true)}> {/* <button onClick={managerLogin}> */}
        <svg className='pt-8 pr-12 fill-rose-700' xmlns="http://www.w3.org/2000/svg" height="8em" viewBox="0 0 448 512"><path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"/></svg>
      </button> 
      <Login open={LoginOpen} onClose={() => LoginSetOpen(false)} openEmployee={() => {setEmployeeEditor(true), setOpned(false)}}>Login</Login>
    </div>
    <div className='w-full h-5/6'>
      <button onClick={gotToOrder} className='startOrder bg-rose-700 h-1/6 w-1/5 rounded-2xl text-slate-200 text-5xl font-semibold'>
        Start Order
      </button>
    </div>
  </div>
  );
}