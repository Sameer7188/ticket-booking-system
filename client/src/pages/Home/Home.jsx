import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import './Home.css';

const Home = () => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/shows')
      .then(res => {
        setShows(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="container"><h2>Loading shows...</h2></div>;
  return (  
    <div className="container home-page">
      <h1 className="home-title">Welcome to Ticket Booking</h1>
      <p className="home-subtitle">Browse and book your favorite shows or movies!</p>
      <div className="show-list">
        {shows.map(show => (
          <div key={show._id} className="show-card">
            <img src={show.poster} alt={show.title} className="show-poster" />
            <h3 className="show-title">{show.title}</h3>
            <p className="show-description">{show.description}</p>
            <Link to={`/show/${show._id}`} className="show-details-link">View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home; 