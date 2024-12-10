import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import appLogo from '../../app-logo-3.png'


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Check if user is admin
      const adminDoc = await getDoc(doc(db, 'admins', userCredential.user.uid));
      
      if (adminDoc.exists()) {
        navigate('/dashboard');
      } else {
        await auth.signOut();
        setError('Unauthorized access. Admin privileges required.');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <img src={appLogo} alt="AgroBoost Logo" className="login-logo" />
        </div>
        <div className="login-right">
          <form onSubmit={handleLogin} className="login-form">
            <h2>Login as a Admin User</h2>
            {error && <div className="error-message">{error}</div>}
            <div className="form-group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="login-input"
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                required
                className="login-input"
              />
            </div>
            <button 
              type="submit" 
              className="login-btn"
              disabled={loading}
            >
              {loading ? (
                <div className="loader">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              ) : (
                'LOGIN'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login; 