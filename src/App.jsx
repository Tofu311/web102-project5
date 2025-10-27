import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import './App.css'

function App() {
  return (
    <div className="flex h-screen w-full bg-neutral-100">
      <Sidebar />
      <div className="flex-1 p-7">
      </div>
    </div>
  )
}

export default App
