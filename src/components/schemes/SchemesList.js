import { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

function SchemesList() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingScheme, setEditingScheme] = useState(null);
  const [editForm, setEditForm] = useState({
    Title: '',
    Description: '',
    TableData: []
  });

  useEffect(() => {
    fetchSchemes();
  }, []);

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

  const handleDelete = async (schemeId) => {
    if (window.confirm('Are you sure you want to delete this scheme?')) {
      try {
        await deleteDoc(doc(db, 'schemes', schemeId));
        setSchemes(schemes.filter(scheme => scheme.id !== schemeId));
        alert('Scheme deleted successfully!');
      } catch (error) {
        console.error("Error deleting scheme:", error);
        alert('Error deleting scheme: ' + error.message);
      }
    }
  };

  const handleEdit = (scheme) => {
    setEditingScheme(scheme.id);
    setEditForm({
      Title: scheme.Title,
      Description: scheme.Description,
      TableData: [...scheme.TableData]
    });
  };

  const handleUpdate = async (schemeId) => {
    try {
      const schemeRef = doc(db, 'schemes', schemeId);
      await updateDoc(schemeRef, {
        Title: editForm.Title,
        Description: editForm.Description,
        TableData: editForm.TableData,
        updatedAt: new Date()
      });

      setSchemes(schemes.map(scheme => 
        scheme.id === schemeId 
          ? { ...scheme, ...editForm, updatedAt: new Date() }
          : scheme
      ));

      setEditingScheme(null);
      alert('Scheme updated successfully!');
    } catch (error) {
      console.error("Error updating scheme:", error);
      alert('Error updating scheme: ' + error.message);
    }
  };

  const handleConditionChange = (index, field, value) => {
    const newTableData = [...editForm.TableData];
    newTableData[index] = {
      ...newTableData[index],
      [field]: value
    };
    setEditForm({ ...editForm, TableData: newTableData });
  };

  const addCondition = () => {
    setEditForm({
      ...editForm,
      TableData: [...editForm.TableData, { Condition: '', Description: '' }]
    });
  };

  const removeCondition = (index) => {
    const newTableData = editForm.TableData.filter((_, i) => i !== index);
    setEditForm({ ...editForm, TableData: newTableData });
  };

  return (
    <div className="schemes-container">
      <h1>Schemes List</h1>
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="schemes-grid">
          {schemes.map((scheme) => (
            <div key={scheme.id} className="scheme-card">
              {editingScheme === scheme.id ? (
                // Edit Form
                <div className="edit-form">
                  <input
                    type="text"
                    value={editForm.Title}
                    onChange={(e) => setEditForm({ ...editForm, Title: e.target.value })}
                    className="edit-input"
                  />
                  <textarea
                    value={editForm.Description}
                    onChange={(e) => setEditForm({ ...editForm, Description: e.target.value })}
                    className="edit-textarea"
                  />
                  <div className="edit-conditions">
                    {editForm.TableData.map((condition, index) => (
                      <div key={index} className="edit-condition">
                        <input
                          type="text"
                          value={condition.Condition}
                          onChange={(e) => handleConditionChange(index, 'Condition', e.target.value)}
                          placeholder="Condition"
                        />
                        <textarea
                          value={condition.Description}
                          onChange={(e) => handleConditionChange(index, 'Description', e.target.value)}
                          placeholder="Description"
                        />
                        <button 
                          type="button" 
                          onClick={() => removeCondition(index)}
                          className="remove-condition-btn"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button type="button" onClick={addCondition} className="add-condition-btn">
                      + Add Condition
                    </button>
                  </div>
                  <div className="edit-actions">
                    <button onClick={() => handleUpdate(scheme.id)} className="save-btn">
                      Save
                    </button>
                    <button onClick={() => setEditingScheme(null)} className="cancel-btn">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // Display Mode
                <>
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
                  <div className="card-actions">
                    <button onClick={() => handleEdit(scheme)} className="edit-btn">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(scheme.id)} className="delete-btn">
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SchemesList; 