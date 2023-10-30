import MenuItem from '../Components/MenuItem/MenuItem'
import defualtDrinkImg from '../../../public/defualtDrinkImg.png'

export default function Order() {
    return (
      <main className="bg-slate-400 bg-cover h-screen w-screen w-screenflex-row flex">
        <div className="grid grid-cols-2 gap-4 h-screen w-4/5 bg-white">
          <div className="border-black border-2">
            <MenuItem drinkName={"Test"} drinkImage={defualtDrinkImg} altTxt={"Defualt Drink Icon"}/>
          </div>
          <div className="border-black border-2">
            <MenuItem drinkName={"Test"} drinkImage={defualtDrinkImg} altTxt={"Defualt Drink Icon"}/>
          </div>
          <div className=" border-black border-2">
            <MenuItem drinkName={"Test"} drinkImage={defualtDrinkImg} altTxt={"Defualt Drink Icon"}/>
          </div>
          <div className=" border-black border-2">
            <MenuItem drinkName={"Test"} drinkImage={defualtDrinkImg} altTxt={"Defualt Drink Icon"}/>
          </div>
          <div className=" border-black border-2">
            <MenuItem drinkName={"Test"} drinkImage={defualtDrinkImg} altTxt={"Defualt Drink Icon"}/>
          </div>
          <div className=" border-black border-2">
            <MenuItem drinkName={"Test"} drinkImage={defualtDrinkImg} altTxt={"Defualt Drink Icon"}/>
          </div>
          <div className=" border-black border-2">
            <MenuItem drinkName={"Test"} drinkImage={defualtDrinkImg} altTxt={"Defualt Drink Icon"}/>
          </div>
          <div className="border-black border-2">
            <MenuItem drinkName={"Test"} drinkImage={defualtDrinkImg} altTxt={"Defualt Drink Icon"}/>
          </div>
        </div>

        <div className="w-1/5 mx-14 my-10">
            <div className="bg-white h-5/6 w-4/5 border-gray border-4 rounded-2xl"> Orders </div>
        </div>
      </main>
    );
  }