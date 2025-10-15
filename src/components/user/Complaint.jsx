import axios from 'axios';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

const Complaint = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  const statesWithDistricts = {
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem", "Tiruchirappalli","Tiruppur","Vellore","Thoothukudi","Thanjavur","Ranipet","Karur","Dindigul","Erode","Nagercoil","Cuddalore","Kanchipuram" ,"Nagapattinam","Viluppuram","Tirunelveli","Thiruvallur","Pudukkottai","Sivaganga","Ariyalur","Perambalur", "Krishnagiri","Dharmapuri","Namakkal","Tiruvannamalai"],
    "Kerala": ["Kochi", "Thiruvananthapuram", "Kozhikode", "Thrissur"],
    "Karnataka": ["Bengaluru", "Mysuru", "Mangalore", "Hubli"],
    "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur"],
    "Telangana": ["Hyderabad", "Warangal", "Karimnagar"]
  };

  const [userComplaint, setUserComplaint] = useState({
    userId: user._id,
    name: '',
    state: '',
    district: '',
    address: '',
    pincode: '',
    status: 'pending',
    comment: '',
    file: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // If state changes, reset district
    if (name === 'state') {
      setUserComplaint({ ...userComplaint, state: value, district: '' });
    } else {
      setUserComplaint({ ...userComplaint, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    setUserComplaint({ ...userComplaint, file: e.target.files[0] });
  };

  const handleClear = () => {
    setUserComplaint({
      userId: user._id,
      name: '',
      state: '',
      district: '',
      address: '',
      pincode: '',
      status: 'pending',
      comment: '',
      file: null
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const formData = new FormData();
    formData.append('name', userComplaint.name);
    formData.append('address', userComplaint.address);
    formData.append('city', userComplaint.city);
    formData.append('district', userComplaint.district); // add district
    formData.append('state', userComplaint.state);
    formData.append('pincode', userComplaint.pincode);
    formData.append('comment', userComplaint.comment);
    formData.append('status', userComplaint.status);
    if (userComplaint.file) {
      formData.append('file', userComplaint.file);
    }

    const response = await axios.post(
      `http://localhost:8000/Complaint/${userComplaint.userId}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    toast.success("Complaint submitted successfully!");
    handleClear();
  } catch (err) {
    console.error("Submit complaint error:", err);
    toast.error("Failed to submit complaint. Please try again.");
  }
};


  return (
    <div className="text-white complaint-box">
      <form onSubmit={handleSubmit} className="compliant-form row bg-dark">

        <div className="col-md-6 p-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input name="name" onChange={handleChange} value={userComplaint.name} type="text" className="form-control" required />
        </div>

        <div className="col-md-6 p-3">
          <label htmlFor="address" className="form-label">Address</label>
          <input name="address" onChange={handleChange} value={userComplaint.address} type="text" className="form-control" required />
        </div>

        <div className="col-md-6 p-3">
          <label htmlFor="state" className="form-label">State</label>
          <select name="state" onChange={handleChange} value={userComplaint.state} className="form-control" required>
            <option value="">Select State</option>
            {Object.keys(statesWithDistricts).map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>

        <div className="col-md-6 p-3">
          <label htmlFor="district" className="form-label">District</label>
          <select name="district" onChange={handleChange} value={userComplaint.district} className="form-control" required disabled={!userComplaint.state}>
            <option value="">Select District</option>
            {userComplaint.state &&
              statesWithDistricts[userComplaint.state].map((district) => (
                <option key={district} value={district}>{district}</option>
              ))
            }
          </select>
        </div>

        <div className="col-md-6 p-3">
          <label htmlFor="pincode" className="form-label">Pincode</label>
          <input name="pincode" onChange={handleChange} value={userComplaint.pincode} type="text" className="form-control" required />
        </div>

        <div className="col-md-6 p-3">
          <label htmlFor="status" className="form-label">Status</label>
          <input placeholder='pending' name="status" onChange={handleChange} value={userComplaint.status} type="text" className="form-control" required />
        </div>

        <div className="col-md-12 p-3">
          <label htmlFor="comment" className="form-label text-light">Description</label>
          <textarea name="comment" onChange={handleChange} value={userComplaint.comment} className="form-control" required></textarea>
        </div>

        <div className="col-md-12 p-3">
          <label htmlFor="file" className="form-label text-light">Attach Image/Video</label>
          <input type="file" onChange={handleFileChange} className="form-control" accept="image/*,video/*" />
        </div>

        <div className="text-center p-3 col-12">
          <button type="submit" className="mt-2 btn btn-success">Register</button>
        </div>

      </form>
    </div>
  );
};

export default Complaint;
