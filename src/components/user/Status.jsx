import axios from "axios";
import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";
import { Button } from "react-bootstrap";
import ChatWindow from "../common/ChatWindow";
import Collapse from "react-bootstrap/Collapse";

const Status = () => {
  const [toggle, setToggle] = useState({});
  const [statusComplaints, setStatusComplaints] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const { _id } = user;
    axios
      .get(`http://localhost:8000/status/${_id}`)
      .then((res) => {
        setStatusComplaints(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleToggle = (complaintId) => {
    setToggle((prevState) => ({
      ...prevState,
      [complaintId]: !prevState[complaintId],
    }));
  };

  // 🧾 Download complaint report
  const handleDownloadReport = async (complaintId) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/download-report/${complaintId}`,
        { responseType: "blob" } // Important for file download
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Complaint_Report_${complaintId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download report. Please try again.");
    }
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", margin: "20px" }}>
      {statusComplaints.length > 0 ? (
        statusComplaints.map((complaint, index) => {
          const open = toggle[complaint._id] || false;
          return (
            <Card
              key={index}
              style={{ width: "19rem", margin: "0 15px 15px 0", padding: "10px" }}
            >
              <Card.Body>
                <Card.Title>Name: {complaint.name}</Card.Title>
                <Card.Text>Address: {complaint.address}</Card.Text>
                <Card.Text>City: {complaint.city}</Card.Text>
                <Card.Text>District: {complaint.district}</Card.Text>
                <Card.Text>State: {complaint.state}</Card.Text>
                <Card.Text>Pincode: {complaint.pincode}</Card.Text>
                <Card.Text>Comment: {complaint.comment}</Card.Text>
                <Card.Text>Status: {complaint.status}</Card.Text>

                {complaint.file && (
                  <Card.Text>
                    <a
                      href={`http://localhost:8000/uploads/${complaint.file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Attachment
                    </a>
                  </Card.Text>
                )}

                <div className="d-flex justify-content-between">
                  <Button
                    variant="success"
                    onClick={() => handleDownloadReport(complaint._id)}
                  >
                    Download Report
                  </Button>

                  <Button
                    variant="primary"
                    onClick={() => handleToggle(complaint._id)}
                    aria-controls={`collapse-${complaint._id}`}
                    aria-expanded={open}
                  >
                    Message
                  </Button>
                </div>

                <div style={{ minHeight: "100%" }}>
                  <Collapse in={open} dimension="width">
                    <div id={`collapse-${complaint._id}`}>
                      <Card body style={{ width: "260px", marginTop: "12px" }}>
                        <ChatWindow
                          key={complaint._id}
                          complaintId={complaint._id}
                          name={complaint.name}
                        />
                      </Card>
                    </div>
                  </Collapse>
                </div>
              </Card.Body>
            </Card>
          );
        })
      ) : (
        <Alert variant="info">
          <Alert.Heading>No complaints to show</Alert.Heading>
        </Alert>
      )}
    </div>
  );
};

export default Status;
