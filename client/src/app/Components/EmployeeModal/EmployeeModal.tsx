'use clinet'
import React, { useState, useEffect, useCallback } from 'react';
import EmployeeItem from '../TabelItems/EmployeeItem/EmployeeItem';
import './styles.css'

interface ModalProps {
    open: boolean;
    children: React.ReactNode;
    onClose: () => void;
}

export default function EmployeeModal({open, children, onClose}: ModalProps){

    const [employeeArray, setEmployeeArray] = useState<Employee[]>([]);

    const [employeeName, setEmployeeName] = useState<string>('');
    const [employeeEmail, setEmployeeEmail] = useState<string>('');

    interface Employee{
        id: number;
        manager_id: number;
        name: string;
        ismanager: boolean;
        email: string;
        isadmin: boolean;
        isemployed: boolean;
    };

    function getEmployees(){
        fetch(`http://18.191.166.59:5000/employees`) // Replace with the actual API endpoint URL
        .then((response) => {
            if (!response.ok) {
            alert("did not pass");
            throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            // Process the data received from the API and store it in the state
            
            const employees: Employee[] = data.map((item: any) => ({
                id: item.id,
                name: item.name,
                manager_id: item.manager_id,
                ismanager: item.ismanager,
                email: item.email,
                isadmin: item.isadmin,
                isemployed: item.isemployed,
            }));
            setEmployeeArray(employees);
        })

    }

    useEffect(() =>{
        getEmployees();
    }, [])

    if (!open) return null

    return(
        <div>
            <div className='Overlay_Styles'>
                    <div className='Modal_Styles bg-slate-200 border-8 border-rose-700 rounded-3xl flex items-center justify-start'>
                        <div className='text-5xl text-rose-700 font-bold my-6'>
                            Edit Employees
                        </div>
                        <div className='employeeHolder h-4/6'>
                            <div className="ingredientTabel flex-col justify-center items-center border-rose-700 border-4 h-full w-full overflow-auto rounded-xl">
                                {employeeArray.map((item, index) => (
                                    <EmployeeItem
                                        key={index}
                                        id={item.id}
                                        manager_id={item.manager_id}
                                        name={item.name}
                                        ismanager={item.ismanager}
                                        email={item.email}
                                        isadmin={item.isadmin}
                                        isemployed={item.isemployed}
                                        reload={() => getEmployees()}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className='flex justify-evenly w-2/5 h-3/5'>
                        <input className='w-2/5 h-2/5 mx-2 text-center border-rose-700 border-2 bg-slate-100 rounded-lg outline-none text-rose-700' placeholder='Name' type='drinkName' id='drinkName' value={drinkName} onChange={(e) => setDrinkName(e.target.value)} />
                            <button className='w-2/5 h-3/5 bg-rose-700' onClick={onClose}>exit</button>
                            <button>test</button>
                        </div>  
                    </div>
            </div>

        </div>
    );

}