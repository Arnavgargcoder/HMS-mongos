import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../RecptionCSS/checkin.css'; // Using same styling

function Checkout() {
  const [customers, setCustomers] = useState([]);

  const [formData, setFormData] = useState({
    customer_id: '',
    guest_name: '',
    room_number: '',
    checkin_date: '',
    checkout_date: '',
    paid_amount: '',
    pending_amount: '',
  });

  // Format date to "YYYY-MM-DDTHH:MM" in local time
  const formatDateTimeLocal = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    const pad = (n) => String(n).padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Fetch customer IDs list
  const fetchCustomers = async () => {
    try {
      const response = await axios.get(
        'http://localhost:3001/api/identity-numbers'
      );
      setCustomers(response.data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  // Fetch full details of a selected customer
  const fetchCustomerDetails = async (identityNumber) => {
    if (!identityNumber) return;
    try {
      const response = await axios.get(
        `http://localhost:3001/api/customer-detail/${identityNumber}`
      );
      const customer = response.data;

      const priceRes = await axios.get(
        `http://localhost:3001/api/room-price/${customer.roomnumber}`
      );
      const roomPrice = priceRes.data.price || 0;

      setFormData({
        customer_id: customer.identityNumber, // use string identityNumber
        guest_name: customer.name,
        room_number: customer.roomnumber,
        checkin_date: formatDateTimeLocal(customer.checkInTime),
        checkout_date: formatDateTimeLocal(new Date()),
        paid_amount: customer.amount || 0,
        pending_amount: roomPrice - (customer.amount || 0),
      });
    } catch (error) {
      console.error('Error fetching customer details:', error);
    }
  };

  // Handle dropdown change
  const [selectedCustomerId, setSelectedCustomerId] = useState(''); // New state

  const handleCustomerChange = (e) => {
    const selectedId = e.target.value;
    console.log('Selected ID:', selectedId); // debug
    setSelectedCustomerId(selectedId); // store globally
    setFormData((prev) => ({
      ...prev,
      customer_id: selectedId,
    }));
    fetchCustomerDetails(selectedId);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const identity_key = `${selectedCustomerId}-${formData.guest_name}`;
      // console.log(identity_key, typeof identity_key);
      // console.log(selectedCustomerId, typeof selectedCustomerId);
      await axios.post('http://localhost:3001/api/checkout-customers', {
        room_number: parseInt(formData.room_number, 10),
        customer: selectedCustomerId, // use the stored variable
        identity_key,
      });

      alert('Checkout successful');

      // Reset form
      setFormData({
        customer_id: '',
        guest_name: '',
        room_number: '',
        checkin_date: '',
        checkout_date: '',
        paid_amount: '',
        pending_amount: '',
      });

      fetchCustomers();
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('Checkout failed');
    }
  };

  // Auto-refresh customer list every second
  useEffect(() => {
    fetchCustomers();
    const interval = setInterval(fetchCustomers, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <form className="checkin-banner" onSubmit={handleSubmit}>
      <h2 className="checkin-title">CHECK OUT</h2>
      <div className="checkin-row">
        <div className="checkin-group">
          <label>Customer ID</label>
          <select
            name="customer_id"
            value={formData.customer_id}
            onChange={handleCustomerChange} // use it here
            required
          >
            <option value="">Select Customer ID</option>
            {customers.map((cust) => (
              <option key={cust.identityNumber} value={cust.identityNumber}>
                {cust.identityNumber} {/* Display ID */}
              </option>
            ))}
          </select>
        </div>
        <div className="checkin-group">
          <label>Guest Name</label>
          <input
            type="text"
            name="guest_name"
            value={formData.guest_name}
            onChange={(e) =>
              setFormData({ ...formData, guest_name: e.target.value })
            }
            required
          />
        </div>
        <div className="checkin-group">
          <label>Room Number</label>
          <input
            type="text"
            name="room_number"
            value={formData.room_number}
            onChange={(e) =>
              setFormData({ ...formData, room_number: e.target.value })
            }
            required
          />
        </div>
      </div>
      <div className="checkin-row">
        <div className="checkin-group">
          <label>Check-in Date</label>
          <input
            type="datetime-local"
            name="checkin_date"
            value={formData.checkin_date}
            readOnly
          />
        </div>

        <div className="checkin-group">
          <label>Checkout Date</label>
          <input
            type="datetime-local"
            name="checkout_date"
            value={formData.checkout_date}
            onChange={(e) =>
              setFormData({ ...formData, checkout_date: e.target.value })
            }
            required
          />
        </div>
      </div>
      <div className="checkin-row">
        <div className="checkin-group">
          <label>Paid Amount</label>
          <input
            type="number"
            name="paid_amount"
            value={formData.paid_amount}
            onChange={(e) =>
              setFormData({ ...formData, paid_amount: e.target.value })
            }
            readOnly
          />
        </div>

        <div className="checkin-group">
          <label>Pending Amount</label>
          <input
            type="number"
            name="pending_amount"
            value={formData.pending_amount}
            readOnly
          />
        </div>
      </div>
      <div className="checkin-buttons">
        <button type="submit" className="checkin-submit">
          Checkout
        </button>
        <button
          type="button"
          className="checkin-cancel"
          onClick={() =>
            setFormData({
              customer_id: '',
              guest_name: '',
              room_number: '',
              checkin_date: '',
              checkout_date: '',
              paid_amount: '',
              pending_amount: '',
            })
          }
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default Checkout;
