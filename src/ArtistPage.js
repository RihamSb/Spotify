import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Card, CardBody, CardImg, Button } from 'react-bootstrap';

const CLIENT_ID = 'c33066c49bfc4de4a62b0c620868dd31';
const CLIENT_SECRET = '48333a526370498f99a37acd13ade89d';

function ArtistPage() {
  const { id } = useParams(); 
  const [albums, setAlbums] = useState([]);
  const [accessToken, setAccessToken] = useState('');
  const [artist, setArtist] = useState({}); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
        });
        const data = await response.json();
        setAccessToken(data.access_token);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAccessToken();
  }, []);

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const response = await fetch(`https://api.spotify.com/v1/artists/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await response.json();
        setArtist(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchArtist();
  }, [accessToken, id]);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await fetch(`https://api.spotify.com/v1/artists/${id}/albums`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await response.json();
        setAlbums(data.items);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAlbums();
  }, [accessToken, id]);

  const handleBackButton = () => {
    navigate('/artist-search');
  };

  return (
    <>
    <h4 style={{ backgroundColor: 'grey', padding:'15px'}}>Spotify Artist Search</h4>
    <Container className="pt-5">
      <Button variant="secondary" onClick={handleBackButton}>
        <i className="fa fa-arrow-left" aria-hidden="true"></i> Back to Artist Search
      </Button>
      <h1>{artist.name}</h1> 
      <Row className="mx-2 row row-cols-1 row-cols-md-2 row-cols-lg-4">
        {albums && albums.length > 0 ? (
          albums.map((album) => (
            <Card className="mb-3" key={album.id}>
              <CardImg src={album.images[0].url} className="album-image mx-auto" />
              <CardBody className="text-center">
                <Card.Title className="text-center">{album.name}</Card.Title>
                <Card.Subtitle className="text-center">
                  {album.artists.map((artist) => (
                    <span key={artist.id}>{artist.name} </span>
                  ))}
                </Card.Subtitle>
                <Card.Subtitle className="text-center">
                  Release Year: {album.release_date.split('-')[0]}
                </Card.Subtitle>
                <Card.Subtitle className="text-center">
                  Total Tracks: {album.total_tracks}
                </Card.Subtitle>
                <Card.Subtitle className="text-center" >
                <a href={album.external_urls.spotify} target="_blank" rel="noopener noreferrer" style={{ textDecoration:'none', color: 'black'}}>
                    Listen on Spotify
                </a>
                </Card.Subtitle>
              </CardBody>
            </Card>
          ))
        ) : (
          <p>No albums found</p>
        )}
      </Row>
    </Container>
    </>
  );
}

export default ArtistPage;