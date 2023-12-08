'use clinet'
import React, { useState, useEffect, useCallback, useReducer } from 'react';
import EmployeeItem from '../TabelItems/EmployeeItem/EmployeeItem';
import './styles.css'

interface ModalProps {
    open: boolean;
    children: React.ReactNode;
    onClose: () => void;
}

export default function EmployeeModal({open, children, onClose}: ModalProps){

    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

    const [employeeArray, setEmployeeArray] = useState<Employee[]>([]);

    const [employeeName, setEmployeeName] = useState<string>('');
    const [employeeEmail, setEmployeeEmail] = useState<string>('');
    const [employeeManager, setEmployeeManager] = useState<string>('');
    const [employeeIsM, setEmployeeIsM] = useState<boolean>(false);
    const [employeeIsA, setEmployeeIsA] = useState<boolean>(false);
    const [styleA, setStyleA] = useState<string>('bg-rose-700');
    const [styleM, setStyleM] = useState<string>('bg-rose-700');

    interface Employee{
        id: number;
        manager_id: number;
        name: string;
        ismanager: boolean;
        email: string;
        isadmin: boolean;
        isemployed: boolean;
    };

    async function getEmployees(){
        const response = await fetch(`http://18.223.2.65:5000/employees`) // Replace with the actual API endpoint URL

        const employeeA = await response.json();
 
        const employees: Employee[] = await employeeA.map((item: any) => ({
            id: item.id,
            name: item.name,
            manager_id: item.manager_id,
            ismanager: item.ismanager,
            email: item.email,
            isadmin: item.isadmin,
            isemployed: item.isemployed,
        }));

        setEmployeeArray(employees);
    } 

    async function createEmployee(){

        const isAdText = employeeIsA ? "TRUE" : 'FALSE';
        const isMaText = employeeIsM ? "TRUE" : 'FALSE';

        await fetch(`http://18.223.2.65:5000/create-employee`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ Manager_ID: employeeManager, Name: employeeName, isManager: isMaText, Email: employeeEmail, IsAdmin: isAdText, IsEmployed: 'TRUE' }),
            });
    }

    async function addEmployee(){

        await createEmployee();
        setEmployeeName('');
        setEmployeeEmail('');
        setEmployeeManager('');
        setEmployeeIsA(false);
        setEmployeeIsM(false);
        setStyleM('bg-rose-700');
        setStyleA('bg-rose-700');
        setEmployeeArray([]);
        await getEmployees();
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
                        <div className='flex items-center header justify-center'>
                                <div className='ingredientHeader bg-rose-700 font-bold w-full flex justify-start items-center text-slate-200 rounded-xl h-14'>
                                    <div className='name flex justify-center text-center'>
                                        Employee ID
                                    </div>
                                    <div className="flex items-center space-x-10 w-full mr-12 justify-evenly">
                                    <div className="normPrice flex justify-center mr-24 text-center">
                                        Name
                                    </div>
                                    <div className="lgPrice flex justify-center text-center">
                                        Email
                                    </div>
                                    </div>
                                    
                                    <div className="flex items-center w-full ml-8 justify-evenly">
                                    <div className="ingredient flex justify-center text-center">
                                        Permissions
                                    </div>
                                    <div className="ingredient flex justify-center text-center">
                                        Update
                                    </div>
                                    <div className='button flex justify-center text-center'>
                                        Delete
                                    </div>
                                    </div>
                                    
                                </div>
                        </div>
                        <div className='employeeHolder customH'>
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
                                        reload={() => {setEmployeeArray([]), getEmployees()}}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className='flex justify-evenly w-full h-1/6 mt-4'>
                            <input className='nameE w-2/6 h-3/6 mx-2 text-center border-rose-700 border-2 bg-slate-100 rounded-lg outline-none text-rose-700' placeholder='Name' type='drinkName' id='drinkName' value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} />
                            <input className='emE w-2/5 h-3/6 mx-2 text-center border-rose-700 border-2 bg-slate-100 rounded-lg outline-none text-rose-700' placeholder='Email' type='drinkName' id='drinkName' value={employeeEmail} onChange={(e) => setEmployeeEmail(e.target.value)} />
                            <input className='butB w-1/6 h-3/6 mx-2 text-center border-rose-700 border-2 bg-slate-100 rounded-lg outline-none text-rose-700' placeholder='Manager ID' type='drinkName' id='drinkName' value={employeeManager} onChange={(e) => setEmployeeManager(e.target.value)} />
                            <button className={`${styleM} butB h-3/6 text-slate-200 text-xl font-semibold rounded-xl`} onClick={() => {setEmployeeIsM(!employeeIsM), setStyleM(employeeIsM ? 'bg-rose-700' : 'bg-green-600')}}>Manager</button>
                            <button className={`${styleA} butB h-3/6 text-slate-200 text-xl font-semibold rounded-xl`} onClick={() => {setEmployeeIsA(!employeeIsA), setStyleA(employeeIsA ? 'bg-rose-700' : 'bg-green-600')}}>Admin</button>
                            <button className='nameE h-3/6 bg-rose-700 text-slate-200 text-xl font-semibold rounded-xl' onClick={() => addEmployee()}>Add Employee</button>
                        </div>  
                            <button className='exitt w-2/6 bg-rose-700 -mt-8 mb-4 rounded-xl text-slate-200 text-4xl font-semibold' onClick={onClose}>Exit</button>
                    </div>
            </div>

        </div>
    );

}