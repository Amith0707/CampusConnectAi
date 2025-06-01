import React, { useState } from 'react';
import axios from 'axios';
import './PostForm.css'; // assume your styles are in this CSS file

const PostAnnouncement = ({ token, clubName }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');

  const handlePost = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        '/api/club-content/announcement',
        { title, content, clubName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message);
      setTitle('');
      setContent('');
    } catch (err) {
      console.error(err);
      setMessage('Failed to post announcement');
    }
  };

  return (
    <div className="post-form-container">
      <h2 className="post-form-heading">Post Announcement</h2>
      <form onSubmit={handlePost} className="post-form">
        <input
          type="text"
          placeholder="Title"
          className="post-form-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Content"
          className="post-form-textarea"
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit" className="post-form-button">
          Submit
        </button>
        {message && <p className="post-form-message">{message}</p>}
      </form>
    </div>
  );
};

export default PostAnnouncement;
