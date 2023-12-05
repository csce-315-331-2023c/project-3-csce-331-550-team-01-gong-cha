'use clinet'
import React, { useState, useEffect, useCallback } from 'react';
import EmployeeItem from './TabelItems/EmployeeItem/EmployeeItem';
import './styles.css'

interface ModalProps {
    open: boolean;
    children: React.ReactNode;
    onClose: () => void;
}

export default function FullMenu({open, children, onClose}: ModalProps){

    interface Employee{
        id: number;
        manager_id: number;
        name: string;
        ismanager: boolean;
        email: Text;
        isadmin: boolean;
        isemployed: boolean;
    };

    const [employees, setEmployees] = useState<Employee[]>([]);

    return(
        <div>
            <div className='Overlay_Styles'>
                    <div className='Modal_Styles bg-slate-200 border-8 border-rose-700 rounded-3xl flex items-center justify-start'>
                        <div>

                        </div>
                        <div>
                            <div className="ingredientTabel flex-col justify-center items-center border-rose-700 border-4 h-full w-full overflow-auto rounded-xl">
                                {employees.map((item, index) => (
                                    <Ingredient
                                        key={index}
                                        pk={ingredientItem.pk}
                                        FIName={ingredientItem.name}
                                        CurrentStock={ingredientItem.CurrentStock}
                                        IdealStock={ingredientItem.IdealStock}
                                        FConsumerPrice={ingredientItem.ConsumerPrice}
                                        isIngre={ingredientItem.isIngredient}
                                        reload={() => {getIngredients(), reset()}}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className='flex justify-evenly'>
                            <button onClick={onClose}>exit</button>
                            <button>test</button>
                        </div>  
                    </div>
            </div>

        </div>
    );

}