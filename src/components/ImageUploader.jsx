import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUploadCloud } from 'react-icons/fi';
import './ImageUploader.css';

const ImageUploader = ({ onImageUpload }) => {
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        onImageUpload(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: false
  });

  return (
    <div
      {...getRootProps()}
      className={`dropzone ${isDragActive ? 'active' : ''}`}
    >
      <input {...getInputProps()} />
      <FiUploadCloud className="upload-icon" />
      {isDragActive ? (
        <p className="upload-text">Drop your image here...</p>
      ) : (
        <div>
          <p className="upload-text">
            Drag & drop an image here, or click to browse
          </p>
          <p className="upload-hint">
            Supports JPG, PNG, GIF, WEBP
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader; 