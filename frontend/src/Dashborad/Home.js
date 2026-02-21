import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const images = ['/images/home1.jpg', '/images/home2.jpg', '/images/home3.png'];

function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="home-container d-flex justify-content-center align-items-center"
      style={{
        backgroundImage: `url(${images[currentImageIndex]})`,
      }}
    >
      <div className="overlay"></div>

      {/* Logo in top-right corner */}
      <div className="logo-container">
        <img src="/images/logo.jpg" alt="Hotel Logo" className="logo-img" />
      </div>

      <div className="content text-center text-white">
        <h1 className="animated fadeInDown">Welcome to Our Hotel</h1>
        <p className="animated fadeIn delay-1s">
          Luxury, Comfort, and Hospitality
        </p>
        <div className="d-flex justify-content-center gap-3 mt-4 animated fadeInUp delay-2s">
          <Link to="/login">
            <button className="btn btn-primary px-4 py-2">Login</button>
          </Link>
          <Link to="/signup">
            <button className="btn btn-outline-light px-4 py-2">Signup</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
