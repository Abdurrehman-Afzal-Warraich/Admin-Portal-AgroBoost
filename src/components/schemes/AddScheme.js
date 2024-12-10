import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

function AddScheme() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [conditions, setConditions] = useState([{ Condition: '', Description: '' }]);

  const handleAddCondition = () => {
    setConditions([...conditions, { Condition: '', Description: '' }]);
  };

  const handleDeleteCondition = (indexToDelete) => {
    if (conditions.length > 1) {
      setConditions(conditions.filter((_, index) => index !== indexToDelete));
    }
  };

  const handleConditionChange = (index, field, value) => {
    const newConditions = [...conditions];
    newConditions[index][field] = value;
    setConditions(newConditions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const schemesCollection = collection(db, 'schemes');
      await addDoc(schemesCollection, {
        Title: title,
        Description: description,
        TableData: conditions,
        createdAt: new Date()
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      setConditions([{ Condition: '', Description: '' }]);
      alert('Scheme added successfully!');
    } catch (error) {
      console.error("Error adding scheme:", error);
      alert('Error adding scheme: ' + error.message);
    }
  };

  return (
    <div className="add-scheme-container">
      <h1>Add New Scheme</h1>
      <form onSubmit={handleSubmit} className="scheme-form">
        <div className="form-group">
          <label>Scheme Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter scheme title"
            required
          />
        </div>

        <div className="form-group">
          <label>Scheme Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter scheme description"
            required
          />
        </div>

        <div className="conditions-section">
          <h3>Scheme Conditions</h3>
          {conditions.map((condition, index) => (
            <div key={index} className="condition-inputs">
              {conditions.length > 1 && (
                <button
                  type="button"
                  className="delete-condition-btn"
                  onClick={() => handleDeleteCondition(index)}
                >
                  Remove
                </button>
              )}
              <div>
                <label>Condition Title:</label>
                <input
                  type="text"
                  placeholder="Enter condition title"
                  value={condition.Condition}
                  onChange={(e) => handleConditionChange(index, 'Condition', e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Condition Description:</label>
                <textarea
                  placeholder="Enter condition description"
                  value={condition.Description}
                  onChange={(e) => handleConditionChange(index, 'Description', e.target.value)}
                  required
                />
              </div>
            </div>
          ))}
          <button type="button" onClick={handleAddCondition} className="add-condition-btn">
            + Add Another Condition
          </button>
        </div>

        <button type="submit" className="submit-btn">Add Scheme</button>
      </form>
    </div>
  );
}

export default AddScheme; 