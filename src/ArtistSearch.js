import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, InputGroup, FormControl, Button, Row, Card, CardBody, CardImg } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom'; // Import Link

const CLIENT_ID = 'c33066c49bfc4de4a62b0c620868dd31';
const CLIENT_SECRET = '48333a526370498f99a37acd13ade89d';

function ArtistSearch() {
  const navigate = useNavigate();

  const logout = () => {
    window.localStorage.removeItem("token");
    navigate('/'); // navigate back to login page
  };

  const [searchInput, setSearchInput] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [artists, setArtists] = useState([]);
  const [artistRatings, setArtistRatings] = useState({});

  useEffect(() => {
    // API Access Token
    const authParameters = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
    };

    fetch('https://accounts.spotify.com/api/token', authParameters)
      .then((result) => result.json())
      .then((data) => setAccessToken(data.access_token));
  }, []);

  // Extract artist ratings from the 'popularity' field in the artist object
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await fetch('https://api.example.com/artist-ratings');
        const data = await response.json();
        setArtistRatings(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRatings();
  }, []);
  useEffect(() => {
    const calculateRatings = () => {
      const ratings = {};
      artists.forEach((artist) => {
        // Calculate the rating for each artist based on some other data
        const rating = Math.floor(Math.random() * 100); // Replace this with your actual rating calculation
        ratings[artist.id] = rating;
      });
      setArtistRatings(ratings);
    };
    calculateRatings();
  }, [artists]);

  // Search
  async function search() {
    console.log('Search for ' + searchInput);

    // Get the artist
    const searchParameters = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    };

    try {
      const response = await fetch(`https://api.spotify.com/v1/search?q=${searchInput}&type=artist`, searchParameters);
      const data = await response.json();
      setArtists(data.artists.items);
    } catch (error) {
      console.error(error);
    }
  }

  // Search-as-you-type functionality
  useEffect(() => {
    if (searchInput.length > 2) {
      search();
    }
  }, [searchInput]);

  return (
    <>
    <h4 style={{ backgroundColor: 'grey', padding:'15px'}}>Spotify Artist Search</h4>
    <div className="App">
      <Container className="pt-5">
        <button onClick={logout} className="btn btn-secondary">Logout</button>
        <InputGroup className="mb-3" size="lg">
          <FormControl
            placeholder="Search for an artist..."
            type="input"
            onKeyPress={(event) => {
              if (event.key === 'Enter') {
                search();
              }
            }}
            onChange={(event) => setSearchInput(event.target.value)}
          />
          <Button onClick={search} variant="primary">Search</Button>
        </InputGroup>
      </Container>
      <Container className="pt-5">
        <Row className="mx-2 row row-cols-1 row-cols-md-2 row-cols-lg-4">
          {artists.map((artist) => (
            <Link to={`/artist/${artist.id}`} key={artist.id} style={{ textDecoration: 'none', color: 'black' }}>
            <Card className="mb-3">
              {artist.images.length > 0 ? (
                <CardImg src={artist.images[0].url} className="artist-image mx-auto" />
              ) : (
                <CardImg src="https://via.placeholder.com/150" className="artist-image mx-auto" />
              )}
              <CardBody className="text-center">
                <Card.Title className="text-center">{artist.name}</Card.Title>
                <Card.Subtitle className="text-center">
                  {artist.followers && (
                    <p className="text-center">{artist.followers.total} Followers</p>
                  )}
                  {artistRatings[artist.id] !== undefined ? (
                    <span className="d-flex justify-content-center">
                      {Array(Math.floor(artistRatings[artist.id] / 20)).fill(0).map((_, index) => (
                        <span key={index} className="fa fa-star checked"></span>
                      ))}
                      {Array(5 - Math.floor(artistRatings[artist.id] / 20)).fill(0).map((_, index) => (
                        <span key={index} className="fa fa-star"></span>
                      ))}
                    </span>
                  ) : (
                    <span className="d-flex justify-content-center">
                      <span className="fa fa-star"></span>
                      <span className="fa fa-star"></span>
                      <span className="fa fa-star"></span>
                      <span className="fa fa-star"></span>
                      <span className="fa fa-star"></span>
                    </span>
                  )}
                </Card.Subtitle>
              </CardBody>
            </Card>
            </Link>
          ))}
        </Row>
      </Container>
    </div>
    </>
  );
}

export default ArtistSearch;