'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AuthForm() {
  const [mode, setMode] = useState<'login'|'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ username?: string; password?: string; general?: string }>({});
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    // Front-end validation
    const newErrors: typeof errors = {};
    if (!username.trim()) newErrors.username = 'Username is required';
    if (!password.trim()) newErrors.password = 'Password is required';
    if (mode === 'register' && password && password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json().catch(()=>({ error: 'Request failed' }));

      if (res.ok) {
        router.push('/dashboard');
      } else {
        // Map server-side errors
        if (data.error?.toLowerCase().includes('username')) newErrors.username = data.error;
        else if (data.error?.toLowerCase().includes('password')) newErrors.password = data.error;
        else newErrors.general = data.error || 'Request failed';
        setErrors(newErrors);
      }
    } catch (err) {
      setErrors({ general: 'Request failed' });
    }
  }

  return (
    <div>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <h2 style={{ margin: 0 }}>Welcome</h2>
        <div className="tabbar">
          <button className={mode==='login'?'active':''} onClick={()=>{setMode('login'); setErrors({});}}>Login</button>
          <button className={mode==='register'?'active':''} onClick={()=>{setMode('register'); setErrors({});}}>Register</button>
        </div>
      </div>
      <p style={{ color: 'var(--muted)', marginTop: -6 }}>
        {mode==='login' ? 'Log in to manage your to‑dos.' : 'Create an account to manage your to‑dos.'}
      </p>

      <form onSubmit={submit} className="list" style={{ marginTop: 16 }}>
        <div>
          <div className="label">Username</div>
          <input
            className={`input ${errors.username ? 'input-error' : ''}`}
            value={username}
            onChange={e => { setUsername(e.target.value); if(errors.username) setErrors({...errors, username: undefined}); }}
            placeholder="yourname"
          />
          {errors.username && <div style={{ color: 'var(--danger)', fontSize: 14 }}>{errors.username}</div>}
        </div>

        <div>
          <div className="label">Password</div>
          <input
            type="password"
            className={`input ${errors.password ? 'input-error' : ''}`}
            value={password}
            onChange={e => { setPassword(e.target.value); if(errors.password) setErrors({...errors, password: undefined}); }}
            placeholder="••••••••"
          />
          {errors.password && <div style={{ color: 'var(--danger)', fontSize: 14 }}>{errors.password}</div>}
        </div>

        {errors.general && <div style={{ color: 'var(--danger)', fontSize: 14 }}>{errors.general}</div>}

        <div className="row">
          <button className="btn" type="submit">
            {mode==='login' ? 'Login' : 'Create Account'}
          </button>
        </div>
      </form>
    </div>
  );
}
