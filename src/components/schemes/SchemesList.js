import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

function SchemesList() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const schemesCollection = collection(db, 'schemes');
        const snapshot = await getDocs(schemesCollection);
        const schemesList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setSchemes(schemesList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching schemes:", error);
        setLoading(false);
      }
    };

    fetchSchemes();
  }, []);

  return (
    <div className="schemes-container">
      <h1>Schemes List</h1>
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="schemes-grid">
          {schemes.map((scheme) => (
            <div key={scheme.id} className="scheme-card">
              <h2>{scheme.Title}</h2>
              <p>{scheme.Description}</p>
              <div className="scheme-details">
                {scheme.TableData && scheme.TableData.map((item, index) => (
                  <div key={index} className="condition-item">
                    <strong>{item.Condition}:</strong>
                    <p>{item.Description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SchemesList; 