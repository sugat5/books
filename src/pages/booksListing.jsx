import React, { useEffect, useState, useRef } from "react";
import { Container, Row, Col, Form, Spinner } from "react-bootstrap";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";



//Debounced to minimized api calls ==>
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};

export const BooksListing = () => {
  const { genre } = useParams();
  const navigate = useNavigate();
  const [bookList, setBookList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef();
  const lastBookElementRef = useRef(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 800);




  useEffect(() => {
    setPage(1);
    setBookList([]);
    setHasMore(true);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    getBooks();
  }, [genre, debouncedSearchTerm, page]);

  const getBooks = async () => {
    setLoading(true);
    const params = {
      mime_type: "image/jpeg",
      topic: genre,
      page,
    };
    if (debouncedSearchTerm) {
      params.search = debouncedSearchTerm;
    }
    try {
      const { data } = await axios.get("http://skunkworks.ignitesol.com:8000/books", { params });
      if (data.next) {
        setBookList((prevBooks) => [...prevBooks, ...data.results]);
      } else {
        setBookList(data.results);
      }
      setHasMore(!!data.next);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const openBook = (book) => {
    const formats = book.formats;
    if (formats["text/html"]) {
      window.open(formats["text/html"], "_blank");
    } else if (formats["application/pdf"]) {
      window.open(formats["application/pdf"], "_blank");
    } else if (formats["text/plain"]) {
      window.open(formats["text/plain"], "_blank");
    } else {
      alert("No viewable version available");
    }
  };


  //Logic for loading more data on scroll ==>
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1.0 }
    );
    if (lastBookElementRef.current) observerRef.current.observe(lastBookElementRef.current);
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [hasMore, loading]);

  const genreFormatted =
    genre.charAt(0).toUpperCase() + genre.slice(1).toLowerCase();

  return (
    <Container className="p-4">
      <Row>
        <Col>
          <div className="d-flex align-items-center mb-4">
            <img
              src="/images/Back.svg"
              alt="Back"
              onClick={() => navigate(-1)}
              className="listing-img"
            />
            <h2 className="ml-3 listing-title">{genreFormatted}</h2>
          </div>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={12}>
          <div className="form-group has-search w-100">
            <span className="fa fa-search form-control-feedback">
              <img
                src="/images/Search.svg"
                alt="Search Icon"
                className="search-icon"
              />
            </span>
            <input
              type="search"
              className="form-control"
              placeholder="Search"
              onChange={handleSearch}
              value={searchTerm}
            />
          </div>
        </Col>
      </Row>

      <div className="bg-full-width">
        <Container className="p-4">
          <Row className="book-grid">
            {bookList.map((book, index) => (
              <Col
                md={2}
                sm={4}
                xs={4}
                key={index}
                className="mb-5 mt-5"
                ref={index === bookList.length - 1 ? lastBookElementRef : null}
              >
                <div className="rectangle" onClick={() => openBook(book)}>
                  <img
                    src={book.formats["image/jpeg"]}
                    alt={book.title}
                    className="book-cover mb-2"
                  />
                  <div>
                    <h6 className="book-title text-uppercase p-0 m-1">
                      {book.title.slice(0, 20)}
                      {book.title.length > 20 && "..."}
                    </h6>
                    <p className="book-author text-muted mb-5">
                      {book.authors?.[0]?.name}
                    </p>
                  </div>
                </div>
              </Col>
            ))}
            {loading && (
              <Col className="text-center mt-5">
                <Spinner
                  animation="border"
                  variant="primary"
                  className="mt-5"
                />
              </Col>
            )}
          </Row>
        </Container>
      </div>
    </Container>
  );
};
