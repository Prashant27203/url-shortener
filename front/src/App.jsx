import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [qrcodeImg, setQrcodeImg] = useState("");

  const handleSubmit = () => {
    axios
      .post("http://localhost:3000/api/short", {
        OriginalUrl: originalUrl,
      })
      .then((res) => {
        console.log("API Response: " + res.data.shortId);
        setShortUrl(res.data.shortId);
        setQrcodeImg(res.data.qrcodeImg);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>URL Shortener</h1>
      <input
        type="text"
        value={originalUrl}
        onChange={(e) => setOriginalUrl(e.target.value)}
        placeholder="Enter your URL"
        style={styles.input}
      />
      <button onClick={handleSubmit} style={styles.button}>
        Submit
      </button>
      {shortUrl && (
        <div style={styles.resultContainer}>
          <p style={styles.result}>
            Shortened URL:{" "}
            <a
              href={`http://localhost:3000/${shortUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.link}
            >
              http://shorturl:/{shortUrl}
            </a>
          </p>
          <img src={qrcodeImg} alt="QR Code" style={styles.qrCode} />
        </div>
      )}
    </div>
  );
};

// CSS styles
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f0f0f0",
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    boxSizing: "border-box",
  },
  title: {
    fontSize: "36px",
    color: "#333",
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    maxWidth: "400px",
    padding: "12px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    marginBottom: "10px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },
  button: {
    padding: "12px 25px",
    fontSize: "16px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginBottom: "20px",
    transition: "background-color 0.3s",
  },
  buttonHover: {
    backgroundColor: "#0056b3",
  },
  resultContainer: {
    textAlign: "center",
    marginTop: "20px",
  },
  result: {
    fontSize: "20px",
    color: "#007bff",
    marginBottom: "10px",
  },
  link: {
    color: "#007bff",
    textDecoration: "none",
    fontWeight: "bold",
  },
  qrCode: {
    marginTop: "10px",
    width: "150px", // Adjust the size of the QR code
    height: "150px", // Adjust the size of the QR code
  },
};

export default App;
