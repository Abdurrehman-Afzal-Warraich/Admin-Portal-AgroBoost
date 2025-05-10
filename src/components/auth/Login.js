import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';
import { useNavigate, useLocation } from 'react-router-dom';
import appLogo from '../../app-logo-3.png';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Check if user is admin
      const adminDoc = await getDoc(doc(db, 'admins', userCredential.user.uid));
      
      if (adminDoc.exists()) {
        // Navigate to the attempted page or dashboard
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      } else {
        await auth.signOut();
        setError('Unauthorized access. Admin privileges required.');
      }
    } catch (error) {


      if (error.code === 'auth/user-not-found') {
        setError('User not found');
      } else if (error.code === 'auth/wrong-password') {
        setError('Incorrect password');
      } else if (error.code === 'auth/too-many-requests') {
        setError('Too many requests. Please try again later.');
      }
      else if (error.code === 'auth/invalid-credential') {
        setError('Invalid credentials');
        
      }

      console.error('Login error:', error);

      
      
      
      
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
            <h2>Login as a Admin</h2>
            {error && <div className="error-message">{error}</div>}
            <div className="form-group">
              <div className="input-with-icon">
                <EnvelopeIcon className="input-icon" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  className="login-input"
                />
              </div>
            </div>
            <div className="form-group">
              <div className="input-with-icon">
                <LockClosedIcon className="input-icon" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="login-input"
                />
              </div>
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