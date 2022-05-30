import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'

const PrivateOutlet = ({authorised}) => {
  return (
    authorised ? <Outlet/> : <Navigate to="/login" />
  )
}

export default PrivateOutlet