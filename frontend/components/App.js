import React from 'react'
import Home from './Home'
import Form from './Form'
import { Route, Routes, Navigate, NavLink } from 'react-router-dom';

function App() {
  return (
    <div id="app">
      <nav>
         <NavLink to="/">
           Home
         </NavLink>
         <NavLink to="/order">
           Order
         </NavLink>
        {/* NavLinks here */}
      </nav>
      {/* Route and Routes are here */}
     <Routes>
       <Route path='/' element={<Home />}/>
       <Route path='/order' element={ <Form />} />
     
     </Routes>
    </div>
  )
}

export default App
