import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Overview from './components/Overview'
import './App.css'

function App() {
  return (
    <div className="flex h-screen w-full bg-white">
      <Sidebar />
      <div className="flex-1 p-7">
        <Overview />
      </div>
    </div>
  )
}

export default App
