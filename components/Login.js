import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Auth({ onAuthSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert(error.message);
    } else {
      onAuthSuccess();
    }
  };

  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      alert(error.message);
    } else {
      alert('Signup successful! Please log in.');
      setIsSignup(false); // Switch back to Login after signup
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-200">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm">
        <div className="flex justify-between mb-6">
          <button
            onClick={() => setIsSignup(false)}
            className={`p-2 w-1/2 text-center font-semibold text-lg ${
              !isSignup ? 'border-b-4 border-blue-500 text-blue-600' : 'text-gray-500'
            } transition duration-300`}
          >
            Login
          </button>
          <button
            onClick={() => setIsSignup(true)}
            className={`p-2 w-1/2 text-center font-semibold text-lg ${
              isSignup ? 'border-b-4 border-blue-500 text-blue-600' : 'text-gray-500'
            } transition duration-300`}
          >
            Signup
          </button>
        </div>

        {isSignup ? (
          <div>
            <h1 className="text-xl font-bold mb-6">Signup</h1>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSignup}
              className="bg-green-500 text-white w-full py-2 rounded-lg hover:bg-green-600 transition duration-300"
            >
              Signup
            </button>
          </div>
        ) : (
          <div>
            <h1 className="text-xl font-bold mb-6">Login</h1>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleLogin}
              className="bg-blue-500 text-white w-full py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
