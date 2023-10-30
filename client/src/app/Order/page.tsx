export default function Order() {
    return (
      <main className="bg-slate-400 bg-cover h-screen flex-row flex ">
        <div className="grid grid-cols-2 gap-4 h-screen bg-white w-4/5">
          <div className="grid grid-cols-2 gap-4 border-black border-2">01</div>
          <div className="grid grid-cols-2 gap-4 border-black border-2">02</div>
          <div className="grid grid-cols-2 gap-4 border-black border-2">03</div>
          <div className="grid grid-cols-2 gap-4 border-black border-2">04</div>
          <div className="grid grid-cols-2 gap-4 border-black border-2">05</div>
          <div className="grid grid-cols-2 gap-4 border-black border-2">06</div>
          <div className="grid grid-cols-2 gap-4 border-black border-2">07</div>
          <div className="grid grid-cols-2 gap-4 border-black border-2">08</div>
      </div>

      <div className="w-1/5 mx-14 my-10">
        <div className="bg-white h-5/6 w-4/5 border-gray border-4 rounded-2xl"> Orders </div>
      </div>
      </main>
    );
  }