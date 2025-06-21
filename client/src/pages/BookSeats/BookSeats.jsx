import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './BookSeats.css';

const ROWS = 8;
const COLS = 10;

const BookSeats = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  /* ───────────────────── Fetch seats on mount ───────────────────── */
  useEffect(() => {
    api
      .get(`/shows/${id}`)
      .then((res) => {
        setSeats(res.data.seats);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load seats');
        setLoading(false);
      });
  }, [id]);

  /* ────────────────────────── Handlers ──────────────────────────── */
  const handleSeatClick = (seatNumber, isBooked) => {
    if (isBooked) return;

    setSelectedSeats((prev) =>
      prev.includes(seatNumber)
        ? prev.filter((s) => s !== seatNumber)
        : [...prev, seatNumber]
    );
  };

  const handleProceed = async () => {
    setError('');
    setSuccess('');

    if (selectedSeats.length === 0) {
      setError('Please select at least one seat.');
      return;
    }

    try {
      await api.post(
        '/bookings',
        {
          userId: user.id,
          showId: id,
          seats: selectedSeats,
          total: selectedSeats.length * 200,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess('Booking successful! Redirecting to checkout...');
      setTimeout(() => {
        navigate(`/checkout/${id}`, { state: { seats: selectedSeats } });
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    }
  };

  /* ───────────────────── Build the seat grid ────────────────────── */
  const seatGrid = Array.from({ length: ROWS }).map((_, row) =>
    Array.from({ length: COLS }).map((_, col) => {
      const seatNumber = `${String.fromCharCode(65 + row)}${col + 1}`;
      const seat = seats.find((s) => s.seatNumber === seatNumber);
      const isBooked = seat?.isBooked;
      const isSelected = selectedSeats.includes(seatNumber);

      return (
        <button
          key={seatNumber}
          type="button"
          disabled={isBooked}
          onClick={() => handleSeatClick(seatNumber, isBooked)}
          className={`seat-btn ${
            isBooked
              ? 'seat-booked'
              : isSelected
              ? 'seat-selected'
              : 'seat-available'
          }`}
        >
          {seatNumber}
        </button>
      );
    })
  );

  /* ────────────────────────── RENDER ────────────────────────────── */
  if (loading) {
    return (
      <div className="container">
        <h2>Loading seats...</h2>
      </div>
    );
  }

  if (error && loading === false && seats.length === 0) {
    return (
      <div className="container">
        <h2 style={{ color: 'red' }}>{error}</h2>
      </div>
    );
  }

  return (
    <div className="bookseats-wrapper">
      <div className="bookseats-container">
        <h2 className="bookseats-title">Book Seats</h2>

        <div className="seat-grid">{seatGrid}</div>

        {/* ───────────── Legend ───────────── */}
        <div className="legend">
          <div className="legend-item">
            <span className="legend-box available-box"></span>
            <span>Available</span>
          </div>
          <div className="legend-item">
            <span className="legend-box selected-box"></span>
            <span>Selected</span>
          </div>
          <div className="legend-item">
            <span className="legend-box booked-box"></span>
            <span>Booked</span>
          </div>
        </div>

        {/* ───────────── Feedback ───────────── */}
        {error && <div className="feedback-message error">{error}</div>}
        {success && <div className="feedback-message success">{success}</div>}

        {/* ───────────── CTA Button ───────────── */}
        <div style={{ textAlign: 'center' }}>
          <button onClick={handleProceed} className="proceed-btn">
            Proceed to Checkout
          </button>
        </div>

        {/* ───────────── Selected Seats Info ───────────── */}
        {selectedSeats.length > 0 && (
          <div className="selected-info">
            Selected Seats: {selectedSeats.join(', ')}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookSeats;
