import { Route, Routes } from 'react-router-dom'

import  HOMEPAGE  from './pages/HOMEPAGE.jsx'
import  LOGINPAGE  from './pages/LOGINPAGE.jsx'
import  REGISTERPAGE from './pages/REGISTERPAGE.jsx'
import STAFFDASHBOARD from './pages/STAFFDASHBOARD.jsx'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HOMEPAGE />} />
      <Route path="/login" element={<LOGINPAGE />} />
      <Route path="/register" element={<REGISTERPAGE />} />
      <Route path='/STAFFDASHBOARD' element={<STAFFDASHBOARD/>}/>
    </Routes>
  )
}

export default App