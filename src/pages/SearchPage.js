import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import AlbumItem from "../components/AlbumItem";

function SearchPage() {
  const [query, setQuery] = useState("");
  const [albums, setAlbums] = useState([]);
  const [token, setToken] = useState("");
  const [addedAlbums, setAddedAlbums] = useState([]);
  const location = useLocation(); //determine the active page

  // fetch Spotify token on component mount
  useEffect(() => {
    async function fetchToken() {
      const tk = await getSpotifyToken();
      setToken(tk);
    }
    fetchToken();
  }, []);

  // fetch added albums on component mount
  useEffect(() => {
    async function fetchAddedAlbums() {
      try {
        const response = await fetch(
          "https://6728860f270bd0b97555efb5.mockapi.io/albums"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch added albums.");
        }
        const data = await response.json();
        setAddedAlbums(data);
      } catch (error) {
        console.error(error);
        alert("Error fetching added albums.");
      }
    }
    fetchAddedAlbums();
  }, []);

  const handleSearch = useCallback(async () => {
    if (!query || !token) return;

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          query
        )}&type=album`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch albums from Spotify.");
      }

      const data = await response.json();
      setAlbums(data.albums ? data.albums.items : []);
    } catch (error) {
      console.error(error);
      alert("Error fetching albums from Spotify.");
    }
  }, [query, token]);

  // trigger search whenever search field changes
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query && token) {
        handleSearch();
      } else {
        setAlbums([]);
      }
    }, 500); // 500ms debounce to prevent excessive API calls

    return () => clearTimeout(delayDebounce);
  }, [query, token, handleSearch]);

  const handleAddAlbum = async (album) => {
    try {
      // Check for duplicates
      const existingAlbumsResponse = await fetch(
        "https://6728860f270bd0b97555efb5.mockapi.io/albums"
      );
      if (!existingAlbumsResponse.ok) {
        throw new Error("Failed to fetch existing albums.");
      }
      const existingAlbums = await existingAlbumsResponse.json();

      const isDuplicate = existingAlbums.some(
        (storedAlbum) => storedAlbum.spotifyId === album.id
      );
      if (isDuplicate) {
        alert("Album is already added.");
        return;
      }

      const albumToPost = {
        ...album,
        spotifyId: album.id,
        rating: 3,
        genres: [],
      };

      const response = await fetch(
        "https://6728860f270bd0b97555efb5.mockapi.io/albums",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(albumToPost),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add album.");
      }

      const newAlbum = await response.json();
      setAddedAlbums((prev) => [...prev, newAlbum]);
      alert("Album added successfully!");
    } catch (error) {
      console.error(error);
      alert("Error adding album.");
    }
  };

  const handleRemoveAlbum = async (album) => {
    try {
      const stored = addedAlbums.find((a) => a.spotifyId === album.id);
      if (!stored) {
        alert("Album not found.");
        return;
      }

      const response = await fetch(
        `https://6728860f270bd0b97555efb5.mockapi.io/albums/${stored.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove album.");
      }

      setAddedAlbums((prev) => prev.filter((a) => a.id !== stored.id));
      alert("Album removed successfully!");
    } catch (error) {
      console.error(error);
      alert("Error removing album.");
    }
  };

  const handleToggleAlbum = (album, isAdded) => {
    if (isAdded) {
      handleRemoveAlbum(album);
    } else {
      handleAddAlbum(album);
    }
  };

  const addedIds = new Set(addedAlbums.map((a) => a.spotifyId));

  // navbar styling
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

  const searchContainerStyle = {
    margin: "20px auto",
    textAlign: "center",
    fontFamily: "sans-serif",
  };

  const searchInputStyle = {
    padding: "8px",
    width: "300px",
    marginRight: "10px",
    backgroundColor: "#f0f0f0", // light gray background
    color: "#333", // dark text
    border: "1px solid #ccc", // light border
    borderRadius: "4px", // rounded corners
    outline: "none", // remove default outline
    boxSizing: "border-box", // ensure padding doesn't affect overall width
    transition: "background-color 0.3s, border-color 0.3s", // smooth transition on focus
  };

  const resultsContainerStyle = {
    margin: "20px auto",
    maxWidth: "70%",
    width: "100%",
    fontFamily: "sans-serif",
  };

  const resultsHeadingStyle = {
    fontSize: "20px",
    marginBottom: "10px",
  };

  const listStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  };

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
          @media (max-width: 600px) {
            .responsive-container {
              max-width: 100% !important;
            }
          }
          /* Optional: If you decide to use a CSS class for focus styles */
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

      <div style={searchContainerStyle}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What album do you want to add?"
          style={searchInputStyle}
        />
      </div>

      {albums.length > 0 && (
        <div style={resultsContainerStyle} className="responsive-container">
          <h2 style={resultsHeadingStyle}>Results</h2>
          <div style={listStyle}>
            {albums.map((album) => {
              const isAdded = addedIds.has(album.id);
              return (
                <AlbumItem
                  key={album.id}
                  album={album}
                  isAdded={isAdded}
                  onToggle={() => handleToggleAlbum(album, isAdded)}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

async function getSpotifyToken() {
  return process.env.REACT_APP_SPOTIFY_TOKEN;
}

export default SearchPage;
