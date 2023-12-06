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

    interface Employee{
        id: number;
        manager_id: number;
        name: string;
        ismanager: boolean;
        email: string;
        isadmin: boolean;
        isemployed: boolean;
    };

    const [employees, setEmployees] = useState<Employee[]>([]);

    function getEmployees(){
        
    }
    function reset(){

    }
    if (!open) return null

    return(
        <div>
            <div className='Overlay_Styles'>
                    <div className='Modal_Styles bg-slate-200 border-8 border-rose-700 rounded-3xl flex items-center justify-start'>
                        <div>
                            something
                        </div>
                        <div>
                            <div className="ingredientTabel flex-col justify-center items-center border-rose-700 border-4 h-full w-full overflow-auto rounded-xl">
                                {employees.map((item, index) => (
                                    <EmployeeItem
                                        key={index}
                                        id={item.id}
                                        manager_id={item.manager_id}
                                        name={item.name}
                                        ismanager={item.ismanager}
                                        email={item.email}
                                        isadmin={item.isadmin}
                                        isemployed={item.isemployed}
                                        reload={() => {getEmployees(), reset()}}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className='flex justify-evenly w-2/5 h-3/5'>
                            <button className='w-2/5 h-3/5 bg-rose-700' onClick={onClose}>exit</button>
                            <button>test</button>
                        </div>  
                    </div>
            </div>

        </div>
    );

}