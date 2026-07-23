import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CCol, CRow, CProgress, CProgressBar } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPeople, cilUser, cilUserX, cilMoney, cilCalendar } from '@coreui/icons'
import setting from '../../setting.json'
import secureLocalStorage from 'react-secure-storage'

const Dashboard = () => {
  const [stats, setStats] = useState([
    {
      title: 'Total News',
      count: 0,
      goal: 100,
      icon: cilPeople,
      gradient: 'linear-gradient(135deg, #0d6efd 0%, #67b0fd 100%)',
    },
    {
      title: 'Draft News',
      count: 0,
      goal: 50,
      icon: cilUser,
      gradient: 'linear-gradient(135deg, #dc3545 0%, #ff6b81 100%)',
    },
    {
      title: 'Category',
      count: 0,
      goal: 40,
      icon: cilUserX,
      gradient: 'linear-gradient(135deg, #198754 0%, #66d9a4 100%)',
    },
    {
      title: 'Deleted News',
      count: 0,
      goal: 30,
      icon: cilMoney,
      gradient: 'linear-gradient(135deg, #fd7e14 0%, #ffae52 100%)',
    },
  ])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = JSON.parse(secureLocalStorage.getItem('logininfo'))?.token

        // ✅ Fetch News
        const newsRes = await fetch(setting.api + '/api/news/getAllNews', {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        })
        const newsData = await newsRes.json()

        const allNews = newsData.data || []

        // ✅ Calculate counts
        const totalNews = allNews.length
        const draftNews = allNews.filter((n) => n.type === 2).length
        const deletedNews = allNews.filter((n) => n.isDeleted === true).length

        // ✅ Fetch Categories
        const catRes = await fetch(setting.api + '/api/categories/getAllCategory')
        const catData = await catRes.json()

        const totalCategory = catData.data?.length || 0

        // ✅ Update Stats
        setStats((prev) => [
          { ...prev[0], count: totalNews },
          { ...prev[1], count: draftNews },
          { ...prev[2], count: totalCategory },
          { ...prev[3], count: deletedNews },
        ])
      } catch (error) {
        console.error('Dashboard Error:', error)
      }
    }

    fetchDashboardData()
  }, [])

  const maxCount = Math.max(...stats.map((s) => s.count), 1)

  return (
    <div className="p-4">
      <CRow className="g-4">
        {stats.map((item, index) => {
          const progress = Math.min((item.count / maxCount) * 100, 100)

          return (
            <CCol md={6} lg={3} sm={12} key={index}>
              <CCard
                className="text-white shadow border-0 h-100"
                style={{
                  background: item.gradient,
                  borderRadius: '1rem',
                }}
              >
                <CCardBody className="d-flex flex-column justify-content-between p-4">
                  <div className="d-flex align-items-center mb-3">
                    <div
                      className="icon-wrapper bg-white text-primary d-flex align-items-center justify-content-center rounded-circle me-3"
                      style={{ width: '50px', height: '50px' }}
                    >
                      <CIcon icon={item.icon} size="lg" />
                    </div>
                    <div>
                      <h5 className="fw-bold mb-1">{item.title}</h5>
                      <small>{item.count}</small>
                    </div>
                  </div>

                  <CProgress
                    className="rounded-pill"
                    style={{
                      height: '10px',
                      backgroundColor: 'rgba(255,255,255,0.3)',
                    }}
                  >
                    <CProgressBar
                      value={progress}
                      style={{
                        backgroundColor: '#fff',
                        transition: 'width 0.6s ease',
                      }}
                    />
                  </CProgress>
                </CCardBody>
              </CCard>
            </CCol>
          )
        })}
      </CRow>
    </div>
  )
}

export default Dashboard
