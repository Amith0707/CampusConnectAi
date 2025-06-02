import React, { useState } from "react";
import axios from "axios";
import "./PostForm.css";

const PostMedia = ({ token, clubName }) => {
  const [file, setFile] = useState(null);
  const [mediaType, setMediaType] = useState("image");
  const [message, setMessage] = useState("");

  // File change handler detects type automatically
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Infer mediaType from file type
    if (selectedFile.type.startsWith("video/")) setMediaType("video");
    else if (selectedFile.type.startsWith("image/")) setMediaType("image");
    else {
      setMessage("Unsupported file type");
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setMessage("");
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a file first!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("media", file);
      formData.append("clubName", clubName);
      formData.append("mediaType", mediaType);

      const res = await axios.post("http://localhost:5000/api/club-content/media", formData, {
        headers: {
          Authorization: `Bearer ${token}`
          // "Content-Type": "multipart/form-data",
        },
      });

      setMessage(res.data.message || "Media uploaded successfully!");
      setFile(null);
    } catch (err) {
      console.error(err);
      setMessage("Failed to upload media");
    }
  };

  return (
    <div className="post-form-container">
      <h2 className="post-form-heading">Upload Poster / Reel</h2>
      <form onSubmit={handlePost} className="post-form">
        <input
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
          className="post-form-input"
        />
        {file && (
          <p className="file-name">
            Selected file: <strong>{file.name}</strong> ({mediaType})
          </p>
        )}
        <button type="submit" className="post-form-button">
          Upload
        </button>
        {message && <p className="post-form-message">{message}</p>}
      </form>
    </div>
  );
};

export default PostMedia;
