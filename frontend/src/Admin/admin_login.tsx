'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (username && password) {
      router.push('/admin');
    } else {
      setLoading(false);
      alert('Invalid credentials');
    }
  };

  return (
    <div
      className="
        min-h-screen flex flex-col justify-center items-center
        bg-[var(--bg)] text-[var(--text)]
        font-['El_Messiri',sans-serif] px-4
        transition-colors duration-500 ease-in-out
      "
    >
      {/* Logo Section */}
      <div className="text-center mb-10">
        <Image
          src="/ian-cares-logo.jpeg"
          alt="Ian Cares Foundation Logo"
          width={80}
          height={80}
          className="mx-auto mb-3 rounded-full shadow-md theme-fade"
        />
        <div
          className="
            text-xl font-bold uppercase leading-tight
            text-[var(--accent)] theme-fade
          "
        >
          IAN CARES <br /> FOUNDATION
        </div>
      </div>

      {/* Login Card */}
      <div
        className="w-full max-w-sm p-8 rounded-xl shadow-lg bg-[var(--card)] border border-[var(--border)] theme-fade"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-[var(--text)]">
          Admin Portal Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-[var(--text)] mb-2"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin@iancaress.org"
              required
              className="w-full p-3 rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--text)] placeholder-[var(--subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all duration-300"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[var(--text)] mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin123!"
              required
              className="
                w-full p-3 rounded-lg border
                border-[var(--border)] bg-[var(--card)]
                text-[var(--text)] placeholder-[var(--subtle)]
                focus:outline-none focus:ring-2 focus:ring-[var(--accent)]
                transition-all duration-300
              "
            />
          </div>

          <button
  type="submit"
  disabled={loading}
  style={{
    backgroundColor: 'var(--button-bg)',
    color: 'var(--button-text)',
  }}
  className="
    w-full py-3 font-bold rounded-lg shadow-md
    hover:brightness-110 active:scale-95
    transition-all duration-300 disabled:opacity-50
  "
>
  {loading ? 'Loading...' : 'LOGIN'}
</button>



        </form>

        {/* Footer Links */}
        <div className="flex justify-between mt-6 text-sm">
          <a
            href="#"
            className="text-[var(--accent)] hover:underline transition-colors"
          >
            Forgot Password?
          </a>
          <a
            href="#"
            className="text-[var(--accent)] hover:underline transition-colors"
          >
            Create Account
          </a>
        </div>
      </div>
    </div>
  );
}
