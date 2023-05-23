import { lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/home',
    element: <Navigate to='/' />
  },
  {
    path: '/',
    Component: lazy(() => import('~/views/Home'))
  },
  {
    path: '/login',
    Component: lazy(() => import('~/views/Login'))
  }
])

export default router
