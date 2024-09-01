import { LandingPage } from "./pages/landingPage";
import { Route, Routes } from "react-router-dom";

import { BooksListing } from "./pages/booksListing";

function App({ routes }) {
  return (
    <>
      <Routes >
        <Route path="/" element={<LandingPage />} />
        <Route path="books/:id" element={<BooksListing />} />
      </Routes>
    </>
  );
}

export default App;
