import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

const ChangePassword = React.lazy(() => import('./views/pages/changePassword/ChangePassword'))

const Users = React.lazy(() => import('./views/pages/users/Users'))
const RedeemRequest = React.lazy(() => import('./views/pages/redeemRequest/RedeemRequest'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/redeemRequest', name: 'Redeem Request', element: RedeemRequest },

  { path: '/ChangePassword', name: 'Change Password', element: ChangePassword },
  { path: '/Users', name: 'Users', element: Users },
]
export default routes
