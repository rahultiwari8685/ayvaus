import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CTable,
  CTableBody,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CFormInput,
  CSpinner,
  CBadge,
  COffcanvas,
  COffcanvasHeader,
  COffcanvasBody,
  CNav,
  CNavItem,
  CNavLink,
  CRow,
  CCol,
} from '@coreui/react'

import secureLocalStorage from 'react-secure-storage'
import setting from '../../../setting.json'

const CorporateVerification = () => {
  const [activeTab, setActiveTab] = useState('employees')

  const [employeeList, setEmployeeList] = useState([])
  const [companyList, setCompanyList] = useState([])

  const [loading, setLoading] = useState(false)

  const [search, setSearch] = useState('')

  const [visible, setVisible] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [selectedType, setSelectedType] = useState('')

  const token = JSON.parse(secureLocalStorage.getItem('logininfo'))?.token || ''

  const getPendingEmployees = async () => {
    try {
      const response = await fetch(setting.api + '/api/corporate/admin/employees/pending', {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })

      const result = await response.json()

      if (result.success) {
        setEmployeeList(result.employees || [])
      } else {
        setEmployeeList([])
      }
    } catch (err) {
      console.log('Employee verification error:', err)
      setEmployeeList([])
    }
  }

  const getPendingCompanies = async () => {
    try {
      const response = await fetch(setting.api + '/api/corporate/admin/companies/pending', {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })

      const result = await response.json()

      if (result.success) {
        setCompanyList(result.companies || [])
      } else {
        setCompanyList([])
      }
    } catch (err) {
      console.log('Company verification error:', err)
      setCompanyList([])
    }
  }

  const getVerificationData = async () => {
    setLoading(true)

    try {
      await Promise.all([getPendingEmployees(), getPendingCompanies()])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getVerificationData()
  }, [])

  const verifyEmployee = async (id) => {
    if (!window.confirm('Are you sure you want to verify this employee?')) {
      return
    }

    try {
      const response = await fetch(
        setting.api + '/api/corporate/admin/employees/' + id + '/verify',
        {
          method: 'PUT',
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )

      const result = await response.json()

      alert(result.message)

      if (response.ok) {
        getVerificationData()
      }
    } catch (err) {
      console.log(err)
      alert('Something went wrong')
    }
  }

  const verifyCompany = async (id) => {
    if (!window.confirm('Are you sure you want to verify this company?')) {
      return
    }

    try {
      const response = await fetch(
        setting.api + '/api/corporate/admin/companies/' + id + '/verify',
        {
          method: 'PUT',
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )

      const result = await response.json()

      alert(result.message)

      if (response.ok) {
        getVerificationData()
      }
    } catch (err) {
      console.log(err)
      alert('Something went wrong')
    }
  }

  const rejectEmployee = async (id) => {
    const note = window.prompt('Enter rejection reason')

    if (note === null) return

    try {
      const response = await fetch(
        setting.api + '/api/corporate/admin/employees/' + id + '/reject',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
          body: JSON.stringify({
            note,
          }),
        },
      )

      const result = await response.json()

      alert(result.message)

      if (response.ok) {
        getVerificationData()
      }
    } catch (err) {
      console.log(err)
      alert('Something went wrong')
    }
  }

  const rejectCompany = async (id) => {
    const note = window.prompt('Enter rejection reason')

    if (note === null) return

    try {
      const response = await fetch(
        setting.api + '/api/corporate/admin/companies/' + id + '/reject',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
          body: JSON.stringify({
            note,
          }),
        },
      )

      const result = await response.json()

      alert(result.message)

      if (response.ok) {
        getVerificationData()
      }
    } catch (err) {
      console.log(err)
      alert('Something went wrong')
    }
  }

  const filteredEmployees = employeeList.filter((item) => {
    const value = search.toLowerCase()

    return (
      item.name?.toLowerCase().includes(value) ||
      item.email?.toLowerCase().includes(value) ||
      item.currentJobTitle?.toLowerCase().includes(value)
    )
  })

  const filteredCompanies = companyList.filter((item) => {
    const value = search.toLowerCase()

    return (
      item.companyName?.toLowerCase().includes(value) ||
      item.officialEmail?.toLowerCase().includes(value) ||
      item.industry?.toLowerCase().includes(value)
    )
  })

  const openDetails = (item, type) => {
    setSelectedItem(item)
    setSelectedType(type)
    setVisible(true)
  }

  return (
    <div>
      {/* =========================
          HEADER
      ========================= */}

      <CCard className="shadow border-0 rounded-4">
        <CCardHeader className="bg-dark text-white">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-1">Corporate Verification</h5>

              <small className="text-white-50">
                Review employee and company verification requests
              </small>
            </div>

            <CBadge color="warning" shape="rounded-pill">
              Pending: {employeeList.length + companyList.length}
            </CBadge>
          </div>
        </CCardHeader>

        <CCardBody>
          {/* SEARCH */}

          <CRow className="mb-3">
            <CCol md={6}>
              <CFormInput
                placeholder={
                  activeTab === 'employees'
                    ? 'Search employee by name, email or job title'
                    : 'Search company by name, email or industry'
                }
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </CCol>

            <CCol md={6} className="text-md-end mt-3 mt-md-0">
              <CButton color="secondary" variant="outline" onClick={getVerificationData}>
                Refresh
              </CButton>
            </CCol>
          </CRow>

          {/* TABS */}

          <CNav variant="tabs" className="mb-3">
            <CNavItem>
              <CNavLink
                active={activeTab === 'employees'}
                onClick={() => {
                  setActiveTab('employees')
                  setSearch('')
                }}
                style={{
                  cursor: 'pointer',
                }}
              >
                Employees{' '}
                <CBadge color="warning" className="ms-2">
                  {employeeList.length}
                </CBadge>
              </CNavLink>
            </CNavItem>

            <CNavItem>
              <CNavLink
                active={activeTab === 'companies'}
                onClick={() => {
                  setActiveTab('companies')
                  setSearch('')
                }}
                style={{
                  cursor: 'pointer',
                }}
              >
                Companies{' '}
                <CBadge color="warning" className="ms-2">
                  {companyList.length}
                </CBadge>
              </CNavLink>
            </CNavItem>
          </CNav>

          {/* =========================
              LOADING
          ========================= */}

          {loading ? (
            <div className="text-center py-5">
              <CSpinner color="primary" />

              <div className="mt-2 text-muted">Loading verification requests...</div>
            </div>
          ) : (
            <>
              {/* =========================
                  EMPLOYEES
              ========================= */}

              {activeTab === 'employees' && (
                <CTable striped hover bordered responsive>
                  <CTableHead color="dark">
                    <CTableRow>
                      <CTableHeaderCell>#</CTableHeaderCell>

                      <CTableHeaderCell>Employee</CTableHeaderCell>

                      <CTableHeaderCell>Job Title</CTableHeaderCell>

                      <CTableHeaderCell>Experience</CTableHeaderCell>

                      <CTableHeaderCell>Location</CTableHeaderCell>

                      <CTableHeaderCell>Status</CTableHeaderCell>

                      <CTableHeaderCell>Submitted</CTableHeaderCell>

                      <CTableHeaderCell>Action</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>

                  <CTableBody>
                    {filteredEmployees.length > 0 ? (
                      filteredEmployees.map((item, index) => (
                        <CTableRow key={item._id}>
                          <CTableDataCell>{index + 1}</CTableDataCell>

                          <CTableDataCell>
                            <div className="fw-bold">{item.name || '—'}</div>

                            <small className="text-muted">{item.email || '—'}</small>
                          </CTableDataCell>

                          <CTableDataCell>{item.currentJobTitle || '—'}</CTableDataCell>

                          <CTableDataCell>
                            {item.experienceYears ?? '—'}{' '}
                            {item.experienceYears !== undefined && 'years'}
                          </CTableDataCell>

                          <CTableDataCell>
                            {item.location?.city || '—'}
                            {item.location?.state && `, ${item.location.state}`}
                          </CTableDataCell>

                          <CTableDataCell>
                            <CBadge color="warning">Under Review</CBadge>
                          </CTableDataCell>

                          <CTableDataCell>
                            {formatDate(item.verificationSubmittedAt)}
                          </CTableDataCell>

                          <CTableDataCell>
                            <CButton
                              color="info"
                              size="sm"
                              className="me-2"
                              onClick={() => openDetails(item, 'employee')}
                            >
                              View
                            </CButton>

                            <CButton
                              color="success"
                              size="sm"
                              className="me-2"
                              onClick={() => verifyEmployee(item._id)}
                            >
                              Verify
                            </CButton>

                            <CButton
                              color="danger"
                              size="sm"
                              onClick={() => rejectEmployee(item._id)}
                            >
                              Reject
                            </CButton>
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    ) : (
                      <CTableRow>
                        <CTableDataCell colSpan={8} className="text-center py-4">
                          No Pending Employee Verifications
                        </CTableDataCell>
                      </CTableRow>
                    )}
                  </CTableBody>
                </CTable>
              )}

              {/* =========================
                  COMPANIES
              ========================= */}

              {activeTab === 'companies' && (
                <CTable striped hover bordered responsive>
                  <CTableHead color="dark">
                    <CTableRow>
                      <CTableHeaderCell>#</CTableHeaderCell>

                      <CTableHeaderCell>Company</CTableHeaderCell>

                      <CTableHeaderCell>Industry</CTableHeaderCell>

                      <CTableHeaderCell>Size</CTableHeaderCell>

                      <CTableHeaderCell>Registration</CTableHeaderCell>

                      <CTableHeaderCell>Status</CTableHeaderCell>

                      <CTableHeaderCell>Submitted</CTableHeaderCell>

                      <CTableHeaderCell>Action</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>

                  <CTableBody>
                    {filteredCompanies.length > 0 ? (
                      filteredCompanies.map((item, index) => (
                        <CTableRow key={item._id}>
                          <CTableDataCell>{index + 1}</CTableDataCell>

                          <CTableDataCell>
                            <div className="fw-bold">{item.companyName || '—'}</div>

                            <small className="text-muted">{item.officialEmail || '—'}</small>
                          </CTableDataCell>

                          <CTableDataCell>{item.industry || '—'}</CTableDataCell>

                          <CTableDataCell>{item.companySize || '—'}</CTableDataCell>

                          <CTableDataCell>{item.registrationType || '—'}</CTableDataCell>

                          <CTableDataCell>
                            <CBadge color="warning">Under Review</CBadge>
                          </CTableDataCell>

                          <CTableDataCell>
                            {formatDate(item.verificationSubmittedAt)}
                          </CTableDataCell>

                          <CTableDataCell>
                            <CButton
                              color="info"
                              size="sm"
                              className="me-2"
                              onClick={() => openDetails(item, 'company')}
                            >
                              View
                            </CButton>

                            <CButton
                              color="success"
                              size="sm"
                              className="me-2"
                              onClick={() => verifyCompany(item._id)}
                            >
                              Verify
                            </CButton>

                            <CButton
                              color="danger"
                              size="sm"
                              onClick={() => rejectCompany(item._id)}
                            >
                              Reject
                            </CButton>
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    ) : (
                      <CTableRow>
                        <CTableDataCell colSpan={8} className="text-center py-4">
                          No Pending Company Verifications
                        </CTableDataCell>
                      </CTableRow>
                    )}
                  </CTableBody>
                </CTable>
              )}
            </>
          )}
        </CCardBody>
      </CCard>

      {/* =========================
          DETAILS OFFCANVAS
      ========================= */}

      <COffcanvas placement="end" visible={visible} onHide={() => setVisible(false)}>
        <COffcanvasHeader closeButton>
          {selectedType === 'employee' ? 'Employee Details' : 'Company Details'}
        </COffcanvasHeader>

        <COffcanvasBody>
          {selectedItem && (
            <>
              {selectedType === 'employee' ? (
                <EmployeeDetails employee={selectedItem} />
              ) : (
                <CompanyDetails company={selectedItem} />
              )}
            </>
          )}
        </COffcanvasBody>
      </COffcanvas>
    </div>
  )
}

// =========================
// EMPLOYEE DETAILS
// =========================

const EmployeeDetails = ({ employee }) => {
  return (
    <>
      <Detail label="Name" value={employee.name} />

      <Detail label="Email" value={employee.email} />

      <Detail label="Headline" value={employee.headline} />

      <Detail label="Current Job" value={employee.currentJobTitle} />

      <Detail
        label="Experience"
        value={employee.experienceYears ? `${employee.experienceYears} years` : '—'}
      />

      <Detail
        label="Location"
        value={[employee.location?.city, employee.location?.state, employee.location?.country]
          .filter(Boolean)
          .join(', ')}
      />

      <Detail
        label="Skills"
        value={Array.isArray(employee.skills) ? employee.skills.join(', ') : '—'}
      />

      <Detail
        label="Work Mode"
        value={Array.isArray(employee.workMode) ? employee.workMode.join(', ') : '—'}
      />

      <Detail
        label="Employment Type"
        value={Array.isArray(employee.employmentType) ? employee.employmentType.join(', ') : '—'}
      />

      <Detail
        label="Expected Salary"
        value={
          employee.expectedSalary
            ? `₹ ${employee.expectedSalary.min || 0} - ₹ ${employee.expectedSalary.max || 0}`
            : '—'
        }
      />

      <Detail
        label="Verification Documents"
        value={
          Array.isArray(employee.verificationDocuments)
            ? employee.verificationDocuments.join(', ')
            : '—'
        }
      />

      <Detail label="Submitted At" value={formatDate(employee.verificationSubmittedAt)} />
    </>
  )
}

// =========================
// COMPANY DETAILS
// =========================

const CompanyDetails = ({ company }) => {
  return (
    <>
      <Detail label="Company Name" value={company.companyName} />

      <Detail label="Official Email" value={company.officialEmail} />

      <Detail label="Phone" value={company.phone} />

      <Detail label="Website" value={company.website} />

      <Detail label="Industry" value={company.industry} />

      <Detail label="Company Size" value={company.companySize} />

      <Detail label="Description" value={company.description} />

      <Detail label="Address" value={company.address} />

      <Detail label="Registration Type" value={company.registrationType} />

      <Detail label="Registration Number" value={company.registrationNumber} />

      <Detail label="GSTIN" value={company.gstin} />

      <Detail label="CIN" value={company.cin} />

      <Detail label="Authorized Person" value={company.authorizedPerson} />

      <Detail
        label="Verification Documents"
        value={
          Array.isArray(company.verificationDocuments)
            ? company.verificationDocuments.join(', ')
            : '—'
        }
      />

      <Detail label="Submitted At" value={formatDate(company.verificationSubmittedAt)} />
    </>
  )
}

// =========================
// DETAIL
// =========================

const Detail = ({ label, value }) => {
  return (
    <div className="border-bottom py-3">
      <small className="text-muted d-block mb-1">{label}</small>

      <div className="fw-semibold">{value || '—'}</div>
    </div>
  )
}

// =========================
// DATE
// =========================

const formatDate = (date) => {
  if (!date) return '—'

  try {
    return new Date(date).toLocaleString('en-IN')
  } catch {
    return '—'
  }
}

export default CorporateVerification
