import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tracks, setTracks] = useState([]);
  const [tracksLoading, setTracksLoading] = useState(false);
  const [newRating, setNewRating] = useState("");

  const token = process.env.REACT_APP_SPOTIFY_TOKEN;

  useEffect(() => {
    async function fetchAlbum() {
      try {
        const response = await fetch(
          `https://6728860f270bd0b97555efb5.mockapi.io/albums/${id}`
        );
        if (!response.ok) {
          console.error(
            "Failed to load album",
            response.status,
            response.statusText
          );
          setLoading(false);
          return;
        }
        const data = await response.json();
        setAlbum(data);
      } catch (error) {
        console.error("Error fetching album:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAlbum();
  }, [id]);

  useEffect(() => {
    async function fetchTracks() {
      if (!album || !album.spotifyId || !token) return;

      setTracksLoading(true);
      try {
        const response = await fetch(
          `https://api.spotify.com/v1/albums/${album.spotifyId}/tracks`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          console.error(
            "Failed to load tracks",
            response.status,
            response.statusText
          );
          setTracksLoading(false);
          return;
        }

        const data = await response.json();
        setTracks(data.items || []);
      } catch (error) {
        console.error("Error loading tracks:", error);
      } finally {
        setTracksLoading(false);
      }
    }

    if (album && token) {
      fetchTracks();
    }
  }, [album, token]);

  if (loading) {
    return <div>Loading album details...</div>;
  }

  if (!album) {
    return <div>Album not found.</div>;
  }

  const { name, album_type, artists, images, rating, genres } = album;

  const artistNames =
    artists && artists.length > 0
      ? artists.map((artist) => artist.name).join(", ")
      : "Unknown Artist";

  const albumCover = images && images.length > 0 ? images[0].url : "";

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    const ratingValue = Number(newRating);

    if (!ratingValue || ratingValue < 1 || ratingValue > 5) {
      alert("Please enter a valid rating between 1 and 5");
      return;
    }

    try {
      const response = await fetch(
        `https://6728860f270bd0b97555efb5.mockapi.io/albums/${id}`,
        {
          method: "put",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ rating: ratingValue }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to update rating:", errorText);
        alert("Failed to update rating.");
        return;
      }

      const updatedAlbum = await response.json();
      setAlbum(updatedAlbum);
      setNewRating("");
      alert("Rating updated successfully!");
    } catch (err) {
      console.error("Error updating rating:", err);
      alert("An error occurred while updating the rating.");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this album?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `https://6728860f270bd0b97555efb5.mockapi.io/albums/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to delete album:", errorText);
        alert("Failed to delete album.");
        return;
      }

      alert("Album deleted successfully!");
      navigate("/list");
    } catch (err) {
      console.error("Error deleting album:", err);
      alert("An error occurred while deleting the album.");
    }
  };

  const pageStyle = {
    backgroundColor: "#111111",
    color: "#fff",
    fontFamily: "sans-serif",
    minHeight: "100vh",
    padding: "20px",
    display: "flex",
    alignItems: "center", // Center items vertically
  };

  const imageContainerStyle = {
    flex: "1",

    marginLeft: "50px",
    display: "flex", // Flex container
    alignItems: "center", // Center content vertically
  };

  const infoContainerStyle = {
    flex: "1",
    textAlign: "center",
    display: "flex", // Flex container
    flexDirection: "column", // Stack content vertically
    alignItems: "center", // Center content horizontally
    justifyContent: "center", // Center content vertically
  };

  const buttonStyle = {
    marginRight: "10px",
    backgroundColor: "red",
    color: "#fff",
    padding: "6px 12px",
    borderRadius: "4px",
    border: "none",
  };

  const listStyle = {
    listStylePosition: "inside",
    padding: 0,
  };

  const closeButtonStyle = {
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "transparent",
    border: "none",
    color: "#fff",
    fontSize: "24px",
    cursor: "pointer",
  };

  return (
    <div style={{ ...pageStyle, position: "relative" }}>
      <button
        style={closeButtonStyle}
        onClick={() => navigate("/list")}
        aria-label="Close"
      >
        ×
      </button>
      <div style={imageContainerStyle}>
        {albumCover && (
          <img
            src={albumCover}
            alt={name}
            style={{ width: "85%", height: "auto", borderRadius: "2px" }}
          />
        )}
      </div>
      <div style={infoContainerStyle}>
        <h1>{name}</h1>
        <h4>{artistNames}</h4>
        <br />
        <p>
          <strong>Album Type:</strong> {album_type}
        </p>
        <h2 style={{ marginTop: "10px" }}>Genres</h2>
        {genres && genres.length > 0 ? (
          <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
            {genres.map((genre) => (
              <li key={genre} style={{ marginLeft: "0" }}>
                {genre}
              </li>
            ))}
          </ul>
        ) : (
          <p>No genres stored for this album.</p>
        )}
        <h2>Tracks</h2>
        {tracksLoading && <p>Loading tracks...</p>}
        {!tracksLoading && tracks.length === 0 && <p>No tracks found.</p>}
        {!tracksLoading && tracks.length > 0 && (
          <div
            style={
              tracks.length > 5
                ? {
                    maxHeight: "150px",
                    overflowY: "scroll",
                    marginBottom: "15px",
                  }
                : {}
            }
          >
            <ol style={listStyle}>
              {tracks.map((track) => (
                <li key={track.id}>{track.name}</li>
              ))}
            </ol>
          </div>
        )}
        <h2>Rating</h2>
        {rating ? (
          <p>
            {Array.from({ length: 5 }, (_, index) =>
              index < rating ? "★" : "☆"
            ).join("")}
          </p>
        ) : (
          <p>No rating yet. Be the first to rate this album.</p>
        )}
        <form onSubmit={handleRatingSubmit} style={{ marginTop: "10px" }}>
          <label>
            Set Rating (1-5):
            <input
              type="number"
              min="1"
              max="5"
              value={newRating}
              onChange={(e) => setNewRating(e.target.value)}
              style={{ marginLeft: "10px", width: "50px" }}
            />
          </label>
          <button type="submit" style={{ marginLeft: "10px" }}>
            Submit Rating
          </button>
        </form>
        <div style={{ marginTop: "20px" }}>
          <button onClick={handleDelete} style={buttonStyle}>
            Delete Album
          </button>
        </div>
      </div>
    </div>
  );
}

export default DetailPage;
