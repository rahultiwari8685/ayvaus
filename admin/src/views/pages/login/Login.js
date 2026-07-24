import React, { useState } from 'react'
import { CContainer, CRow, CCol, CCard, CCardBody, CForm, CButton, CSpinner } from '@coreui/react'

import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import toast from 'react-hot-toast'
import secureLocalStorage from 'react-secure-storage'

import { cilUser, cilLockLocked, cilLowVision, cilShieldAlt } from '@coreui/icons'

import CIcon from '@coreui/icons-react'

import setting from '../../../setting.json'

import './Login.css'

const schema = yup.object({
  email: yup.string().email('Please enter valid email').required('Email is required'),

  password: yup.string().required('Password is required'),
})

const Login = () => {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)

  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const login = async (data) => {
    setLoading(true)

    try {
      const response = await fetch(
        setting.api + '/api/serious/login',

        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify(data),
        },
      )

      const result = await response.json()

      if (result.success) {
        secureLocalStorage.setItem(
          'logininfo',

          JSON.stringify({
            token: result.token,

            role: result.role,

            user: result.user,
          }),
        )

        toast.success('Welcome Back 👋')

        navigate('/dashboard')
      } else {
        toast.error(result.message)
      }
    } catch (err) {
      toast.error('Server Error')
    }

    setLoading(false)
  }

  return (
    <div className="login-page">
      <div className="blob blob1"></div>
      <div className="blob blob2"></div>
      <div className="blob blob3"></div>
      <div className="grid-overlay"></div>

      <CContainer fluid>
        <CRow className="min-vh-100">
          {/* LEFT */}

          <CCol lg={6} className="left-panel d-none d-lg-flex">
            <div className="left-content">
              <div className="premium-badge">🚀 Premium Administration</div>

              <h1>
                Manage
                <br />
                Flirtaus
                <br />
                Like Never Before
              </h1>

              <p>
                A modern administration dashboard to manage users, rewards, analytics, moderation,
                redeems and platform monitoring.
              </p>

              <div className="stats-grid">
                <div className="stats-card">
                  <h2>25K+</h2>

                  <p>Active Users</p>
                </div>

                <div className="stats-card">
                  <h2>₹12.5L</h2>

                  <p>Redeemed</p>
                </div>

                <div className="stats-card">
                  <h2>1.8M</h2>

                  <p>XP Earned</p>
                </div>

                <div className="stats-card">
                  <h2>99.9%</h2>

                  <p>Server Uptime</p>
                </div>
              </div>

              <div className="feature-list">
                <div className="feature">
                  ⚡
                  <div>
                    <h5>Lightning Fast</h5>

                    <span>Real-time dashboard updates</span>
                  </div>
                </div>

                <div className="feature">
                  📊
                  <div>
                    <h5>Analytics</h5>

                    <span>Monitor users and rewards</span>
                  </div>
                </div>

                <div className="feature">
                  🔐
                  <div>
                    <h5>Enterprise Security</h5>

                    <span>Secure authentication system</span>
                  </div>
                </div>
              </div>
            </div>
          </CCol>

          {/* RIGHT */}

          <CCol lg={6} className="right-panel">
            <div className="login-wrapper">
              <CCard className="login-card border-0">
                <CCardBody>
                  <div className="login-logo">
                    <div className="logo-circle">⚡</div>

                    <h2>Welcome Back</h2>

                    <p>Sign in to continue</p>
                  </div>

                  <CForm onSubmit={handleSubmit(login)}>
                    {/* Email */}

                    <div className="form-group">
                      <label>Email Address</label>

                      <div className="input-box">
                        <CIcon icon={cilUser} className="input-icon" />

                        <input type="email" placeholder="Enter your email" {...register('email')} />
                      </div>

                      {errors.email && <small className="error-text">{errors.email.message}</small>}
                    </div>

                    {/* Password */}

                    <div className="form-group">
                      <label>Password</label>

                      <div className="input-box">
                        <CIcon icon={cilLockLocked} className="input-icon" />

                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter password"
                          {...register('password')}
                        />

                        <button
                          type="button"
                          className="eye-btn"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <CIcon icon={cilLowVision} />
                        </button>
                      </div>

                      {errors.password && (
                        <small className="error-text">{errors.password.message}</small>
                      )}
                    </div>

                    {/* Options */}

                    <div className="login-options">
                      <label className="remember">
                        <input type="checkbox" />

                        <span>Remember Me</span>
                      </label>

                      <button type="button" className="forgot-btn">
                        Forgot Password?
                      </button>
                    </div>

                    {/* Login */}

                    <CButton type="submit" className="login-btn" disabled={loading}>
                      {loading ? (
                        <>
                          <CSpinner size="sm" className="me-2" />
                          Signing In...
                        </>
                      ) : (
                        <>Sign In</>
                      )}
                    </CButton>

                    {/* Divider */}

                    <div className="divider">
                      <span>Secure Access</span>
                    </div>

                    {/* Security */}

                    <div className="security-box">
                      <div className="security-item">
                        <CIcon icon={cilShieldAlt} />

                        <span>JWT Authentication</span>
                      </div>

                      <div className="security-item">🔒 SSL Protected</div>

                      <div className="security-item">🛡 Role Based Access</div>
                    </div>
                  </CForm>
                </CCardBody>
              </CCard>
            </div>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
