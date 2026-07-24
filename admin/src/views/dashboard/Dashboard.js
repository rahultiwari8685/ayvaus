import React, { useEffect, useState } from 'react'

import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CButton,
  CSpinner,
  CFormInput,
  CAvatar,
  CBadge,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'

import {
  cilBell,
  cilSearch,
  cilPeople,
  cilWallet,
  cilDollar,
  cilStar,
  cilClock,
  cilUser,
  cilCheckCircle,
  cilXCircle,
} from '@coreui/icons'

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

import secureLocalStorage from 'react-secure-storage'
import setting from '../../setting.json'

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

const Dashboard = () => {
  const [loading, setLoading] = useState(true)
  const [dashboard, setDashboard] = useState({})

  const token = JSON.parse(secureLocalStorage.getItem('logininfo'))?.token || ''

  const loginInfo = JSON.parse(secureLocalStorage.getItem('logininfo')) || {}

  const getDashboard = async () => {
    try {
      setLoading(true)

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
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          height: '80vh',
        }}
      >
        <CSpinner color="primary" />
      </div>
    )
  }

  const registrationChart = {
    labels: dashboard.dailyRegistrations?.map((item) => item.date) || [],

    datasets: [
      {
        label: 'Registrations',
        data: dashboard.dailyRegistrations?.map((item) => item.count) || [],
        borderColor: '#5B5FEF',
        backgroundColor: 'rgba(91,95,239,.15)',
        fill: true,
        tension: 0.4,
      },
    ],
  }

  const rewardChart = {
    labels: dashboard.dailyRewards?.map((item) => item.date) || [],

    datasets: [
      {
        label: 'Coins',
        data: dashboard.dailyRewards?.map((item) => item.coins) || [],
        backgroundColor: '#22C55E',
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

        backgroundColor: ['#F59E0B', '#22C55E', '#EF4444', '#3B82F6'],
      },
    ],
  }

  return (
    <div
      className="dashboard-premium"
      style={{
        background: '#F4F7FE',
        minHeight: '100vh',
        padding: 25,
      }}
    >
      {/* Header */}

      <CRow className="align-items-center mb-4">
        <CCol lg={6}>
          <h2
            style={{
              fontWeight: 700,
            }}
          >
            👋 Welcome Back, {loginInfo.name || 'Admin'}
          </h2>

          <p className="text-medium-emphasis">
            Monitor your Ayvaus platform, rewards, users and analytics.
          </p>
        </CCol>

        <CCol lg={6}>
          <div className="d-flex justify-content-end align-items-center gap-3">
            <div
              style={{
                width: 300,
              }}
            >
              <CFormInput placeholder="Search..." prefix={<CIcon icon={cilSearch} />} />
            </div>

            <CButton color="light" className="shadow-sm">
              <CIcon icon={cilBell} />
            </CButton>

            <CAvatar color="primary">{loginInfo.name?.charAt(0)?.toUpperCase()}</CAvatar>
          </div>
        </CCol>
      </CRow>

      {/* Welcome Banner */}

      <CCard
        className="border-0 shadow mb-4"
        style={{
          borderRadius: 20,
          background: 'linear-gradient(135deg,#5B5FEF,#7C3AED)',
          color: '#fff',
        }}
      >
        <CCardBody>
          <CRow className="align-items-center">
            <CCol lg={8}>
              <h3 className="fw-bold">Ayvaus Analytics Dashboard</h3>

              <p className="mb-3">
                Track users, rewards, earnings, redeems, engagement, and platform growth in real
                time.
              </p>

              <CBadge color="light" textColor="dark">
                Live Dashboard
              </CBadge>
            </CCol>

            <CCol lg={4} className="text-end">
              <img
                src="https://cdn-icons-png.flaticon.com/512/2103/2103633.png"
                alt=""
                width="140"
              />
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {/* =======================
          Premium Statistics Cards
      ======================== */}

      <CRow className="g-4 mb-4">
        {[
          {
            title: 'Total Users',
            value: dashboard.totalUsers || 0,
            icon: cilPeople,
            color: '#5B5FEF',
            growth: '+18%',
          },
          {
            title: 'Total Coins',
            value: (dashboard.totalCoins || 0).toLocaleString(),
            icon: cilWallet,
            color: '#10B981',
            growth: '+12%',
          },
          {
            title: 'Total XP',
            value: (dashboard.totalXP || 0).toLocaleString(),
            icon: cilStar,
            color: '#F59E0B',
            growth: '+24%',
          },
          {
            title: 'Redeemed',
            value: `₹ ${(dashboard.totalRedeemAmount || 0).toLocaleString()}`,
            icon: cilDollar,
            color: '#EF4444',
            growth: '+8%',
          },

          {
            title: 'Pending',
            value: dashboard.pendingRedeems || 0,
            icon: cilClock,
            color: '#3B82F6',
            growth: '+2%',
          },

          {
            title: 'Approved',
            value: dashboard.approvedRedeems || 0,
            icon: cilCheckCircle,
            color: '#22C55E',
            growth: '+11%',
          },

          {
            title: 'Rejected',
            value: dashboard.rejectedRedeems || 0,
            icon: cilXCircle,
            color: '#DC2626',
            growth: '-4%',
          },

          {
            title: 'Rewards',
            value: dashboard.totalRewards || 0,
            icon: cilUser,
            color: '#8B5CF6',
            growth: '+20%',
          },
        ].map((card, index) => (
          <CCol key={index} xl={3} lg={4} md={6}>
            <CCard
              className="border-0 shadow-sm h-100"
              style={{
                borderRadius: 22,
                overflow: 'hidden',
                transition: '.35s',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)'
                e.currentTarget.style.boxShadow = '0 20px 45px rgba(0,0,0,.12)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = ''
              }}
            >
              <CCardBody>
                <div className="d-flex justify-content-between">
                  <div>
                    <small
                      className="text-medium-emphasis"
                      style={{
                        fontSize: 13,
                      }}
                    >
                      {card.title}
                    </small>

                    <h2 className="fw-bold mt-2 mb-2">{card.value}</h2>

                    <CBadge
                      style={{
                        background: '#ECFDF5',
                        color: '#16A34A',
                        padding: '6px 10px',
                        borderRadius: 30,
                        fontWeight: 600,
                      }}
                    >
                      ▲ {card.growth}
                    </CBadge>
                  </div>

                  <div
                    style={{
                      width: 65,
                      height: 65,
                      borderRadius: 20,
                      background: card.color,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <CIcon
                      icon={card.icon}
                      size="xl"
                      style={{
                        color: '#fff',
                      }}
                    />
                  </div>
                </div>

                <div
                  className="mt-4"
                  style={{
                    height: 8,
                    borderRadius: 10,
                    background: '#EEF2FF',
                  }}
                >
                  <div
                    style={{
                      width: 40 + Math.floor(Math.random() * 55) + '%',
                      background: card.color,
                      height: '100%',
                      borderRadius: 10,
                    }}
                  />
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>

      {/* =======================
            Quick Overview
      ======================== */}

      <CRow className="mb-4">
        <CCol lg={8}>
          <CCard
            className="border-0 shadow-sm"
            style={{
              borderRadius: 20,
            }}
          >
            <CCardBody>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="fw-bold mb-1">Platform Overview</h4>

                  <small className="text-medium-emphasis">Live system statistics</small>
                </div>

                <CBadge color="success">LIVE</CBadge>
              </div>

              <CRow>
                <CCol md={3}>
                  <h5 className="fw-bold">{(dashboard.totalUsers || 0).toLocaleString()}</h5>
                  <small>Total Users</small>
                </CCol>

                <CCol md={3}>
                  <h5 className="fw-bold">{(dashboard.totalRewards || 0).toLocaleString()}</h5>
                  <small>Rewards</small>
                </CCol>

                <CCol md={3}>
                  <h5 className="fw-bold">{(dashboard.totalCoins || 0).toLocaleString()}</h5>
                  <small>Coins</small>
                </CCol>

                <CCol md={3}>
                  <h5 className="fw-bold">
                    ₹ {(dashboard.totalRedeemAmount || 0).toLocaleString()}
                  </h5>
                  <small>Redeemed</small>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol lg={4}>
          <CCard
            className="border-0 shadow-sm"
            style={{
              borderRadius: 20,
              background: 'linear-gradient(135deg,#111827,#1F2937)',
              color: '#fff',
            }}
          >
            <CCardBody>
              <h5 className="fw-bold">Today's Performance</h5>

              <hr
                style={{
                  opacity: 0.15,
                }}
              />

              <div className="d-flex justify-content-between mb-3">
                <span>Registrations</span>
                <strong>{dashboard.dailyRegistrations?.length || 0}</strong>
              </div>

              <div className="d-flex justify-content-between mb-3">
                <span>Rewards Given</span>
                <strong>{dashboard.dailyRewards?.length || 0}</strong>
              </div>

              <div className="d-flex justify-content-between mb-3">
                <span>Pending Redeems</span>
                <strong>{dashboard.pendingRedeems || 0}</strong>
              </div>

              <div className="d-flex justify-content-between">
                <span>Approved</span>
                <strong>{dashboard.approvedRedeems || 0}</strong>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* ======================================
        Premium Analytics Section
====================================== */}

      <CRow className="mb-4">
        <CCol lg={8}>
          <CCard
            className="border-0 shadow-sm"
            style={{
              borderRadius: 22,
            }}
          >
            <CCardBody>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="fw-bold mb-1">📈 User Registration Analytics</h4>

                  <small className="text-medium-emphasis">Growth of newly registered users</small>
                </div>

                <div className="d-flex gap-2">
                  <CButton color="light" size="sm">
                    7 Days
                  </CButton>

                  <CButton color="primary" size="sm">
                    30 Days
                  </CButton>

                  <CButton color="light" size="sm">
                    Year
                  </CButton>

                  <CButton color="success" size="sm">
                    Export
                  </CButton>
                </div>
              </div>

              <Line
                data={registrationChart}
                height={100}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,

                  interaction: {
                    intersect: false,
                    mode: 'index',
                  },

                  plugins: {
                    legend: {
                      display: false,
                    },

                    tooltip: {
                      backgroundColor: '#111827',
                    },
                  },

                  scales: {
                    x: {
                      grid: {
                        display: false,
                      },
                    },

                    y: {
                      beginAtZero: true,

                      grid: {
                        color: '#F3F4F6',
                      },
                    },
                  },
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>

        <CCol lg={4}>
          <CCard
            className="border-0 shadow-sm h-100"
            style={{
              borderRadius: 22,
            }}
          >
            <CCardBody>
              <div className="d-flex justify-content-between mb-4">
                <div>
                  <h4 className="fw-bold">🍩 Redeem Status</h4>

                  <small className="text-medium-emphasis">Current Requests</small>
                </div>

                <CBadge color="info">Live</CBadge>
              </div>

              <div
                style={{
                  height: 260,
                }}
              >
                <Doughnut
                  data={redeemChart}
                  options={{
                    responsive: true,

                    plugins: {
                      legend: {
                        position: 'bottom',

                        labels: {
                          padding: 20,
                          usePointStyle: true,
                        },
                      },
                    },

                    cutout: '72%',
                  }}
                />
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* ======================================
        Reward Analytics
====================================== */}

      <CRow className="mb-4">
        <CCol lg={12}>
          <CCard
            className="border-0 shadow-sm"
            style={{
              borderRadius: 22,
            }}
          >
            <CCardBody>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="fw-bold mb-1">🪙 Daily Reward Distribution</h4>

                  <small className="text-medium-emphasis">Coins distributed to users</small>
                </div>

                <CBadge color="success">Updated Live</CBadge>
              </div>

              <Bar
                data={rewardChart}
                height={90}
                options={{
                  responsive: true,

                  maintainAspectRatio: false,

                  plugins: {
                    legend: {
                      display: false,
                    },
                  },

                  scales: {
                    x: {
                      grid: {
                        display: false,
                      },
                    },

                    y: {
                      beginAtZero: true,

                      grid: {
                        color: '#F3F4F6',
                      },
                    },
                  },
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* ======================================
          KPI Summary Cards
====================================== */}

      <CRow className="g-4 mb-5">
        <CCol md={3}>
          <CCard
            className="border-0 shadow-sm text-center"
            style={{
              borderRadius: 20,
            }}
          >
            <CCardBody>
              <h2 className="fw-bold text-primary">{dashboard.pendingRedeems || 0}</h2>

              <small>Pending Requests</small>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol md={3}>
          <CCard
            className="border-0 shadow-sm text-center"
            style={{
              borderRadius: 20,
            }}
          >
            <CCardBody>
              <h2 className="fw-bold text-success">{dashboard.approvedRedeems || 0}</h2>

              <small>Approved Requests</small>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol md={3}>
          <CCard
            className="border-0 shadow-sm text-center"
            style={{
              borderRadius: 20,
            }}
          >
            <CCardBody>
              <h2 className="fw-bold text-danger">{dashboard.rejectedRedeems || 0}</h2>

              <small>Rejected Requests</small>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol md={3}>
          <CCard
            className="border-0 shadow-sm text-center"
            style={{
              borderRadius: 20,
            }}
          >
            <CCardBody>
              <h2 className="fw-bold text-warning">
                ₹ {(dashboard.totalRedeemAmount || 0).toLocaleString()}
              </h2>

              <small>Total Redeemed</small>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* ======================================
        Recent Users & Redeems
====================================== */}

      <CRow className="g-4 mb-4">
        {/* Recent Users */}

        <CCol lg={6}>
          <CCard className="border-0 shadow-sm" style={{ borderRadius: 22 }}>
            <CCardBody>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="fw-bold mb-1">👥 Recent Users</h4>

                  <small className="text-medium-emphasis">Newly registered users</small>
                </div>

                <CButton color="primary" size="sm" variant="outline">
                  View All
                </CButton>
              </div>

              {dashboard.recentUsers?.length > 0 ? (
                dashboard.recentUsers.map((user) => (
                  <div
                    key={user._id}
                    className="d-flex justify-content-between align-items-center mb-3 p-3"
                    style={{
                      borderRadius: 18,
                      background: '#F8FAFC',
                      transition: '.3s',
                    }}
                  >
                    <div className="d-flex align-items-center">
                      <CAvatar color="primary" size="lg">
                        {user.name?.charAt(0)}
                      </CAvatar>

                      <div className="ms-3">
                        <h6 className="mb-1 fw-bold">{user.name}</h6>

                        <small className="text-medium-emphasis">{user.email}</small>

                        <div className="mt-2">
                          <CBadge color="success" className="me-2">
                            💰 {user.coins}
                          </CBadge>

                          <CBadge color="warning" className="me-2">
                            ⭐ {user.xp}
                          </CBadge>

                          <CBadge color="primary">Level {user.level}</CBadge>
                        </div>
                      </div>
                    </div>

                    <div>
                      <CButton color="primary" size="sm">
                        View
                      </CButton>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-5">
                  <h6>No Recent Users</h6>
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>

        {/* Redeem Requests */}

        <CCol lg={6}>
          <CCard className="border-0 shadow-sm" style={{ borderRadius: 22 }}>
            <CCardBody>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="fw-bold mb-1">💸 Recent Redeems</h4>

                  <small className="text-medium-emphasis">Latest withdrawal requests</small>
                </div>

                <CButton color="success" size="sm" variant="outline">
                  View All
                </CButton>
              </div>

              {dashboard.recentRedeems?.length > 0 ? (
                dashboard.recentRedeems.map((item) => (
                  <div
                    key={item._id}
                    className="d-flex justify-content-between align-items-center mb-3 p-3"
                    style={{
                      borderRadius: 18,
                      background: '#F8FAFC',
                    }}
                  >
                    <div>
                      <h6 className="fw-bold mb-1">{item.user?.name}</h6>

                      <small className="text-medium-emphasis">
                        💰 {item.coins} Coins
                        <br />₹ {item.amount}
                      </small>
                    </div>

                    <div>
                      {item.status === 'pending' && <CBadge color="warning">Pending</CBadge>}

                      {item.status === 'approved' && <CBadge color="success">Approved</CBadge>}

                      {item.status === 'paid' && <CBadge color="primary">Paid</CBadge>}

                      {item.status === 'rejected' && <CBadge color="danger">Rejected</CBadge>}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-5">
                  <h6>No Redeem Requests</h6>
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* ==========================================================
                    TOP LEADERBOARDS
========================================================== */}

      <CRow className="g-4 mb-4">
        {/* ==================== TOP XP USERS ==================== */}

        <CCol lg={6}>
          <CCard className="border-0 shadow-sm" style={{ borderRadius: 22 }}>
            <CCardBody>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="fw-bold mb-1">🏆 Top XP Champions</h4>

                  <small className="text-medium-emphasis">Highest experience users</small>
                </div>

                <CBadge color="warning">TOP 10</CBadge>
              </div>

              {dashboard.topXPUsers?.length ? (
                dashboard.topXPUsers.map((user, index) => {
                  const rankColor =
                    index === 0
                      ? '#FFD700'
                      : index === 1
                        ? '#C0C0C0'
                        : index === 2
                          ? '#CD7F32'
                          : '#5B5FEF'

                  const medal =
                    index === 0 ? '👑' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`

                  return (
                    <div
                      key={user._id}
                      className="mb-3 p-3"
                      style={{
                        borderRadius: 18,
                        background: '#F8FAFC',
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <div
                            style={{
                              width: 55,
                              height: 55,
                              borderRadius: '50%',
                              background: rankColor,
                              color: '#fff',
                              fontWeight: 700,
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              fontSize: 20,
                            }}
                          >
                            {medal}
                          </div>

                          <div className="ms-3">
                            <h6 className="fw-bold mb-1">{user.name}</h6>

                            <small className="text-medium-emphasis">Level {user.level}</small>
                          </div>
                        </div>

                        <div className="text-end">
                          <h5 className="fw-bold mb-0" style={{ color: '#F59E0B' }}>
                            ⭐ {user.xp.toLocaleString()}
                          </h5>

                          <small>XP</small>
                        </div>
                      </div>

                      <div
                        className="mt-3"
                        style={{
                          height: 8,
                          background: '#E5E7EB',
                          borderRadius: 20,
                        }}
                      >
                        <div
                          style={{
                            width: `${Math.min(
                              (user.xp / (dashboard.topXPUsers[0]?.xp || 1)) * 100,
                              100,
                            )}%`,
                            background: rankColor,
                            height: '100%',
                            borderRadius: 20,
                          }}
                        />
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-5">
                  <h6>No Data Available</h6>
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>

        {/* ==================== TOP COIN USERS ==================== */}

        <CCol lg={6}>
          <CCard className="border-0 shadow-sm" style={{ borderRadius: 22 }}>
            <CCardBody>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="fw-bold mb-1">💰 Top Coin Holders</h4>

                  <small className="text-medium-emphasis">Users with maximum coins</small>
                </div>

                <CBadge color="success">TOP 10</CBadge>
              </div>

              {dashboard.topCoinUsers?.length ? (
                dashboard.topCoinUsers.map((user, index) => {
                  const rankColor =
                    index === 0
                      ? '#FFD700'
                      : index === 1
                        ? '#C0C0C0'
                        : index === 2
                          ? '#CD7F32'
                          : '#10B981'

                  const medal =
                    index === 0 ? '👑' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`

                  return (
                    <div
                      key={user._id}
                      className="mb-3 p-3"
                      style={{
                        borderRadius: 18,
                        background: '#F8FAFC',
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <div
                            style={{
                              width: 55,
                              height: 55,
                              borderRadius: '50%',
                              background: rankColor,
                              color: '#fff',
                              fontWeight: 700,
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              fontSize: 20,
                            }}
                          >
                            {medal}
                          </div>

                          <div className="ms-3">
                            <h6 className="fw-bold mb-1">{user.name}</h6>

                            <small className="text-medium-emphasis">Level {user.level}</small>
                          </div>
                        </div>

                        <div className="text-end">
                          <h5 className="fw-bold mb-0" style={{ color: '#10B981' }}>
                            💰 {user.coins.toLocaleString()}
                          </h5>

                          <small>Coins</small>
                        </div>
                      </div>

                      <div
                        className="mt-3"
                        style={{
                          height: 8,
                          background: '#E5E7EB',
                          borderRadius: 20,
                        }}
                      >
                        <div
                          style={{
                            width: `${Math.min(
                              (user.coins / (dashboard.topCoinUsers[0]?.coins || 1)) * 100,
                              100,
                            )}%`,
                            background: rankColor,
                            height: '100%',
                            borderRadius: 20,
                          }}
                        />
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-5">
                  <h6>No Data Available</h6>
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* ==========================================================
                    ACTIVITY & QUICK ACTIONS
========================================================== */}

      <CRow className="g-4 mb-4">
        {/* Activity Timeline */}

        <CCol lg={8}>
          <CCard className="border-0 shadow-sm" style={{ borderRadius: 22 }}>
            <CCardBody>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="fw-bold">🔔 Latest Activities</h4>

                  <small className="text-medium-emphasis">Recent platform activities</small>
                </div>

                <CBadge color="info">Live Feed</CBadge>
              </div>

              {dashboard.activities?.length ? (
                dashboard.activities.map((item, index) => (
                  <div key={index} className="d-flex mb-4">
                    <div
                      style={{
                        width: 14,
                        height: 14,
                        background: '#5B5FEF',
                        borderRadius: '50%',
                        marginTop: 6,
                        marginRight: 18,
                        flexShrink: 0,
                      }}
                    />

                    <div
                      style={{
                        borderLeft: '2px solid #EEF2FF',
                        paddingLeft: 18,
                        marginLeft: -25,
                        paddingBottom: 20,
                        width: '100%',
                      }}
                    >
                      <h6 className="fw-bold mb-1">{item.user}</h6>

                      <p className="mb-1 text-medium-emphasis">{item.message}</p>

                      <small className="text-secondary">{item.time}</small>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-5">
                  <h6>No Recent Activity</h6>
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>

        {/* Quick Actions */}

        <CCol lg={4}>
          <CCard className="border-0 shadow-sm" style={{ borderRadius: 22 }}>
            <CCardBody>
              <h4 className="fw-bold mb-4">⚡ Quick Actions</h4>

              <div className="d-grid gap-3">
                <CButton color="primary" size="lg">
                  👥 Manage Users
                </CButton>

                <CButton color="success" size="lg">
                  🎁 Manage Rewards
                </CButton>

                <CButton color="warning" size="lg">
                  💸 Redeem Requests
                </CButton>

                <CButton color="info" size="lg">
                  ⚙ Settings
                </CButton>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* ==========================================================
                    SYSTEM HEALTH
========================================================== */}

      <CRow className="g-4 mb-4">
        <CCol md={3}>
          <CCard className="border-0 shadow-sm text-center" style={{ borderRadius: 22 }}>
            <CCardBody>
              <div
                style={{
                  fontSize: 45,
                }}
              >
                🟢
              </div>

              <h5 className="fw-bold mt-2">Server Online</h5>

              <small className="text-success">Running Normally</small>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol md={3}>
          <CCard className="border-0 shadow-sm text-center" style={{ borderRadius: 22 }}>
            <CCardBody>
              <div
                style={{
                  fontSize: 45,
                }}
              >
                💾
              </div>

              <h4 className="fw-bold mt-2">{dashboard.storage || '12.4 GB'}</h4>

              <small>Storage Used</small>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol md={3}>
          <CCard className="border-0 shadow-sm text-center" style={{ borderRadius: 22 }}>
            <CCardBody>
              <div
                style={{
                  fontSize: 45,
                }}
              >
                📡
              </div>

              <h4 className="fw-bold mt-2">Connected</h4>

              <small>Database Status</small>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol md={3}>
          <CCard
            className="border-0 shadow-sm text-center"
            style={{
              borderRadius: 22,
              background: 'linear-gradient(135deg,#5B5FEF,#7C3AED)',
              color: '#fff',
            }}
          >
            <CCardBody>
              <div
                style={{
                  fontSize: 45,
                }}
              >
                🚀
              </div>

              <h4 className="fw-bold mt-2">v1.0.0</h4>

              <small>Ayvaus Admin</small>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* ==========================================================
                        FOOTER
========================================================== */}

      <CCard
        className="border-0 shadow-sm"
        style={{
          borderRadius: 22,
          background: '#111827',
          color: '#fff',
        }}
      >
        <CCardBody>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="fw-bold mb-1">Ayvaus Admin Dashboard</h5>

              <small
                style={{
                  opacity: 0.7,
                }}
              >
                Built with React, CoreUI & Chart.js
              </small>
            </div>

            <div className="text-end">
              <h6 className="mb-1">Version 1.0.0</h6>

              <small
                style={{
                  opacity: 0.7,
                }}
              >
                © 2026 Ayvaus. All Rights Reserved.
              </small>
            </div>
          </div>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default Dashboard
