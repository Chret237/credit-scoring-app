import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Dashboard from '../pages/dashboard'
import Predictions from '../pages/predictions'
import NewPrediction from '../pages/newPrediction'

const Display = () => {
  return (
    <div className='text-white'>
        <Routes>
            <Route path='/' element={<Dashboard/>} />
            <Route path='/Predictions' element={<Predictions/>} />
            <Route path='/New_Prediction/*' element={<NewPrediction/>} />
        </Routes>
    </div>
  )
}

export default Display