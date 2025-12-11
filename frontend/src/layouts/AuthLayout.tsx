import React from 'react'
import { Outlet } from 'react-router-dom'

const AuthLayout: React.FC = () => {
  return (
    <div>
      <>asas</>
      <Outlet />  {/* ← ADD THIS! This is where Login renders */}
    </div>
  )
}

export default AuthLayout