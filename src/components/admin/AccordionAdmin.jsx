import React, { useState, useEffect } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Dropdown from 'react-bootstrap/Dropdown';
import Alert from 'react-bootstrap/Alert';
import Footer from '../common/FooterC';
import axios from 'axios';

const AccordionAdmin = () => {
  const [complaintList, setComplaintList] = useState([]);
  const [agentList, setAgentList] = useState([]);
  const [districtFilter, setDistrictFilter] = useState('');
  const [districts, setDistricts] = useState([]); // Unique districts for filter

  useEffect(() => {
    const getComplaints = async () => {
      try {
        const response = await axios.get('http://localhost:8000/status');
        const complaints = response.data;
        setComplaintList(complaints);

        // Extract unique districts
        const uniqueDistricts = [...new Set(complaints.map(c => c.district))];
        setDistricts(uniqueDistricts);
      } catch (error) {
        console.log(error);
      }
    };
    getComplaints();

    const getAgentsRecords = async () => {
      try {
        const response = await axios.get('http://localhost:8000/AgentUsers');
        const agents = response.data;
        setAgentList(agents);
      } catch (error) {
        console.log(error);
      }
    };
    getAgentsRecords();

  }, []);

  const handleSelection = async (agentId, complaintId, status, agentName) => {
    try {
      await axios.get(`http://localhost:8000/AgentUsers/${agentId}`);
      const assignedComplaint = { agentId, complaintId, status, agentName };
      await axios.post('http://localhost:8000/assignedComplaints', assignedComplaint);

      const updatedComplaintList = complaintList.filter((complaint) => complaint._id !== complaintId);
      setComplaintList(updatedComplaintList);
      alert(`Complaint assigned to Agent ${agentName}`);
    } catch (error) {
      console.log(error);
    }
  };

  // Filter complaints by selected district
  const filteredComplaints = districtFilter 
    ? complaintList.filter(c => c.district === districtFilter) 
    : complaintList;

  return (
    <div>
      {/* District Filter */}
      <div style={{ margin: '20px' }}>
        <label htmlFor="districtFilter"><b>Filter by District:</b> </label>
        <select 
          id="districtFilter"
          value={districtFilter} 
          onChange={(e) => setDistrictFilter(e.target.value)}
        >
          <option value="">All Districts</option>
          {districts.map((district, index) => (
            <option key={index} value={district}>{district}</option>
          ))}
        </select>
      </div>

      <Accordion className='accordian' alwaysOpen>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Users Complaints</Accordion.Header>
          <Accordion.Body style={{background:'aliceblue'}}>
            <div style={{ display: "flex", flexWrap: "wrap", margin: "20px" }}>
              {filteredComplaints.length > 0 ? (
                filteredComplaints.map((complaint, index) => (
                  <Card key={index} style={{ width: '15rem', margin: '0 10px 15px 0' }}>
                    <Card.Body style={{textAlign:'center'}}>
                      <Card.Title>Name: {complaint.name}</Card.Title>
                      <div style={{fontSize:'14px', marginTop: '20px'}}>
                        <Card.Text>Address: {complaint.address}</Card.Text>
                        <Card.Text>City: {complaint.city}</Card.Text>
                        <Card.Text>State: {complaint.state}</Card.Text>
                        <Card.Text>District: {complaint.district}</Card.Text>
                        <Card.Text>Pincode: {complaint.pincode}</Card.Text>
                        <Card.Text>Comment: {complaint.comment}</Card.Text>
                        <Card.Text>Status: {complaint.status}</Card.Text>
                      </div>
                      {(complaint.status !== "completed") && (
                        <Dropdown className='mt-2'>
                          <Dropdown.Toggle variant="warning" id="dropdown-basic">Assign</Dropdown.Toggle>
                          <Dropdown.Menu>
                            {agentList.map((agent, idx) => (
                              <Dropdown.Item 
                                key={idx} 
                                onClick={() => handleSelection(agent._id, complaint._id, complaint.status, agent.name)}
                              >
                                {agent.name}
                              </Dropdown.Item>
                            ))}
                          </Dropdown.Menu>
                        </Dropdown>
                      )}
                    </Card.Body>
                  </Card>
                ))
              ) : (
                <Alert variant="info">
                  <Alert.Heading>No complaints to show</Alert.Heading>
                </Alert>
              )}
            </div>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1">
          <Accordion.Header>Agents</Accordion.Header>
          <Accordion.Body style={{background:'aliceblue'}}>
            <div style={{ display: "flex", flexWrap: "wrap", margin: "20px" }}>
              {agentList.length > 0 ? (
                agentList.map((agent, index) => (
                  <Card key={index} style={{ width: '22rem', margin: '0 10px 15px 0' }}>
                    <Card.Body>
                      <Card.Title>Name: {agent.name}</Card.Title>
                      <Card.Text>Email: {agent.email}</Card.Text>
                    </Card.Body>
                  </Card>
                ))
              ) : (
                <Alert variant="info">
                  <Alert.Heading>No Agents to show</Alert.Heading>
                </Alert>
              )}
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <Footer/>
    </div>
  )
}

export default AccordionAdmin;