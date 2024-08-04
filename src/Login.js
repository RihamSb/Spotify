import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import spo from './spo.png';

function Login() {
  const CLIENT_ID = "";
  const REDIRECT_URI = "http://localhost:3000";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";

  const [token, setToken] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1];

      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }

    setToken(token);
  }, []);

  useEffect(() => {
    if (token) {
      navigate('/artist-search');
    }
  }, [token, navigate]);

  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token");
    navigate('/'); // navigate back to login page
  };

  return (
    <><h4 style={{ backgroundColor: 'grey', padding:'15px'}}>Spotify Artist Search</h4>

    <div className="container d-flex justify-content-center align-items-center" style={{ height: '100vh', backgroundColor: '#f0f0f0' }}>
      <div className="card" style={{ width: '300px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
        <div className="card-body">
          <div className="d-flex mb-2" >
            {!token?
              <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`} className="btn btn-success" style={{backgroundColor: '#1DB954', border: 'none', width: '100%'}}>
                Login
              </a>
              : <button onClick={logout} className="btn btn-primary" style={{width: '100%'}}>Logout</button>}
          <img src={spo} alt="Spotify Logo" style={{ width: '40px', height: '40px'}} />
        </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default Login;
