'use client';

import ReportsModal from '../../Components/ReportModal/ReportModal';
import React, { useState, useEffect } from 'react'

export default function Dashboard() {

  const [isOpen, setIsOpen] = useState(false)


  return (
    <main className="flex w-screen h-screen p-[15px] pt-[50px] bg-slate-400">
      <div className='h-1/6 w-1/6 m-8 flex bg-cyan-200 items-center justify-center'>
        <button className='h-full w-full ' onClick={() => setIsOpen(true)}>
          Restock Report
        </button>
        <ReportsModal open={isOpen} onClose={() => setIsOpen(false)}>Hello</ReportsModal>
      </div>
      <button className='h-1/6 w-1/6 bg-cyan-200 m-8 flex items-center justify-center' >
        <div>Sales Report</div>
      </button>
      <button className='h-1/6 w-1/6 bg-cyan-200 m-8 flex items-center justify-center' >
        <div>Sales Together Report</div>
      </button>
      <button className='h-1/6 w-1/6 bg-cyan-200 m-8 flex items-center justify-center'>
        <div>Excess Report</div>
      </button>
    </main>
  )
  }