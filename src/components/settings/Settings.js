import { useState } from 'react';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useAuth } from '../../contexts/AuthContext';

function Settings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    autoApproveExperts: false,
    minCoinsForAuction: 100,
    maxTransactionLimit: 10000,
    maintenanceMode: false,
    systemTheme: 'light'
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      const settingsRef = doc(db, 'settings', 'admin');
      await updateDoc(settingsRef, settings);
      setMessage({ type: 'success', text: 'Settings updated successfully!' });
    } catch (error) {
      console.error('Error updating settings:', error);
      setMessage({ type: 'error', text: 'Error updating settings' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-container">
      <h1>Admin Settings</h1>

      {message.text && (
        <div className={`alert ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="settings-grid">
        <div className="settings-section">
          <h2>Notification Settings</h2>
          <div className="setting-item">
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => handleChange('emailNotifications', e.target.checked)}
              />
              <span className="slider"></span>
            </label>
            <span>Email Notifications</span>
          </div>
        </div>

        <div className="settings-section">
          <h2>User Management</h2>
          <div className="setting-item">
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.autoApproveExperts}
                onChange={(e) => handleChange('autoApproveExperts', e.target.checked)}
              />
              <span className="slider"></span>
            </label>
            <span>Auto-approve Expert Applications</span>
          </div>
        </div>

        <div className="settings-section">
          <h2>Transaction Limits</h2>
          <div className="setting-item">
            <label>Minimum Coins for Auction</label>
            <input
              type="number"
              value={settings.minCoinsForAuction}
              onChange={(e) => handleChange('minCoinsForAuction', parseInt(e.target.value))}
              className="number-input"
            />
          </div>
          <div className="setting-item">
            <label>Maximum Transaction Limit</label>
            <input
              type="number"
              value={settings.maxTransactionLimit}
              onChange={(e) => handleChange('maxTransactionLimit', parseInt(e.target.value))}
              className="number-input"
            />
          </div>
        </div>

        <div className="settings-section">
          <h2>System Settings</h2>
          <div className="setting-item">
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
              />
              <span className="slider"></span>
            </label>
            <span>Maintenance Mode</span>
          </div>
          <div className="setting-item">
            <label>System Theme</label>
            <select
              value={settings.systemTheme}
              onChange={(e) => handleChange('systemTheme', e.target.value)}
              className="select-input"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>
        </div>
      </div>

      <div className="settings-actions">
        <button
          onClick={saveSettings}
          disabled={loading}
          className="save-settings-btn"
        >
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}

export default Settings; 