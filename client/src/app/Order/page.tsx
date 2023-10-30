import MenuItem from '../Components/MenuItem/MenuItem'
import defualtDrinkImg from '../../../public/defualtDrinkImg.png'

export default function Order() {
    return (
      <main className="bg-slate-400 bg-cover h-screen w-screen w-screenflex-row flex">
        <div className="flex flex-col items-center justify-start w-2/5 h-screen m-4">
            <div className='h-1/5 w-full m-4'>
                <MenuItem drinkName={"test"} drinkImage={defualtDrinkImg} altTxt={"Test Drink"}/>
            </div>
            <div className='h-1/5 w-full m-4'>
                <MenuItem drinkName={"test"} drinkImage={defualtDrinkImg} altTxt={"Test Drink"}/>
            </div>
            <div className='h-1/5 w-full m-4'>
                <MenuItem drinkName={"test"} drinkImage={defualtDrinkImg} altTxt={"Test Drink"}/>
            </div>
            <div className='h-1/5 w-full m-4'>
                <MenuItem drinkName={"test"} drinkImage={defualtDrinkImg} altTxt={"Test Drink"}/>
            </div>
        </div>
        <div className="flex flex-col items-center justify-start w-2/5 h-screen  m-4">
            <div className='h-1/5 w-full m-4'>
                <MenuItem drinkName={"test"} drinkImage={defualtDrinkImg} altTxt={"Test Drink"}/>
            </div>
            <div className='h-1/5 w-full m-4'>
                <MenuItem drinkName={"test"} drinkImage={defualtDrinkImg} altTxt={"Test Drink"}/>
            </div>
            <div className='h-1/5 w-full m-4'>
                <MenuItem drinkName={"test"} drinkImage={defualtDrinkImg} altTxt={"Test Drink"}/>
            </div>
            <div className='h-1/5 w-full m-4'>
                <MenuItem drinkName={"test"} drinkImage={defualtDrinkImg} altTxt={"Test Drink"}/>
            </div>
        </div>

        <div className="w-1/5 mx-14 my-10">
            <div className="bg-white h-5/6 w-4/5 border-gray border-4 rounded-2xl"> Orders </div>
        </div>
      </main>
    );
  }