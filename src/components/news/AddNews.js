import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebaseConfig';

function AddNews() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5242880) { // 5MB
        setError('Image size should be less than 5MB');
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !image) {
      setError('Title and image are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Upload image to Firebase Storage
      const imageRef = ref(storage, `news/${Date.now()}_${image.name}`);
      await uploadBytes(imageRef, image);
      const imageUrl = await getDownloadURL(imageRef);

      // Add news to Firestore
      const newsRef = collection(db, 'news');
      await addDoc(newsRef, {
        title,
        description,
        imageUrl,
        createdAt: new Date(),
        status: 'active'
      });

      // Reset form
      setTitle('');
      setDescription('');
      setImage(null);
      setPreview('');
      alert('News added successfully!');
    } catch (error) {
      console.error('Error adding news:', error);
      setError('Error adding news. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-news-container">
      <h1>Add News</h1>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="news-form">
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter news title"
            maxLength={100}
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter news description"
            rows={4}
          />
        </div>

        <div className="form-group">
          <label>Image</label>
          <div className="image-upload-container">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
              id="news-image"
            />
            <label htmlFor="news-image" className="file-label">
              {image ? 'Change Image' : 'Choose Image'}
            </label>
          </div>
          {preview && (
            <div className="image-preview">
              <img src={preview} alt="Preview" />
            </div>
          )}
        </div>

        <button 
          type="submit" 
          className="submit-btn"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add News'}
        </button>
      </form>
    </div>
  );
}

export default AddNews; 