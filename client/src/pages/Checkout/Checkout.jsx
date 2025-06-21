import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import QRCode from 'react-qr-code';
import './Checkout.css';

const Checkout = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [upiRef, setUpiRef] = useState('');
  const [upiRefError, setUpiRefError] = useState('');

  useEffect(() => {
    api.get(`/bookings/user/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        const bookings = res.data.filter(b => b.show && b.show._id === id);
        setBooking(bookings[bookings.length - 1]);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch booking');
        setLoading(false);
      });
  }, [id, user.id, token]);

  const upiPayee = '9825417188@kotak811';
  const upiPayeeName = 'TicketBooking';
  const upiAmount = booking ? booking.total : 0;
  const upiUrl = `upi://pay?pa=${upiPayee}&pn=${upiPayeeName}&am=${upiAmount}&cu=INR`;

  const handlePaidClick = () => {
    if (!upiRef.trim()) {
      setUpiRefError('Please enter your UPI transaction reference number.');
      return;
    }
    setUpiRefError('');
    setSuccess(`Payment successful! Reference: ${upiRef}. Redirecting to receipts...`);
    setTimeout(() => {
      navigate('/receipts');
    }, 5000);
  };

  if (loading) return <div className="container"><h2>Loading booking...</h2></div>;
  if (error || !booking) return (
    <div className="container">
      <h2 className="error">{error || 'No booking found'}</h2>
    </div>
  );

  return (
    <div className="checkout-wrapper">
      <div className="checkout-container">
        <h2 className="checkout-title">Checkout</h2>

        <div className="checkout-summary">
          <div><strong>Show:</strong> {booking.show.title}</div>
          <div><strong>Selected Seats:</strong> {booking.seats.join(', ')}</div>
          <div><strong>Price per seat:</strong> ₹200</div>
          <div><strong>Total:</strong> <span className="checkout-total">₹{booking.total}</span></div>
        </div>

        <div className="checkout-payment">
          <h3 className="upi-title">Pay using UPI</h3>
          <div className="qr-wrapper">
            <QRCode value={upiUrl} size={180} />
            <div className="qr-details">
              Scan this QR code with any UPI app to pay<br />
              <strong>UPI ID:</strong> {upiPayee}<br />
              <strong>Amount:</strong> ₹{upiAmount}
            </div>
          </div>
          <div className="upi-ref-field">
            <label htmlFor="upiRef">Enter UPI Transaction Reference Number:</label>
            <input
              id="upiRef"
              type="text"
              value={upiRef}
              onChange={e => setUpiRef(e.target.value)}
              placeholder="e.g. 123456789012"
              className="upi-ref-input"
            />
            {upiRefError && <div className="upi-ref-error">{upiRefError}</div>}
          </div>
          <button className="paid-btn" onClick={handlePaidClick}>
            I have paid (via QR/UPI app)
          </button>
        </div>

        {success && <div className="success">{success}</div>}
      </div>
    </div>
  );
};

export default Checkout;
