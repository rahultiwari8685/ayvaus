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
  CFormSelect,
  CRow,
  CCol,
  CSpinner,
  CPagination,
  CPaginationItem,
  COffcanvas,
  COffcanvasHeader,
  COffcanvasBody,
  CBadge,
} from '@coreui/react'

import secureLocalStorage from 'react-secure-storage'
import setting from '../../../setting.json'

const RedeemRequest = () => {
  const [redeemList, setRedeemList] = useState([])
  const [loading, setLoading] = useState(false)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const [visible, setVisible] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)

  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 10

  const token = JSON.parse(secureLocalStorage.getItem('logininfo'))?.token || ''

  const getRedeemRequests = async () => {
    setLoading(true)

    try {
      const response = await fetch(setting.api + '/api/redeem/history', {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })

      const result = await response.json()

      if (result.status) {
        setRedeemList(result.data)
      } else {
        setRedeemList([])
      }
    } catch (err) {
      console.log(err)
    }

    setLoading(false)
  }

  useEffect(() => {
    getRedeemRequests()
  }, [])

  const approveRequest = async (id) => {
    if (!window.confirm('Approve this request?')) return

    try {
      const response = await fetch(setting.api + '/api/redeem/admin/approve/' + id, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })

      const result = await response.json()

      alert(result.message)

      getRedeemRequests()
    } catch (err) {
      console.log(err)
    }
  }

  const rejectRequest = async (id) => {
    if (!window.confirm('Reject this request?')) return

    try {
      const response = await fetch(setting.api + '/api/redeem/admin/reject/' + id, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })

      const result = await response.json()

      alert(result.message)

      getRedeemRequests()
    } catch (err) {
      console.log(err)
    }
  }

  const filteredData = redeemList.filter((item) => {
    const matchesSearch =
      item.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.upiId?.toLowerCase().includes(search.toLowerCase())

    const matchesStatus = statusFilter === '' ? true : item.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  const paginatedItems = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  return (
    <div>
      <CCard className="shadow border-0 rounded-4">
        <CCardHeader className="bg-dark text-white">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Redeem Requests</h5>

            <CBadge color="warning" shape="rounded-pill">
              Total : {filteredData.length}
            </CBadge>
          </div>
        </CCardHeader>

        <CCardBody>
          {/* Search & Filter */}

          <CRow className="mb-3">
            <CCol md={6}>
              <CFormInput
                placeholder="Search by Name / UPI"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setCurrentPage(1)
                }}
              />
            </CCol>

            <CCol md={3}>
              <CFormSelect
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  setCurrentPage(1)
                }}
              >
                <option value="">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </CFormSelect>
            </CCol>
          </CRow>

          {loading ? (
            <div className="text-center py-5">
              <CSpinner color="primary" />
            </div>
          ) : (
            <>
              <CTable striped hover bordered responsive>
                <CTableHead color="dark">
                  <CTableRow>
                    <CTableHeaderCell>#</CTableHeaderCell>
                    <CTableHeaderCell>User</CTableHeaderCell>
                    <CTableHeaderCell>UPI ID</CTableHeaderCell>
                    <CTableHeaderCell>Coins</CTableHeaderCell>
                    <CTableHeaderCell>Amount</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Date</CTableHeaderCell>
                    <CTableHeaderCell>Action</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  {paginatedItems.length > 0 ? (
                    paginatedItems.map((item, index) => (
                      <CTableRow key={item._id}>
                        <CTableDataCell>
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </CTableDataCell>

                        <CTableDataCell>
                          <div className="fw-bold">{item.user?.name}</div>

                          <small className="text-muted">{item.user?.email}</small>
                        </CTableDataCell>

                        <CTableDataCell>{item.upiId}</CTableDataCell>

                        <CTableDataCell>{item.coins}</CTableDataCell>

                        <CTableDataCell>₹ {item.amount}</CTableDataCell>

                        <CTableDataCell>
                          {item.status === 'Pending' && <CBadge color="warning">Pending</CBadge>}

                          {item.status === 'Approved' && <CBadge color="success">Approved</CBadge>}

                          {item.status === 'Rejected' && <CBadge color="danger">Rejected</CBadge>}
                        </CTableDataCell>

                        <CTableDataCell>
                          {new Date(item.createdAt).toLocaleDateString()}
                        </CTableDataCell>

                        <CTableDataCell>
                          <CButton
                            color="info"
                            size="sm"
                            className="me-2"
                            onClick={() => {
                              setSelectedRequest(item)
                              setVisible(true)
                            }}
                          >
                            View
                          </CButton>

                          {item.status === 'Pending' && (
                            <>
                              <CButton
                                color="success"
                                size="sm"
                                className="me-2"
                                onClick={() => approveRequest(item._id)}
                              >
                                Approve
                              </CButton>

                              <CButton
                                color="danger"
                                size="sm"
                                onClick={() => rejectRequest(item._id)}
                              >
                                Reject
                              </CButton>
                            </>
                          )}
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan={8} className="text-center py-4">
                        No Redeem Requests Found
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>

              {/* Pagination */}

              <div className="d-flex justify-content-end mt-3">
                <CPagination>
                  {[...Array(totalPages)].map((_, index) => (
                    <CPaginationItem
                      key={index}
                      active={currentPage === index + 1}
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </CPaginationItem>
                  ))}
                </CPagination>
              </div>
            </>
          )}
        </CCardBody>
      </CCard>

      {/* View Details */}

      <COffcanvas placement="end" visible={visible} onHide={() => setVisible(false)}>
        <COffcanvasHeader closeButton>Redeem Details</COffcanvasHeader>

        <COffcanvasBody>
          {selectedRequest && (
            <>
              <p>
                <strong>Name :</strong> {selectedRequest.user?.name}
              </p>

              <p>
                <strong>Email :</strong> {selectedRequest.user?.email}
              </p>

              <p>
                <strong>Phone :</strong> {selectedRequest.user?.phone}
              </p>

              <p>
                <strong>UPI ID :</strong> {selectedRequest.upiId}
              </p>

              <p>
                <strong>Coins :</strong> {selectedRequest.coins}
              </p>

              <p>
                <strong>Amount :</strong>₹ {selectedRequest.amount}
              </p>

              <p>
                <strong>Status :</strong> {selectedRequest.status}
              </p>

              <p>
                <strong>Date :</strong> {new Date(selectedRequest.createdAt).toLocaleString()}
              </p>
            </>
          )}
        </COffcanvasBody>
      </COffcanvas>
    </div>
  )
}

export default RedeemRequest
