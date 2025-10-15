import React, { useEffect, useState } from "react";
import { Container, Table, Button, Form, Collapse, Alert } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { confirmAlert } from "react-confirm-alert";
import axios from "axios";
import Footer from "../common/FooterC";

const UserInfo = () => {
  const [ordinaryList, setOrdinaryList] = useState([]);
  const [toggle, setToggle] = useState({});
  const [updateUser, setUpdateUser] = useState({});
  const [district, setDistrict] = useState("");

  const handleChange = (userId, e) => {
    setUpdateUser((prev) => ({
      ...prev,
      [userId]: { ...prev[userId], [e.target.name]: e.target.value },
    }));
  };

  const handleSubmit = async (userId) => {
    try {
      const data = updateUser[userId] || {};
      if (!data.name && !data.email && !data.phone) {
        toast.error("At least one field must be filled!");
        return;
      }
      await axios.put(`http://localhost:8000/user/${userId}`, data);
      toast.success("User updated successfully");
      fetchUsersByDistrict(district);
      setToggle((prev) => ({ ...prev, [userId]: false }));
    } catch (err) {
      console.error(err);
      toast.error("Failed to update user");
    }
  };

  const fetchUsersByDistrict = async (dist) => {
    if (!dist) return setOrdinaryList([]);
    try {
      const response = await axios.get(`http://localhost:8000/OrdinaryUsers/${dist}`);
      setOrdinaryList(response.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch users");
    }
  };

  const deleteUser = (userId) => {
    confirmAlert({
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this user?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              await axios.delete(`http://localhost:8000/OrdinaryUsers/${userId}`);
              setOrdinaryList((prev) => prev.filter((u) => u._id !== userId));
              toast.success("User deleted successfully");
            } catch (err) {
              console.error(err);
              toast.error("Failed to delete user");
            }
          },
        },
        { label: "No", onClick: () => {} },
      ],
    });
  };

  const handleToggle = (userId) => {
    setToggle((prev) => ({ ...prev, [userId]: !prev[userId] }));
  };

  return (
    <>
      <Container className="mt-4">
        <Form.Select
          value={district}
          onChange={(e) => {
            setDistrict(e.target.value);
            fetchUsersByDistrict(e.target.value);
          }}
        >
          <option value="">Select District</option>
          <option value="Chennai">Chennai</option>
          <option value="Coimbatore">Coimbatore</option>
          <option value="Madurai">Madurai</option>
          <option value="Tiruchirappalli">Tiruchirappalli</option>
          <option value="Salem">Salem</option>
          <option value="Erode">Erode</option>
          <option value="Thanjavur">Thanjavur</option>
          <option value="Dindigul">Dindigul</option>
          <option value="Tirunelveli">Tirunelveli</option>
        </Form.Select>

        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {ordinaryList.length > 0 ? (
              ordinaryList.map((user) => {
                const open = toggle[user._id] || false;
                const userData = updateUser[user._id] || {};
                return (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>
                      <Button
                        onClick={() => handleToggle(user._id)}
                        className="mx-2"
                        variant="outline-warning"
                      >
                        Update
                      </Button>
                      <Collapse in={open}>
                        <Form
                          className="p-3"
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit(user._id);
                          }}
                        >
                          <Form.Group className="mb-2">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                              type="text"
                              name="name"
                              value={userData.name || ""}
                              onChange={(e) => handleChange(user._id, e)}
                              placeholder="Enter name"
                            />
                          </Form.Group>
                          <Form.Group className="mb-2">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                              type="email"
                              name="email"
                              value={userData.email || ""}
                              onChange={(e) => handleChange(user._id, e)}
                              placeholder="Enter email"
                            />
                          </Form.Group>
                          <Form.Group className="mb-2">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control
                              type="text"
                              name="phone"
                              value={userData.phone || ""}
                              onChange={(e) => handleChange(user._id, e)}
                              placeholder="Enter phone"
                            />
                          </Form.Group>
                          <Button type="submit" variant="outline-success" size="sm">
                            Submit
                          </Button>
                        </Form>
                      </Collapse>
                      <Button
                        onClick={() => deleteUser(user._id)}
                        className="mx-2"
                        variant="outline-danger"
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4">
                  <Alert variant="info" className="text-center">
                    No Users to show
                  </Alert>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Container>
      <Footer />
    </>
  );
};

export default UserInfo;
