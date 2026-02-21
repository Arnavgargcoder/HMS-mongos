import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../RecptionCSS/PickupService.css';

function PickupService() {
  const [customers, setCustomers] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [carModel, setCarModel] = useState('');
  const [carNumber, setCarNumber] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [driver, setDriver] = useState('');
  const driverRef = useRef('');

  // Sync driverRef with current driver selection
  useEffect(() => {
    driverRef.current = driver;
  }, [driver]);

  // Fetch customer list on mount
  useEffect(() => {
    axios
      .get('http://localhost:3001/api/pickup-customers')
      .then((res) => setCustomers(res.data))
      .catch((err) => console.error('Error loading customers:', err));
  }, []);

  // Auto-refresh drivers every second
  useEffect(() => {
    const fetchDrivers = () => {
      axios
        .get('http://localhost:3001/api/pickup-drivers')
        .then((res) => {
          const available = res.data;
          setDrivers(available);

          // If current selected driver is no longer available, reset
          const stillAvailable = available.find(
            (d) => d.name === driverRef.current
          );
          if (!stillAvailable) {
            setDriver('');
            setCarModel('');
            setCarNumber('');
          }
        })
        .catch((err) => console.error('Error loading drivers:', err));
    };

    fetchDrivers();
    const interval = setInterval(fetchDrivers, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleDriverChange = (e) => {
    const name = e.target.value;
    setDriver(name);
    const selected = drivers.find((d) => d.name === name);
    if (selected) {
      setCarModel(selected.carmodel);
      setCarNumber(selected.carnumber);
    } else {
      setCarModel('');
      setCarNumber('');
    }
  };

  const handleCustomerChange = (e) => {
    const val = e.target.value;
    setCustomerId(val);
    const cust = customers.find((c) => `${c.identityNumber}-${c.name}` === val);
    setSelectedCustomer(cust || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!driver || !selectedCustomer) {
      alert('Please select both customer and driver.');
      return;
    }

    const cumid = `${selectedCustomer.identityNumber}-${selectedCustomer.name}`;

    try {
      await axios.post('http://localhost:3001/api/assign-driver', {
        driverName: driver,
        cumid,
      });
      alert('Driver assigned successfully.');

      // Reset form
      setCustomerId('');
      setSelectedCustomer(null);
      setDriver('');
      setCarModel('');
      setCarNumber('');
    } catch (err) {
      console.error('Submit error:', err);
      alert('Failed to assign driver.');
    }
  };

  const handleCancel = () => {
    setCustomerId('');
    setSelectedCustomer(null);
    setDriver('');
    setCarModel('');
    setCarNumber('');
  };

  return (
    <form className="pickup-banner" onSubmit={handleSubmit}>
      <h2 className="pickup-title">Pick Up Service</h2>

      <div className="pickup-group">
        <label>Customer ID</label>
        <select value={customerId} onChange={handleCustomerChange} required>
          <option value="">Select</option>
          {customers.map((c, idx) => (
            <option key={idx} value={`${c.identityNumber}-${c.name}`}>
              {c.identityNumber} - {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="pickup-group">
        <label>Driver</label>
        <select value={driver} onChange={handleDriverChange} required>
          <option value="">Select</option>
          {drivers.length === 0 ? (
            <option disabled>No available drivers</option>
          ) : (
            drivers.map((d, idx) => (
              <option key={idx} value={d.name}>
                {d.name} ({d.carmodel})
              </option>
            ))
          )}
        </select>
      </div>

      <div className="pickup-group">
        <label>Car Model</label>
        <input type="text" value={carModel} readOnly />
      </div>

      <div className="pickup-group">
        <label>Car Number</label>
        <input type="text" value={carNumber} readOnly />
      </div>

      <div className="pickup-buttons">
        <button type="submit" className="pickup-submit">
          SUBMIT
        </button>
        <button type="button" className="pickup-cancel" onClick={handleCancel}>
          CANCEL
        </button>
      </div>
    </form>
  );
}

export default PickupService;
