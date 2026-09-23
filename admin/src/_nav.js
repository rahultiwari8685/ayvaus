import React from 'react'
import CIcon from '@coreui/icons-react'
import { CNavGroup, CNavItem } from '@coreui/react'
import {
  cilSpeedometer,
  cilPeople,
  cilSettings,
  cilDollar,
  cilGift,
  cilChatBubble,
  cilUser,
} from '@coreui/icons'

export const navigation = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Users',
    to: '/users',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Redeem Requests',
    to: '/redeemRequest',
    icon: <CIcon icon={cilDollar} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Corporate Verification',
    to: '/corporate/verification',
  },
]
