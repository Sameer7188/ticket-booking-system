import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import QRCode from 'react-qr-code';
import './Receipts.css';

const Receipts = () => {
  const { user, token } = useAuth();
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/receipts/user/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        setReceipts(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch receipts');
        setLoading(false);
      });
  }, [user.id, token]);

  if (loading) return <div className="container"><h2>Loading receipts...</h2></div>;
  if (error) return <div className="container"><h2 style={{ color: 'red' }}>{error}</h2></div>;

  return (
    <div className="receipts-container">
      <div className="receipts-inner">
        <h2 className="receipts-title">Your Booked Tickets</h2>
        {receipts.length === 0 ? (
          <div className="receipts-empty">No tickets to display.</div>
        ) : (
          receipts.map(receipt => (
            <div key={receipt._id} className="receipt-card">
              <div className="receipt-details">
                <h3>🎟️ Ticket</h3>
                <div className="receipt-info"><strong>Show:</strong> {receipt.booking?.show?.title || 'N/A'}</div>
                <div className="receipt-info"><strong>Seats:</strong> {receipt.booking?.seats?.join(', ') || 'N/A'}</div>
                <div className="receipt-info"><strong>Total Paid:</strong> <span className="receipt-amount">₹{receipt.amount}</span></div>
                <div className="receipt-info"><strong>Date:</strong> {new Date(receipt.date).toLocaleString()}</div>
                <div className="receipt-id"><strong>Ticket ID:</strong> {receipt._id}</div>
              </div>
              <div className="receipt-qr">
                <QRCode value={receipt._id} size={90} />
                <div className="receipt-qr-caption">Scan for ticket ID</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );  
};

export default Receipts; 