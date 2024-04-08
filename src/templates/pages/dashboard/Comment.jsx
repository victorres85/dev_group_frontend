import React, { useState } from 'react';

const CommentPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = () => {
    if (selectedFile) {
      // Here you would typically handle the file upload, e.g. using fetch or axios to send the file to a server.
      console.log(selectedFile);
    }
  };

  return (
    <div>
      <h1>Comment Page</h1>

      {/* Display comment image */}
      <img src="/path/to/comment/image.jpg" alt="Comment" />

      {/* File upload */}
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Upload</button>
    </div>
  );
};

export default CommentPage;