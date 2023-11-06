'use client';

import ReportsModal from '../../Components/ReportModal/ReportModal';
import ReportModalWithDate from '../../Components/ReportModalWithDate/ReportModalWithDate';
import React, { useState, useEffect } from 'react'

export default function Dashboard() {

  const [restockReportOpen, setRestockReportOpen] = useState(false)
  const [salesReportOpen, setSalesReportOpen] = useState(false)
  const [soldTogetherReportOpen, setSoldTogetherReportOpen] = useState(false)
  const [excessReportOpen, setExcessReportOpen] = useState(false)

  return (
    <main className="flex w-screen h-screen p-[15px] pt-[50px] bg-slate-400">
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
      <button className='h-1/6 w-1/6 bg-cyan-200 m-8 flex items-center justify-center' >
        <button className='h-full w-full ' onClick={() => setSoldTogetherReportOpen(true)}>
          Sold Together Report
        </button>
        <ReportModalWithDate open={soldTogetherReportOpen} onClose={() => setSoldTogetherReportOpen(false)} whichReport={1}>Sold Together Report</ReportModalWithDate>
      </button>
      <button className='h-1/6 w-1/6 bg-cyan-200 m-8 flex items-center justify-center'>
        <div>Excess Report</div>
      </button>
    </main>
  )
  }