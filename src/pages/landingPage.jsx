import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { genreList } from "../helper/genreList";
import { useNavigate } from "react-router-dom"; 

export const LandingPage = () => {
  const navigate = useNavigate();

  //Logic to redirect to listing page with selected genre or category.
  const handleCardClick = (genre) => {
    const formattedGenre =
      genre.charAt(0).toUpperCase() + genre.slice(1).toLowerCase();
    navigate(`/books/${formattedGenre}`);
  };

  return (
    <>
      <Container fluid className="p-4 mt-4 container-bg">
        <div className="background-container">
          <div className="text-content">
            <h1 className="header">Gutenberg Project</h1>
            <p className="lead">
              A social cataloging website that allows you to freely search its
              database of books, annotations, and reviews.
            </p>
          </div>
        </div>

        <Row className="mt-5 genre-card-container">
          {genreList.map((genre) => (
            <Col xs={12} md={6} className="mb-4" key={genre.genre}>
              <Card
                className="genre-card"
                onClick={() => handleCardClick(genre.genre)} 
                role="button"
              >
                <Card.Body className="genre-card-body">
                  <div className="d-flex align-items-center">
                    <div className="genre-icon">
                      <img src={genre.icon} alt={`${genre.genre} icon`} />
                    </div>
                    <span className="genre-title">{genre.genre}</span>
                  </div>
                  <img src="/images/Next.svg" alt="Next icon" />
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};
