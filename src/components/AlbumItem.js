import React from "react";

function AlbumItem({ album, isAdded, onToggle, rank }) {
  const artistNames =
    album.artists && album.artists.length > 0
      ? album.artists.map((artist) => artist.name).join(", ")
      : "Unknown Artist";

  const heartStyle = {
    cursor: "pointer",
    fontSize: "24px",
    marginLeft: "auto",
    color: isAdded ? "white" : "white",
  };

  const containerStyle = {
    display: "flex",
    alignItems: "center",
    borderBottom: "1px solid #ccc",
    padding: "10px 0",
  };

  const rankStyle = {
    fontWeight: "bold",
    fontSize: "24px",
    width: "50px",
    textAlign: "center",
  };

  const albumInfoStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flex: 1,
    marginLeft: "10px",
  };

  const albumTextStyle = {
    display: "flex",
    flexDirection: "column",
  };

  const albumNameStyle = {
    fontWeight: "bold",
  };

  return (
    <div style={containerStyle}>
      <div style={rankStyle}>{rank}</div>
      {album.images && album.images.length > 0 && (
        <div>
          <img
            src={album.images[0].url}
            alt={album.name}
            width="60"
            height="60"
            style={{ borderRadius: "4px" }}
          />
        </div>
      )}
      <div style={albumInfoStyle}>
        <div style={albumTextStyle}>
          <span style={albumNameStyle}>{album.name}</span>
          <span>{artistNames}</span>
        </div>
        <span style={heartStyle} onClick={onToggle}>
          {isAdded ? "♥" : "♡"}
        </span>
      </div>
    </div>
  );
}

export default AlbumItem;
