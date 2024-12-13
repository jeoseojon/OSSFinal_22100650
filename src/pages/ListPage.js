import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

function ListPage() {
  const [albums, setAlbums] = useState([]);
  const [hoveredAlbum, setHoveredAlbum] = useState(null); // track which album is hovered
  const [searchQuery, setSearchQuery] = useState("");
  const [minRating, setMinRating] = useState("All");
  const location = useLocation();

  // fetch albums from the API
  useEffect(() => {
    async function fetchAlbums() {
      try {
        const response = await fetch(
          "https://6728860f270bd0b97555efb5.mockapi.io/albums"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch albums.");
        }
        const data = await response.json();
        setAlbums(data);
      } catch (error) {
        console.error(error);
        alert("Error fetching albums.");
      }
    }
    fetchAlbums();
  }, []);

  const handleSearchInput = useCallback((value) => {
    setSearchQuery(value);
  }, []);

  const handleMinRatingChange = useCallback((value) => {
    setMinRating(value);
  }, []);

  const filteredAlbums = useMemo(() => {
    const query = searchQuery.toLowerCase();

    return albums.filter((album) => {
      // Album Name Match
      const albumMatch = album.name.toLowerCase().includes(query);

      // Artist Name Match
      const artistMatch =
        album.artists &&
        album.artists.some((artist) =>
          artist.name.toLowerCase().includes(query)
        );

      // Genre Match
      const genreMatch =
        album.genres &&
        album.genres.some((genre) => genre.toLowerCase().includes(query));

      // track name match
      const trackMatch =
        album.tracks &&
        album.tracks.some((track) => track.name.toLowerCase().includes(query));

      // rating filter
      const ratingMatch =
        minRating === "All" ||
        (album.rating && album.rating >= Number(minRating));

      // return true if any of the search fields match and rating criteria are met
      return (
        (albumMatch || artistMatch || genreMatch || trackMatch) && ratingMatch
      );
    });
  }, [albums, searchQuery, minRating]);

  // debounce
  useEffect(() => {
    const handler = setTimeout(() => {}, 300); // 300ms debounce time

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // styling objects
  const headerStyle = {
    backgroundColor: "#111111",
    color: "#fff",
    padding: "20px",
    fontWeight: "bold",
    fontSize: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: "20px",
    fontFamily: "sans-serif",
  };

  const navLinkStyle = {
    color: "#AEAEAE",
    textDecoration: "none",
    fontSize: "16px",
    fontFamily: "sans-serif",
  };

  const activeNavLinkStyle = {
    color: "#fff",
  };

  const filterContainerStyle = {
    margin: "20px auto",
    textAlign: "center",
    fontFamily: "sans-serif",
  };

  //seach box styling
  const inputStyle = {
    padding: "8px",
    marginRight: "10px",
    width: "300px",
    backgroundColor: "#f0f0f0", // Light gray background
    color: "#333", // Dark text for better readability
    border: "1px solid #ccc", // Light border
    borderRadius: "4px", // rounded corners
    outline: "none", // remove default outline
    boxSizing: "border-box", // Ensure padding doesn't affect overall width
    transition: "background-color 0.3s, border-color 0.3s", // Smooth transition on focus
  };

  const selectStyle = {
    ...inputStyle,
    width: "150px",
  };

  const gridContainerStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "7px",
    padding: "20px",
    margin: "0 auto",
    maxWidth: "95%",
    width: "100%",
  };

  const albumContainerStyle = {
    position: "relative",
    overflow: "hidden",
    height: "210px",
    cursor: "pointer",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s",
  };

  const albumImageStyle = (isHovered) => ({
    width: "100%",
    height: "100%",
    objectFit: "cover",
    opacity: isHovered ? 0.7 : 1, // dim only the hovered image
    transition: "opacity 0.3s ease",
  });

  const albumOverlayStyle = (isHovered) => ({
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: isHovered ? 1 : 0, // show overlay only on hover
    transition: "opacity 0.3s ease",
    fontSize: "14px",
    fontFamily: "sans-serif",
    fontWeight: "bold",
    textAlign: "center",
    padding: "10px",
  });

  const pageStyle = {
    backgroundColor: "#111111",
    color: "#fff",
    fontFamily: "sans-serif",
    minHeight: "100vh",
  };

  return (
    <div style={pageStyle}>
      <style>
        {`
          a:hover {
            color: #fff !important;
          }
          @media (max-width: 1024px) {
            .responsive-container {
              grid-template-columns: repeat(3, 1fr) !important;
            }
          }
          @media (max-width: 768px) {
            .responsive-container {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }
          @media (max-width: 480px) {
            .responsive-container {
              grid-template-columns: repeat(1, 1fr) !important;
            }
          }
          /* Focus styles for the search input */
          .search-input:focus {
            background-color: #e0e0e0;
            border-color: #999;
          }
        `}
      </style>

      {/* Navbar */}
      <div style={headerStyle}>
        <div>My Albums</div>
        <Link
          to="/"
          style={{
            ...navLinkStyle,
            ...(location.pathname === "/" ? activeNavLinkStyle : {}),
          }}
        >
          Search
        </Link>
        <Link
          to="/list"
          style={{
            ...navLinkStyle,
            ...(location.pathname === "/list" ? activeNavLinkStyle : {}),
          }}
        >
          Collection
        </Link>
      </div>

      <div style={filterContainerStyle}>
        <input
          type="text"
          placeholder="Search albums"
          value={searchQuery}
          onChange={(e) => handleSearchInput(e.target.value)}
          style={inputStyle}
          className="search-input" // for focus styles
          aria-label="Search Albums"
        />

        <select
          value={minRating}
          onChange={(e) => handleMinRatingChange(e.target.value)}
          style={selectStyle}
          className="search-input"
        >
          <option value="All">Filter Rating</option>
          <option value="1">1 and up</option>
          <option value="2">2 and up</option>
          <option value="3">3 and up</option>
          <option value="4">4 and up</option>
          <option value="5">5 only</option>
        </select>
      </div>

      {/* Albums Grid */}
      <div style={gridContainerStyle} className="responsive-container">
        {filteredAlbums.length === 0 ? (
          <p>No albums match your search.</p>
        ) : (
          filteredAlbums.map((album) => {
            const albumCover =
              album.images && album.images.length > 0
                ? album.images[0].url
                : null;

            const artistNames =
              album.artists && album.artists.length > 0
                ? album.artists.map((artist) => artist.name).join(", ")
                : "Unknown Artist";

            const isHovered = hoveredAlbum === album.id;

            return (
              albumCover && (
                <Link to={`/albums/${album.id}`} key={album.id}>
                  <div
                    style={albumContainerStyle}
                    onMouseEnter={() => setHoveredAlbum(album.id)}
                    onMouseLeave={() => setHoveredAlbum(null)}
                  >
                    <img
                      src={albumCover}
                      alt={album.name}
                      style={albumImageStyle(isHovered)}
                    />
                    <div style={albumOverlayStyle(isHovered)}>
                      {`${album.name} | ${artistNames}`}
                    </div>
                  </div>
                </Link>
              )
            );
          })
        )}
      </div>
    </div>
  );
}

export default ListPage;
