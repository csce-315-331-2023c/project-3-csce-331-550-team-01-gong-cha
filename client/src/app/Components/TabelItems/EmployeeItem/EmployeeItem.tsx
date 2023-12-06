"use client"
import './styles.css'
import React, { useState, useEffect } from 'react'

interface Employee{
    id: number;
    manager_id: number;
    name: string;
    ismanager: boolean;
    email: Text;
    isadmin: boolean;
    isemployed: boolean;
};

export default function RestockReportIngredient({id, manager_id, name, ismanager, email, isadmin, isemployed}: Employee){

    const [managerID, setManagerID] = useState<string>('');
    const [nameVar, setNameVar] = useState<string>('');
    const [emailVar, setEmailVar] = useState<string>('');

    const [managerButton, setManagerButton] = useState<string>('');
    const [adminButton, setAdminButton] = useState<string>('');

    function updateEmployee(managerPK, newName, newEmail){

    }

    return(
        <div className='flex justify-center bg-slate-200 w-ful h-12 mt-1'>
            <div className='total bg-slate-100 w-full flex justify-start border-rose-700 border-2 rounded-lg'>
                <div className='text-rose-700 font-semibold text-2xl'>{id}</div>
                <input className='name flex justify-center items-cente text-center rounded-lg bg-inherit outline-none text-rose-700' placeholder={manager_id.toString()} type='Iname' id='IName' value={managerID} onChange={(e) => setManagerID(e.target.value)}/>
                <input className='currentStock flex justify-center items-center text-center bg-inherit outline-none text-rose-700' placeholder={name} type='IcurrentStock' id='IcurrentStock' value={nameVar} onChange={(e) => setNameVar(e.target.value)}/>
                <input className='idealStock flex justify-center items-center text-center bg-inherit outline-none text-rose-700' placeholder={IdealStock} type='idealStock' id='idealStock' value={idealStock} onChange={(e) => setIdealStock(e.target.value)}/>
                <div className='meer flex justify-center align-center items-center mr-1'>
                    <button className="w-full bg-rose-700 h-5/6 items-center rounded-md text-slate-200" onClick={() => deleteTopping(pk)}>Delete</button>
                </div>
                <div className='ingredient flex items-center w-1/6'>
                    <button className={`w-full ${style} items-center mr-2 rounded-lg h-5/6`} onClick={() => setTopping(pk)}>{letters}</button>
                </div>
                <div className='mew flex justify-center align-center items-center mr-1'>
                    <button className="bg-rose-700 w-full h-5/6 items-center rounded-md text-slate-200" onClick={() => updateIngredient(pk, Iname, IcurrentStock, idealStock, IamountUsed)}>Update</button>
                </div>
            </div>
        </div>
    );
}