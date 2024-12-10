import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

function UploadSchemes() {
  const uploadScrapedData = async () => {
    try {
      const schemesCollection = collection(db, 'schemes');
      const scrapedData = require('../../scraped_data.json');
      
      for (const scheme of scrapedData) {
        await addDoc(schemesCollection, {
          ...scheme,
          createdAt: new Date()
        });
      }
      
      alert('Data uploaded successfully!');
      window.location.reload();
    } catch (error) {
      console.error("Error uploading data:", error);
      alert('Error uploading data: ' + error.message);
    }
  };

  return (
    <div className="upload-schemes-container">
      <h1>Upload Schemes Data</h1>
      <button onClick={uploadScrapedData} className="upload-btn">
        Upload JSON Data
      </button>
    </div>
  );
}

export default UploadSchemes; 