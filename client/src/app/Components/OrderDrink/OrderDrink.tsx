"use client"

interface OrderDrinkProps {

    key: number;
    drinkName: string;
    sugar: number;
    ice: number;
    size: number;
}

export default function OrderDrink({key, drinkName, sugar, ice, size}: OrderDrinkProps){

    const sizeLabels: { [key: number]: string } = {
        0: "Normal",
        1: "Large"
      };

    const sugarLabels: { [key: number]: string } = {
        0: "0%",
        1: "30%",
        2: "50%",
        3: "70%",
        4: "100%",
    }

    const iceLabels: { [key: number]: string } = {
        0: "No Ice",
        1: "Less Ice",
        2: "More Ice"
    }

    return (
        <div className="flex-col w-full bg-cyan-200 rounded-sm mt-3">
            <div className="flex justify-evenly">
                <div className="text-sm">
                    {drinkName}
                </div>
                <div className="text-xs">
                    <div>
                        Size: {sizeLabels[size]}
                    </div>
                    <div>
                        Sugar: {sugarLabels[sugar]}
                    </div>
                    <div>
                        Ice: {iceLabels[ice]}
                    </div>
                </div>
            </div>
        </div>
    )
}