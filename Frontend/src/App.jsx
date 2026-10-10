import { useState } from 'react';

import Login from './pages/login';
import Register from './pages/register';
import Dashboard from './pages/dashboard';

function App() {
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    setUser(null);
  };

  return (
    <>
      {user ? (
        <Dashboard
          user={user}
          onLogout={handleLogout}
        />
      ) : showRegister ? (
        <Register
          onLoginClick={() => setShowRegister(false)}
        />
      ) : (
        <Login
          onLoginSuccess={handleLoginSuccess}
          onRegisterClick={() => setShowRegister(true)}
        />
      )}
    </>
  );
}

export default App;