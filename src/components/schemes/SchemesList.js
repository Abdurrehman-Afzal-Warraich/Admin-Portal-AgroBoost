import { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc, writeBatch, query } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

function SchemesList() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingScheme, setEditingScheme] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    Title: '',
    Description: '',
    TableData: []
  });
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleDeleteAll = async () => {
    if (window.confirm('Are you sure you want to delete ALL schemes? This action cannot be undone!')) {
      setDeleteLoading(true);
      try {
        const batch = writeBatch(db);
        const schemesRef = collection(db, 'schemes');
        const snapshot = await getDocs(query(schemesRef));
        
        snapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });

        await batch.commit();
        setSchemes([]);
        alert('All schemes deleted successfully!');
      } catch (error) {
        console.error("Error deleting all schemes:", error);
        alert('Error deleting schemes: ' + error.message);
      } finally {
        setDeleteLoading(false);
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

  const filteredSchemes = schemes.filter(scheme => 
    scheme.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scheme.Description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scheme.TableData.some(item => 
      item.Condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.Description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="schemes-container">
      <div className="schemes-header">
        <div className="header-left">
          <h1>Schemes List</h1>
          <div className="schemes-count">
            Total Schemes: <span>{filteredSchemes.length}</span>
          </div>
        </div>
        <div className="schemes-actions">
          <div className="schemes-search">
            <input 
              type="search" 
              placeholder="Search schemes..." 
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={handleDeleteAll} 
            className="delete-all-btn"
            disabled={deleteLoading || schemes.length === 0}
          >
            {deleteLoading ? 'Deleting...' : 'Delete All Schemes'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : schemes.length === 0 ? (
        <div className="no-schemes">No schemes found</div>
      ) : (
        <div className="schemes-table">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Conditions</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSchemes.map((scheme) => (
                <tr key={scheme.id} className="scheme-row">
                  {editingScheme === scheme.id ? (
                    // Edit Mode
                    <>
                      <td>
                        <input
                          type="text"
                          value={editForm.Title}
                          onChange={(e) => setEditForm({ ...editForm, Title: e.target.value })}
                          className="edit-input"
                        />
                      </td>
                      <td>
                        <textarea
                          value={editForm.Description}
                          onChange={(e) => setEditForm({ ...editForm, Description: e.target.value })}
                          className="edit-textarea"
                        />
                      </td>
                      <td>
                        <div className="conditions-list">
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
                          <button 
                            type="button" 
                            onClick={addCondition}
                            className="add-condition-btn"
                          >
                            + Add Condition
                          </button>
                        </div>
                      </td>
                      <td className="action-buttons">
                        <button onClick={() => handleUpdate(scheme.id)} className="save-btn">
                          Save
                        </button>
                        <button onClick={() => setEditingScheme(null)} className="cancel-btn">
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    // View Mode
                    <>
                      <td>{scheme.Title}</td>
                      <td>{scheme.Description}</td>
                      <td>
                        <div className="conditions-list">
                          {scheme.TableData?.map((item, index) => (
                            <div key={index} className="condition-item">
                              <strong>{item.Condition}</strong>
                              <p>{item.Description}</p>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="action-buttons">
                        <button onClick={() => handleEdit(scheme)} className="edit-btn">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(scheme.id)} className="delete-btn">
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default SchemesList; 