"use client"
import './styles.css'
import React, { useState, useEffect, useReducer } from 'react'

interface Employee{
    id: number;
    manager_id: number;
    name: string;
    ismanager: boolean;
    email: string;
    isadmin: boolean;
    isemployed: boolean;
    reload: () => void;
};

export default function EmployeeItem({id, manager_id, name, ismanager, email, isadmin, isemployed, reload}: Employee){

    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

    const [managerID, setManagerID] = useState<string>('');
    const [nameVar, setNameVar] = useState<string>('');
    const [emailVar, setEmailVar] = useState<string>('');

    const [styleM, setStyleM] = useState<string>(ismanager ? 'bg-green-600' : 'bg-rose-700');
    const [styleA, setStyleA] = useState<string>(isadmin ? 'bg-green-600' : 'bg-rose-700');
    const [textM, setTextM] = useState<string>(ismanager ? 'Yes' : 'No');
    const [textA, setTextA] = useState<string>(isadmin ? 'Yes' : 'No');

    function updateEmployee(managerPK: string, newName: string, newEmail: string){

        const newManagerPK = managerPK === '' ? manager_id : parseInt(managerPK);
        const newNameVar = newName === '' ? name : newName;
        const newEmailVar = newEmail === '' ? email : newEmail;

        fetch(`http://18.191.166.59:5000/update-employee/${id}`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ manager_id: newManagerPK, name: newNameVar, isManager: ismanager, email: newEmailVar, isAdmin: isadmin, isEmployed: isemployed }),
        })
        .then((response) => {
            if (!response.ok) {
            throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(() => {
            forceUpdate();
            reload();
            forceUpdate();
        })
    }

    function deleteEmployee(){
        fetch(`http://18.191.166.59:5000/delete-employee/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
              },
        })
        .then(() => {
            forceUpdate();
            reload();
            forceUpdate();
        });
    }

    function updateStates(){
        setEmailVar('');
        setManagerID('');
        setNameVar('');
        setStyleM(ismanager ? 'bg-green-600' : 'bg-rose-700');
        setStyleA(isadmin ? 'bg-green-600' : 'bg-rose-700');
        setTextM(ismanager ? 'Yes' : 'No');
        setTextA(isadmin ? 'Yes' : 'No');
    }

    async function swapM(){
        await fetch(`http://18.191.166.59:5000/change-manager/${id}`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            },
        });
        forceUpdate();
        reload();
        forceUpdate();
    }

    async function swapA(){
        await fetch(`http://18.191.166.59:5000/change-admin/${id}`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            },
        });
        forceUpdate();
        reload();
        forceUpdate();
    }

    useEffect(() => {
        updateStates();
    }, [])

    return(
        <div className='flex justify-center bg-slate-200 w-ful h-12 mt-1'>
            <div className='total bg-slate-100 w-full flex justify-evenly border-rose-700 border-2 rounded-lg'>
                <div className='nums ml-4 flex items-center justify-center'>
                    <div className='text-rose-700 font-semibold text-2xl'>{id}</div>
                </div>
                <input className='eNamecurrentStock flex justify-center items-center text-center bg-inherit outline-none text-rose-700' placeholder={name} type='IcurrentStock' id='IcurrentStock' value={nameVar} onChange={(e) => setNameVar(e.target.value)}/>
                <input className='eName idealStock flex justify-center items-center text-center bg-inherit outline-none text-rose-700' placeholder={email} type='idealStock' id='idealStock' value={emailVar} onChange={(e) => setEmailVar(e.target.value)}/>
                <input className='nums flex justify-center items-cente text-center rounded-lg bg-inherit outline-none text-rose-700' placeholder={manager_id.toString()} type='Iname' id='IName' value={managerID} onChange={(e) => setManagerID(e.target.value)}/>
                <div className='nums flex justify-center align-center items-center mr-1'>
                    <button className={`w-full ${styleM} h-5/6 items-center rounded-md text-slate-200`} onClick={() => swapM()}>{textM}</button>
                </div>
                <div className='nums flex justify-center align-center items-center mr-1'>
                    <button className={`w-full ${styleA} h-5/6 items-center rounded-md text-slate-200`} onClick={() => swapA()}>{textA}</button>
                </div>
                <div className='buttonsB flex justify-center align-center items-center mr-1'>
                    <button className="bg-rose-700 w-full h-5/6 items-center rounded-md text-slate-200" onClick={() => updateEmployee(managerID, nameVar, emailVar)}>Update</button>
                </div>
                <div className='buttonsB flex justify-center align-center items-center mr-1'>
                    <button className="w-full bg-rose-700 h-5/6 items-center rounded-md text-slate-200" onClick={() => deleteEmployee()}>Delete</button>
                </div>
            </div>
        </div>
    );
}