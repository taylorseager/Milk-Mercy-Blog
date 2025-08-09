/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Login() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      if (user) {
        setCurrentUser(JSON.parse(user));
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const body = isLogin
        ? { username, password }
        : { username, email, password };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user info in localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        // Redirect to previous page or home
        const returnUrl = router.query.returnUrl || '/';
        router.push(returnUrl);
      } else {
        setError(data.error || 'An error occurred');
      }
    } catch (err) {
      setError('Failed to connect to server');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
    router.push('/');
  };

  if (currentUser) {
    return (
      <>
        <Head>
          <title>Account - Milk & Mercy</title>
        </Head>

        <div className="account-container">
          <div className="account-box">
            <h1>My Account</h1>
            <p className="welcome">Welcome, {currentUser.username}!</p>
            <p className="email">{currentUser.email}</p>
            <button type="button" onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>

        <style jsx>{`
          .account-container {
            min-height: 60vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 40px 20px;
          }

          .account-box {
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 400px;
            text-align: center;
          }

          h1 {
            color: var(--primary-color);
            margin-bottom: 30px;
          }

          .welcome {
            font-size: 18px;
            margin-bottom: 10px;
          }

          .email {
            color: var(--text-light);
            margin-bottom: 30px;
          }

          .logout-button {
            background-color: #dc3545;
            color: white;
            border: none;
            padding: 12px 30px;
            font-size: 16px;
            font-weight: 600;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.2s;
          }

          .logout-button:hover {
            background-color: #c82333;
          }
        `}
        </style>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{isLogin ? 'Login' : 'Register'} - Milk & Mercy</title>
      </Head>

      <div className="login-container">
        <div className="login-box">
          <h1>{isLogin ? 'Login' : 'Create Account'}</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="input"
              required
            />
            {!isLogin && (
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="input"
                required
              />
            )}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="input"
              required
            />
            {error && <p className="error">{error}</p>}
            <button type="submit" className="submit-button">
              {isLogin ? 'Login' : 'Register'}
            </button>
          </form>
          <p className="toggle">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="toggle-button"
            >
              {isLogin ? 'Register' : 'Login'}
            </button>
          </p>
        </div>
      </div>

      <style jsx>{`
        .login-container {
          min-height: 60vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px 20px;
        }

        .login-box {
          background: white;
          padding: 40px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 400px;
        }

        h1 {
          color: var(--primary-color);
          margin-bottom: 30px;
          text-align: center;
        }

        .input {
          width: 100%;
          padding: 12px 16px;
          font-size: 16px;
          border: 2px solid #e1e4e8;
          border-radius: 4px;
          margin-bottom: 15px;
        }

        .input:focus {
          outline: none;
          border-color: var(--link-color);
        }

        .error {
          color: #dc3545;
          margin: 10px 0;
          font-size: 14px;
        }

        .submit-button {
          width: 100%;
          background-color: var(--primary-color);
          color: white;
          border: none;
          padding: 12px;
          font-size: 16px;
          font-weight: 600;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .submit-button:hover {
          opacity: 0.9;
        }

        .toggle {
          text-align: center;
          margin-top: 20px;
          color: var(--text-light);
        }

        .toggle-button {
          background: none;
          border: none;
          color: var(--link-color);
          cursor: pointer;
          text-decoration: underline;
        }

        .toggle-button:hover {
          opacity: 0.8;
        }
      `}
      </style>
    </>
  );
}
