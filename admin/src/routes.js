import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const News = React.lazy(() => import('./views/pages/news/News'))
const UpdateNews = React.lazy(() => import('./views/pages/news/UpdateNews'))
const PublishedNews = React.lazy(() => import('./views/pages/news/PublishedNews'))
const DraftNews = React.lazy(() => import('./views/pages/news/DraftNews'))
const DeletedNews = React.lazy(() => import('./views/pages/news/DeletedNews'))
const ChangePassword = React.lazy(() => import('./views/pages/changePassword/ChangePassword'))
const ScheduleNews = React.lazy(() => import('./views/pages/news/ScheduleNews'))

const Users = React.lazy(() => import('./views/pages/users/Users'))
const Category = React.lazy(() => import('./views/pages/category/Category'))
const Advertisement = React.lazy(() => import('./views/pages/advertisement/Advertisement'))
const SiteSetting = React.lazy(() => import('./views/pages/siteSetting/SiteSetting'))
const Shorts = React.lazy(() => import('./views/pages/shorts/Shorts'))
const RedeemRequest = React.lazy(() => import('./views/pages/redeem/RedeemRequest'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },

  { path: '/news', name: 'News', element: News },
  { path: '/UpdateNews/:id', name: 'Update News', element: UpdateNews },
  { path: '/PublishedNews', name: 'Published News', element: PublishedNews },
  { path: '/DraftNews', name: 'Draft News', element: DraftNews },
  { path: '/DeletedNews', name: 'Deleted News', element: DeletedNews },
  { path: '/ScheduleNews', name: 'Scheduled News', element: ScheduleNews },
  { path: '/siteSetting', name: 'Site Setting', element: SiteSetting },
  { path: '/redeemRequests', name: 'Site Setting', element: RedeemRequest },

  { path: '/ChangePassword', name: 'Change Password', element: ChangePassword },
  { path: '/Users', name: 'Users', element: Users },
  { path: '/Category', name: 'Category', element: Category },
  { path: '/advertisement', name: 'Advertisement', element: Advertisement },
  { path: '/shorts', name: 'Shorts', element: Shorts },
]
export default routes
