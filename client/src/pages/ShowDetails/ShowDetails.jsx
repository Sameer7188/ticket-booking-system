import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import './ShowDetails.css';
const ShowDetails = () => { 
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/shows/${id}`)
      .then(res => {
        setShow(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Show not found');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="container"><h2>Loading show details...</h2></div>;
  if (error || !show) return <div className="container"><h2>{error || 'Show not found'}</h2></div>;

  return (
    <div className="container show-details-container">
      <div className="show-details-card">
        <img src={show.poster} alt={show.title} className="show-details-poster" />
        <div className="show-details-info">
          <h2 className="show-details-title">{show.title}</h2>
          <p className="show-details-desc">{show.details}</p>
          <Link to={`/book/${show._id}`}><button className="show-details-book-btn">Book Now</button></Link>
          <div className="show-cast-section">
            <h3 className="show-cast-title">Cast</h3>
            <div className="show-cast-list">
              {show.cast.map((member, idx) => (
                <div className="show-cast-member" key={idx}>
                  <img src={member.image} alt={member.name} className="show-cast-img" />
                  <div className="show-cast-name">{member.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowDetails; 