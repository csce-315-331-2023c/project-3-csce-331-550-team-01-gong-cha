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
            fetch('http://18.191.166.59:5000/ingredients') // Replace with the actual API endpoint URL
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
                    <button className='bg-cyan-200 h-1/6 w-1/6 mb-8' onClick={() => onClose()}>Exit</button>
                    <div>{children}</div>
                    <div className="flex-col justify-evenly border-white border-2 rounded-md h-4/6 w-4/5">
                    {ingredients.map((ingredient, index) => (
                        <RestockReportIngredient
                            name={ingredient.name}
                            currentAmount={ingredient.currentAmount}
                            idealAmount={ingredient.idealAmount}
                        />
                    ))}
                    </div>
                </div>
            </div>
        </div>

    );
}