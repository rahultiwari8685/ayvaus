import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CSpinner, CWidgetStatsA } from '@coreui/react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

import { Line, Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
)
import CIcon from '@coreui/icons-react'

import {
  cilPeople,
  cilDollar,
  cilWallet,
  cilUser,
  cilCheckCircle,
  cilXCircle,
  cilClock,
  cilStar,
} from '@coreui/icons'

import secureLocalStorage from 'react-secure-storage'
import setting from '../../../setting.json'

const Dashboard = () => {
  const [loading, setLoading] = useState(true)

  const [dashboard, setDashboard] = useState({})

  const token = JSON.parse(secureLocalStorage.getItem('logininfo'))?.token || ''

  const getDashboard = async () => {
    setLoading(true)

    try {
      const response = await fetch(setting.api + '/api/dashboard/admin', {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })

      const result = await response.json()

      if (result.success) {
        setDashboard(result.data)
      }
    } catch (err) {
      console.log(err)
    }

    setLoading(false)
  }

  useEffect(() => {
    getDashboard()
  }, [])

  if (loading) {
    return (
      <div className="text-center py-5">
        <CSpinner />
      </div>
    )
  }

  const registrationChart = {
    labels: dashboard.dailyRegistrations?.map((item) => item.date) || [],

    datasets: [
      {
        label: 'Registrations',
        data: dashboard.dailyRegistrations?.map((item) => item.count) || [],
        borderColor: '#321FDB',
        backgroundColor: 'rgba(50,31,219,.2)',
        tension: 0.4,
        fill: true,
      },
    ],
  }

  const rewardChart = {
    labels: dashboard.dailyRewards?.map((item) => item.date) || [],

    datasets: [
      {
        label: 'Coins Rewarded',
        data: dashboard.dailyRewards?.map((item) => item.coins) || [],
        backgroundColor: '#2EB85C',
      },
    ],
  }

  const redeemChart = {
    labels: ['Pending', 'Approved', 'Rejected', 'Paid'],

    datasets: [
      {
        data: [
          dashboard.pendingRedeems || 0,
          dashboard.approvedRedeems || 0,
          dashboard.rejectedRedeems || 0,
          dashboard.paidRedeems || 0,
        ],

        backgroundColor: ['#F9B115', '#2EB85C', '#E55353', '#3399FF'],
      },
    ],
  }

  return (
    <>
      <CRow>
        <CCol md={3}>
          <CWidgetStatsA
            color="primary"
            value={dashboard.totalUsers || 0}
            title="Total Users"
            icon={<CIcon icon={cilPeople} height={30} />}
          />
        </CCol>

        <CCol md={3}>
          <CWidgetStatsA
            color="success"
            value={dashboard.totalCoins || 0}
            title="Total Coins"
            icon={<CIcon icon={cilWallet} height={30} />}
          />
        </CCol>

        <CCol md={3}>
          <CWidgetStatsA
            color="warning"
            value={dashboard.totalXP || 0}
            title="Total XP"
            icon={<CIcon icon={cilStar} height={30} />}
          />
        </CCol>

        <CCol md={3}>
          <CWidgetStatsA
            color="danger"
            value={'₹ ' + (dashboard.totalRedeemAmount || 0)}
            title="Redeemed Amount"
            icon={<CIcon icon={cilDollar} height={30} />}
          />
        </CCol>
      </CRow>

      <CRow className="mt-4">
        <CCol md={3}>
          <CWidgetStatsA
            color="info"
            value={dashboard.pendingRedeems || 0}
            title="Pending Redeems"
            icon={<CIcon icon={cilClock} height={30} />}
          />
        </CCol>

        <CCol md={3}>
          <CWidgetStatsA
            color="success"
            value={dashboard.approvedRedeems || 0}
            title="Approved"
            icon={<CIcon icon={cilCheckCircle} height={30} />}
          />
        </CCol>

        <CCol md={3}>
          <CWidgetStatsA
            color="danger"
            value={dashboard.rejectedRedeems || 0}
            title="Rejected"
            icon={<CIcon icon={cilXCircle} height={30} />}
          />
        </CCol>

        <CCol md={3}>
          <CWidgetStatsA
            color="secondary"
            value={dashboard.totalRewards || 0}
            title="Rewards"
            icon={<CIcon icon={cilUser} height={30} />}
          />
        </CCol>
      </CRow>

      <CRow className="mt-4">
        <CCol lg={6}>
          <CCard>
            <CCardHeader>Recent Users</CCardHeader>

            <CCardBody>
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Coins</th>
                  </tr>
                </thead>

                <tbody>
                  {dashboard.recentUsers?.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.coins}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol lg={6}>
          <CCard>
            <CCardHeader>Recent Redeem Requests</CCardHeader>

            <CCardBody>
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Coins</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {dashboard.recentRedeems?.map((item) => (
                    <tr key={item._id}>
                      <td>{item.user?.name}</td>
                      <td>{item.coins}</td>
                      <td>₹ {item.amount}</td>
                      <td>{item.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow className="mt-4">
        <CCol lg={8}>
          <CCard>
            <CCardHeader>Daily User Registrations</CCardHeader>

            <CCardBody>
              <Line
                data={registrationChart}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: true,
                    },
                  },
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>

        <CCol lg={4}>
          <CCard>
            <CCardHeader>Redeem Status</CCardHeader>

            <CCardBody>
              <Doughnut data={redeemChart} />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow className="mt-4">
        <CCol lg={12}>
          <CCard>
            <CCardHeader>Daily Reward Distribution</CCardHeader>

            <CCardBody>
              <Bar
                data={rewardChart}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: true,
                    },
                  },
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow className="mt-4">
        <CCol lg={6}>
          <CCard>
            <CCardHeader>🏆 Top 10 Users (XP)</CCardHeader>

            <CCardBody>
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>XP</th>
                    <th>Level</th>
                  </tr>
                </thead>

                <tbody>
                  {dashboard.topXPUsers?.map((user, index) => (
                    <tr key={user._id}>
                      <td>{index + 1}</td>
                      <td>{user.name}</td>
                      <td>{user.xp}</td>
                      <td>{user.level}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol lg={6}>
          <CCard>
            <CCardHeader>💰 Top 10 Users (Coins)</CCardHeader>

            <CCardBody>
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Coins</th>
                    <th>Level</th>
                  </tr>
                </thead>

                <tbody>
                  {dashboard.topCoinUsers?.map((user, index) => (
                    <tr key={user._id}>
                      <td>{index + 1}</td>
                      <td>{user.name}</td>
                      <td>{user.coins}</td>
                      <td>{user.level}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow className="mt-4">
        <CCol lg={8}>
          <CCard>
            <CCardHeader>🔔 Latest Activities</CCardHeader>

            <CCardBody>
              <ul className="list-group">
                {dashboard.activities?.map((item) => (
                  <li key={item._id} className="list-group-item d-flex justify-content-between">
                    <div>
                      <strong>{item.user}</strong>

                      <br />

                      <small>{item.message}</small>
                    </div>

                    <small>{item.time}</small>
                  </li>
                ))}
              </ul>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol lg={4}>
          <CCard>
            <CCardHeader>⚡ Quick Actions</CCardHeader>

            <CCardBody className="d-grid gap-2">
              <CButton color="primary">Manage Users</CButton>

              <CButton color="success">Reward Requests</CButton>

              <CButton color="warning">Redeem Requests</CButton>

              <CButton color="info">Settings</CButton>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow className="mt-4 mb-4">
        <CCol md={3}>
          <CWidgetStatsA color="success" title="Server Status" value="Online" />
        </CCol>

        <CCol md={3}>
          <CWidgetStatsA color="info" title="Database" value="Connected" />
        </CCol>

        <CCol md={3}>
          <CWidgetStatsA color="warning" title="Storage Used" value={dashboard.storage || '0 GB'} />
        </CCol>

        <CCol md={3}>
          <CWidgetStatsA color="primary" title="App Version" value="v1.0.0" />
        </CCol>
      </CRow>
    </>
  )
}
