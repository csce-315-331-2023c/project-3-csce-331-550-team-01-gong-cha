"use client"

import React, { useState, useEffect } from 'react'
import MenuItem from '../Topping/Topping'
import RestockReportIngredient from '../RestockReportIngredient/RestockReportIngredient'
import './styles.css'

interface ModalProps {
    open: boolean;
    children: React.ReactNode
    onClose: () => void;
}


export default function ReportsModal({open, children, onClose}: ModalProps) {

    interface Ingredient {
        name: string;
        currentAmount: number;
        idealAmount: number;
    }

    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    useEffect(() => {
        if (open) {
            fetch('localhost:5000/report-restock') // Replace with the actual API endpoint URL
            .then((response) => {
                if (!response.ok) {
                alert("did not pass");
                throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                // Process the data received from the API and store it in the state
                
                const ingredientData: Ingredient[] = data.map((item: any) => ({
                name: item.ingredient_name,
                currentAmount: item.current_amount,
                idealAmount: item.ideal_amount
                }));
                setIngredients(ingredientData);
            })
            .catch((error) => {
                console.error('There was a problem with the fetch operation:', error);
            });
        }
    }, [open]);

    if (!open) return null

    return (
        <div>
            <div className='Overlay_Styles'>
                <div className='Modal_Styles bg-slate-400 flex items-center justify-start'>
                <div className='w-4/5'>
                <div className='bg-cyan-300 font-bold w-full flex justify-evenly border-white border-2 h-10'>
                        <div className='flex justify-center items-center w-4/6'>
                            Topping Name
                        </div>
                        <div className="flex justify-evenly w-1/6">
                            Current
                        </div>
                        <div className='w-1/6'>
                            Ideal
                        </div>
                    </div>
                </div>
                    <div className="flex-col justify-evenly border-white border-2 rounded-md h-full w-4/5 overflow-auto">
                    
                    {ingredients.map((ingredient, index) => (
                        <RestockReportIngredient
                            key={index}
                            name={ingredient.name}
                            currentAmount={ingredient.currentAmount}
                            idealAmount={ingredient.idealAmount}
                        />
                    ))}
                    </div>
                    <button className='bg-cyan-200 h-1/6 w-1/6 mb-8 mt-10' onClick={() => onClose()}>Exit</button>
                </div>
            </div>
        </div>

    );
}