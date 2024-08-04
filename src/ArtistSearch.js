import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, InputGroup, FormControl, Button, Row, Card, CardBody, CardImg } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const CLIENT_ID = '';
const CLIENT_SECRET = '';

function ArtistSearch() {
  
  const navigate = useNavigate();

  //Logout funtion
  const logout = () => {
    window.localStorage.removeItem("token");
    navigate('/'); // navigate back to login page
  };

  const [searchInput, setSearchInput] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [artists, setArtists] = useState([]);
  const [artistRatings, setArtistRatings] = useState({});

  //From Client Credentials Flow
  useEffect(() => {
    //request the API Access Token
    const authParameters = {
      method: 'POST',//post request
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',//tells the server that the request body ontain url- enoded data
      },
      body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
    };

    //request to Spotify API token endpoint
    fetch('https://accounts.spotify.com/api/token', authParameters)
    // response from the server
    //.then is a method used to handle promise returned by feth. 
      .then(async (result) => {
        const data = await result.json(); //wait to onvert it all and move to seond step
        // console.log(data);
        setAccessToken(data.access_token);
      });

  }, []);


  // Search
  async function search() {
    // console.log('Search for ' + searchInput);
    // Get the artist
    const searchParameters = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    };

    try {
      //searches for artists mathes the input
      const response = await fetch(`https://api.spotify.com/v1/search?q=${searchInput}&type=artist`, searchParameters);
      //the result
      const data = await response.json();
      setArtists(data.artists.items);
    //   data.artists.items.forEach((artist) => {
    //   console.log(`Artist: ${artist.name}, Popularity: ${artist.popularity}`);
    // });
    } catch (error) {
      console.error(error);
    }
  }

  // Search-as-you-type functionality
  // when search input hange funtuion run
  useEffect(() => {
    if (searchInput.length > 2) {
      search();
    }
  }, [searchInput]);

  
  //when artist change, the funtion run to get the rating /5
  useEffect(() => {
    const calculateRatings = () => {
      const ratings = {};
      
      artists.forEach((artist) => {
        // Math.floor or Math.ceil
        const rating = Math.floor(artist.popularity / 20); // from /100 to /5. nb/20
        ratings[artist.id] = rating;
      });
      
      setArtistRatings(ratings);
    };
    calculateRatings();
  }, [artists]);



  useEffect(()=>{
    AOS.init({duration: 2000})
  }, [])

  return (
    <>
    <h4 style={{ backgroundColor: 'grey', padding:'15px'}}>Spotify Artist Search</h4>
    <div className="App">
      <Container className="pt-5">
        <button onClick={logout} className="btn btn-secondary">Logout</button>
        <br/><br/>
        <InputGroup className="mb-3" size="lg">
          <FormControl
            placeholder="Search for an artist..."
            type="input"
            onKeyPress={(event) => {
              if (event.key === 'Enter') {
                search();
              }
            }}
            //every chnage save the new input
            onChange={(event) => setSearchInput(event.target.value)}
          />
          <Button onClick={search} variant="primary">Search</Button>
        </InputGroup>
      </Container>
      <Container className="pt-5">
        <Row className="mx-2 row row-cols-1 row-cols-md-2 row-cols-lg-4">
          {artists.map((artist) => (
            <Link to={`/artist/${artist.id}`} key={artist.id} style={{ textDecoration: 'none', color: 'black' }}>
            <Card data-aos="fade-up" className="mb-3">
              {/* if image exist */}
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
                  
                  {artistRatings[artist.id]!== undefined? (
                    <span className="d-flex justify-content-center">
                      {/* add the yellow stars */}
                      {Array(artistRatings[artist.id]).fill(0).map((_, index) => (
                        <span key={index} className="fa fa-star checked"></span>
                      ))}
                      {/* add !yellow */}
                      {Array(5 - artistRatings[artist.id]).fill(0).map((_, index) => (
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
