import React, { useState } from 'react';
import { HfInference } from '@huggingface/inference';
import { FiDownload } from 'react-icons/fi';
import ImageUploader from './components/ImageUploader';
import './App.css';

const hf = new HfInference(import.meta.env.VITE_HUGGINGFACE_API_KEY);

function App() {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateDescription = async (imageData) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!import.meta.env.VITE_HUGGINGFACE_API_KEY) {
        throw new Error('Missing Hugging Face API key');
      }

      const base64Response = await fetch(imageData);
      const blob = await base64Response.blob();

      const result = await hf.imageToText({
        model: 'Salesforce/blip-image-captioning-large',
        data: blob,
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_HUGGINGFACE_API_KEY}`
        }
      });

      if (!result.generated_text) {
        throw new Error('No description generated');
      }

      setDescription(result.generated_text);
    } catch (err) {
      console.error('API Error:', err);
      if (err.message.includes('401')) {
        setError('Authentication failed. Please check your API key.');
      } else {
        setError('Error generating description. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (imageData) => {
    setImage(imageData);
    generateDescription(imageData);
  };

  return (
    <div className="app-container">
      <div className="content-container">
        <div className="header">
          <h1>Image Description Generator #Innov AI KARE OSS</h1>
          <p>Upload an image and get an AI-generated description using advanced machine learning</p>
          <a 
            href="https://expo.dev/accounts/tirumalareddysai/projects/image-description-generator/builds/58424fa7-10dc-48cf-b9f2-fac575c2a0ea"
            target="_blank"
            rel="noopener noreferrer"
            className="download-button"
          >
            <FiDownload className="download-icon" />
            Download Android App
          </a>
        </div>

        <div className="upload-container">
          <ImageUploader onImageUpload={handleImageUpload} />
        </div>

        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Analyzing image...</p>
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {(image || description) && (
          <div className="results-grid">
            {image && (
              <div className="result-card">
                <h2>Uploaded Image</h2>
                <div className="image-container">
                  <img src={image} alt="Uploaded preview" />
                </div>
              </div>
            )}

            {description && !loading && (
              <div className="result-card">
                <h2>Generated Description</h2>
                <div className="description-container">
                  <p className="description-text">{description}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
