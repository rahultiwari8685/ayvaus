import React, { useEffect, useState } from "react";
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
  CBadge,
  CPagination,
  CPaginationItem,
  COffcanvas,
  COffcanvasHeader,
  COffcanvasBody,
  CImage,
} from "@coreui/react";

import secureLocalStorage from "react-secure-storage";
import setting from "../../../setting.json";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);
  const [visible, setVisible] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  const token =
    JSON.parse(secureLocalStorage.getItem("logininfo"))?.token || "";

  const getUsers = async () => {
    setLoading(true);

    try {
      const response = await fetch(setting.api + "/api/users/admin/list", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      const result = await response.json();

      if (result.success) {
        setUsers(result.data);
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.log(err);
      setUsers([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    getUsers();
  }, []);

  const blockUser = async (id) => {
    if (!window.confirm("Block this user?")) return;

    try {
      const response = await fetch(
        setting.api + "/api/users/admin/block/" + id,
        {
          method: "PUT",
          headers: {
            Authorization: "Bearer " + token,
          },
        },
      );

      const result = await response.json();

      alert(result.message);

      getUsers();
    } catch (err) {
      console.log(err);
    }
  };

  const unblockUser = async (id) => {
    if (!window.confirm("Unblock this user?")) return;

    try {
      const response = await fetch(
        setting.api + "/api/users/admin/unblock/" + id,
        {
          method: "PUT",
          headers: {
            Authorization: "Bearer " + token,
          },
        },
      );

      const result = await response.json();

      alert(result.message);

      getUsers();
    } catch (err) {
      console.log(err);
    }
  };

  const filteredUsers = users.filter((item) => {
    const keyword = search.toLowerCase();

    const matchesSearch =
      item.name?.toLowerCase().includes(keyword) ||
      item.email?.toLowerCase().includes(keyword) ||
      item.phone?.toLowerCase().includes(keyword);

    const matchesStatus =
      statusFilter === ""
        ? true
        : statusFilter === "active"
          ? !item.isBlocked
          : item.isBlocked;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0">Registered Users</h4>

            <CBadge color="primary">
              Total Users : {filteredUsers.length}
            </CBadge>
          </div>
        </CCardHeader>

        <CCardBody>
          <CRow className="mb-3">
            <CCol md={6}>
              <CFormInput
                placeholder="Search by Name, Email, Phone..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </CCol>

            <CCol md={3}>
              <CFormSelect
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">All Users</option>
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
              </CFormSelect>
            </CCol>

            <CCol md={3}>
              <CButton color="primary" onClick={getUsers}>
                Refresh
              </CButton>
            </CCol>
          </CRow>

          {loading ? (
            <div className="text-center py-5">
              <CSpinner />
            </div>
          ) : (
            <CTable hover responsive bordered striped>
              <CTableHead color="dark">
                <CTableRow>
                  <CTableHeaderCell>#</CTableHeaderCell>

                  <CTableHeaderCell>Profile</CTableHeaderCell>

                  <CTableHeaderCell>Name</CTableHeaderCell>

                  <CTableHeaderCell>Email</CTableHeaderCell>

                  <CTableHeaderCell>Phone</CTableHeaderCell>

                  <CTableHeaderCell>Gender</CTableHeaderCell>

                  <CTableHeaderCell>Coins</CTableHeaderCell>

                  <CTableHeaderCell>XP</CTableHeaderCell>

                  <CTableHeaderCell>Level</CTableHeaderCell>

                  <CTableHeaderCell>Status</CTableHeaderCell>

                  <CTableHeaderCell>Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>

              <CTableBody>
                {currentUsers.length > 0 ? (
                  currentUsers.map((user, index) => (
                    <CTableRow key={user._id}>
                      <CTableDataCell>
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </CTableDataCell>

                      <CTableDataCell>
                        <CImage
                          rounded
                          width={45}
                          height={45}
                          src={
                            user.profileImage
                              ? user.profileImage
                              : "https://ui-avatars.com/api/?name=" +
                                encodeURIComponent(user.name)
                          }
                        />
                      </CTableDataCell>

                      <CTableDataCell>
                        <strong>{user.name}</strong>
                      </CTableDataCell>

                      <CTableDataCell>{user.email}</CTableDataCell>

                      <CTableDataCell>{user.phone || "-"}</CTableDataCell>

                      <CTableDataCell>{user.gender}</CTableDataCell>

                      <CTableDataCell>
                        <CBadge color="warning">{user.coins || 0}</CBadge>
                      </CTableDataCell>

                      <CTableDataCell>
                        <CBadge color="info">{user.xp || 0}</CBadge>
                      </CTableDataCell>

                      <CTableDataCell>
                        <CBadge color="success">{user.level || 1}</CBadge>
                      </CTableDataCell>

                      <CTableDataCell>
                        {user.isBlocked ? (
                          <CBadge color="danger">Blocked</CBadge>
                        ) : (
                          <CBadge color="success">Active</CBadge>
                        )}
                      </CTableDataCell>

                      <CTableDataCell>
                        <CButton
                          color="info"
                          size="sm"
                          className="me-2"
                          onClick={() => {
                            setSelectedUser(user);
                            setVisible(true);
                          }}
                        >
                          View
                        </CButton>

                        {user.isBlocked ? (
                          <CButton
                            color="success"
                            size="sm"
                            onClick={() => unblockUser(user._id)}
                          >
                            Unblock
                          </CButton>
                        ) : (
                          <CButton
                            color="danger"
                            size="sm"
                            onClick={() => blockUser(user._id)}
                          >
                            Block
                          </CButton>
                        )}
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan={11} className="text-center py-4">
                      No Users Found
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          )}

          {!loading && totalPages > 1 && (
            <div className="d-flex justify-content-end mt-3">
              <CPagination>
                {Array.from({ length: totalPages }, (_, index) => (
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
          )}
        </CCardBody>
      </CCard>

      {/* User Details Offcanvas */}

      <COffcanvas
        placement="end"
        visible={visible}
        onHide={() => setVisible(false)}
      >
        <COffcanvasHeader closeButton>
          <h5>User Details</h5>
        </COffcanvasHeader>

        <COffcanvasBody>
          {selectedUser && (
            <>
              <div className="text-center mb-4">
                <CImage
                  roundedCircle
                  width={100}
                  height={100}
                  src={
                    selectedUser.profileImage
                      ? selectedUser.profileImage
                      : "https://ui-avatars.com/api/?name=" +
                        encodeURIComponent(selectedUser.name)
                  }
                />

                <h5 className="mt-3">{selectedUser.name}</h5>

                <CBadge color={selectedUser.isBlocked ? "danger" : "success"}>
                  {selectedUser.isBlocked ? "Blocked" : "Active"}
                </CBadge>
              </div>

              <hr />

              <table className="table table-bordered">
                <tbody>
                  <tr>
                    <th>Name</th>
                    <td>{selectedUser.name}</td>
                  </tr>

                  <tr>
                    <th>Email</th>
                    <td>{selectedUser.email}</td>
                  </tr>

                  <tr>
                    <th>Phone</th>
                    <td>{selectedUser.phone || "-"}</td>
                  </tr>

                  <tr>
                    <th>Gender</th>
                    <td>{selectedUser.gender || "-"}</td>
                  </tr>

                  <tr>
                    <th>Age</th>
                    <td>{selectedUser.age || "-"}</td>
                  </tr>

                  <tr>
                    <th>Coins</th>
                    <td>{selectedUser.coins || 0}</td>
                  </tr>

                  <tr>
                    <th>XP</th>
                    <td>{selectedUser.xp || 0}</td>
                  </tr>

                  <tr>
                    <th>Level</th>
                    <td>{selectedUser.level || 1}</td>
                  </tr>

                  <tr>
                    <th>Fragments</th>
                    <td>{selectedUser.fragments || 0}</td>
                  </tr>

                  <tr>
                    <th>Referral Code</th>
                    <td>{selectedUser.referralCode || "-"}</td>
                  </tr>

                  <tr>
                    <th>Total Referrals</th>
                    <td>{selectedUser.totalReferrals || 0}</td>
                  </tr>

                  <tr>
                    <th>Bio</th>
                    <td>{selectedUser.bio || "-"}</td>
                  </tr>

                  <tr>
                    <th>Intent</th>
                    <td>{selectedUser.intent || "-"}</td>
                  </tr>

                  <tr>
                    <th>Looking For</th>
                    <td>{selectedUser.looking_for || "-"}</td>
                  </tr>

                  <tr>
                    <th>Serious Profile</th>
                    <td>{selectedUser.is_serious_profile ? "Yes" : "No"}</td>
                  </tr>

                  <tr>
                    <th>Joined On</th>
                    <td>
                      {selectedUser.createdAt
                        ? new Date(selectedUser.createdAt).toLocaleString()
                        : "-"}
                    </td>
                  </tr>

                  <tr>
                    <th>Last Updated</th>
                    <td>
                      {selectedUser.updatedAt
                        ? new Date(selectedUser.updatedAt).toLocaleString()
                        : "-"}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="d-grid gap-2 mt-3">
                {selectedUser.isBlocked ? (
                  <CButton
                    color="success"
                    onClick={() => {
                      unblockUser(selectedUser._id);
                      setVisible(false);
                    }}
                  >
                    Unblock User
                  </CButton>
                ) : (
                  <CButton
                    color="danger"
                    onClick={() => {
                      blockUser(selectedUser._id);
                      setVisible(false);
                    }}
                  >
                    Block User
                  </CButton>
                )}

                <CButton
                  color="secondary"
                  variant="outline"
                  onClick={() => setVisible(false)}
                >
                  Close
                </CButton>
              </div>
            </>
          )}
        </COffcanvasBody>
      </COffcanvas>
    </>
  );
};

export default Users;
