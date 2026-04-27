import React, { useState } from 'react';

export default function Login({ onLoginSuccess }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Login failed');
      }

      const data = await res.json();
      // Save token to localStorage
      localStorage.setItem('authToken', data.token);
      onLoginSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-background-tertiary)',
    }}>
      <div style={{
        background: 'var(--color-background-primary)',
        border: '0.5px solid var(--color-border-tertiary)',
        borderRadius: '12px',
        padding: '32px',
        maxWidth: '360px',
        width: '100%',
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: 500, marginBottom: '8px', textAlign: 'center' }}>
          ✨ Magic Tales
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', textAlign: 'center', marginBottom: '24px' }}>
          Enter the password to access
        </p>

        <form onSubmit={handleLogin}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px 14px',
              border: '0.5px solid var(--color-border-secondary)',
              borderRadius: '8px',
              fontSize: '15px',
              fontFamily: 'var(--font-sans)',
              marginBottom: error ? '12px' : '16px',
              boxSizing: 'border-box',
            }}
          />

          {error && (
            <div style={{
              color: '#e24b4a',
              fontSize: '13px',
              marginBottom: '16px',
              padding: '10px 12px',
              background: 'rgba(226, 75, 74, 0.1)',
              borderRadius: '6px',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '10px 20px',
              background: '#26215C',
              color: '#EEEDFE',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              fontFamily: 'var(--font-sans)',
            }}
          >
            {isLoading ? 'Logging in...' : 'Enter'}
          </button>
        </form>
      </div>
    </div>
  );
}
