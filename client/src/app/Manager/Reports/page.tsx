'use client';

import ReportsModal from '../../Components/ReportModal/ReportModal';
import ReportModalWithDate from '../../Components/ReportModalWithDate/ReportModalWithDate';
import React, { useState, useEffect } from 'react'

export default function Dashboard() {

  const [restockReportOpen, setRestockReportOpen] = useState(false)
  const [salesReportOpen, setSalesReportOpen] = useState(false)
  const [soldTogetherReportOpen, setSoldTogetherReportOpen] = useState(false)
  const [excessReportOpen, setExcessReportOpen] = useState(false)

  function goBack(){
    window.location.href = "../Manager";
  }

  return (
    <main className="flex-col w-screen h-screen p-[15px] pt-[50px] bg-slate-400">
      <button className='backContainter flex items-center' onClick={goBack}>
          <svg className='ml-4' xmlns="http://www.w3.org/2000/svg" height="5em" viewBox="0 0 448 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>
          <div className='ml-8 text-4xl'>Manager Page</div>
      </button>
      <div className="flex w-screen h-5/6 p-[15px] pt-[50px]">
        <div className='h-1/6 w-1/6 m-8 flex bg-cyan-200 items-center justify-center'>
          <button className='h-full w-full ' onClick={() => setRestockReportOpen(true)}>
            Restock Report
          </button>
          <ReportsModal open={restockReportOpen} onClose={() => setRestockReportOpen(false)}>Restock Report</ReportsModal>
        </div>
        <div className='h-1/6 w-1/6 bg-cyan-200 m-8 flex items-center justify-center' >
          <button className='h-full w-full ' onClick={() => setSalesReportOpen(true)}>
            Sales Report
          </button>
          <ReportModalWithDate open={salesReportOpen} onClose={() => setSalesReportOpen(false)} whichReport={0}>Sales Report</ReportModalWithDate>
        </div>
        <div className='h-1/6 w-1/6 bg-cyan-200 m-8 flex items-center justify-center' >
          <button className='h-full w-full ' onClick={() => setSoldTogetherReportOpen(true)}>
            Sold Together Report
          </button>
          <ReportModalWithDate open={soldTogetherReportOpen} onClose={() => setSoldTogetherReportOpen(false)} whichReport={1}>Sold Together Report</ReportModalWithDate>
        </div>
        <button className='h-1/6 w-1/6 bg-cyan-200 m-8 flex items-center justify-center'>
          <div>Excess Report</div>
        </button>
        </div>
    </main>
  )
  }