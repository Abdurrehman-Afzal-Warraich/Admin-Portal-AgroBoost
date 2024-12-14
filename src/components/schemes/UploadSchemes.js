import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

function UploadSchemes() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/json") {
      setSelectedFile(file);
      setError('');
    } else {
      setError('Please select a valid JSON file');
      setSelectedFile(null);
    }
  };

  const uploadData = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const schemes = JSON.parse(e.target.result);
          const schemesCollection = collection(db, 'schemes');
          
          // Upload each scheme to Firestore
          for (const scheme of schemes) {
            await addDoc(schemesCollection, {
              ...scheme,
              createdAt: new Date()
            });
          }
          
          setSelectedFile(null);
          alert('Schemes uploaded successfully!');
          // Reset the file input
          const fileInput = document.getElementById('file-input');
          if (fileInput) fileInput.value = '';
        } catch (parseError) {
          setError('Invalid JSON format. Please check your file.');
        }
      };

      reader.onerror = () => {
        setError('Error reading file');
      };

      reader.readAsText(selectedFile);
    } catch (error) {
      console.error("Error uploading schemes:", error);
      setError('Error uploading schemes: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-schemes-container">
      <h1 className="upload-title">Upload Schemes</h1>
      
      <div className="upload-section">
        <div className="file-upload-wrapper">
          <input
            type="file"
            id="file-input"
            accept=".json"
            onChange={handleFileSelect}
            className="file-input"
          />
          <label htmlFor="file-input" className="file-label">
            {selectedFile ? selectedFile.name : 'Choose JSON file'}
          </label>
        </div>

        {error && <div className="upload-error">{error}</div>}
        
        <button 
          onClick={uploadData} 
          className="upload-btn"
          disabled={!selectedFile || loading}
        >
          {loading ? 'Uploading...' : 'Upload Schemes'}
        </button>
      </div>

      <div className="upload-instructions">
        <h3>Instructions:</h3>
        <ul>
          <li>Select a JSON file containing scheme data</li>
          <li>File must be in valid JSON format</li>
          <li>Each scheme should have Title, Description, and TableData fields</li>
          <li>Maximum file size: 5MB</li>
        </ul>
      </div>
    </div>
  );
}

export default UploadSchemes; 