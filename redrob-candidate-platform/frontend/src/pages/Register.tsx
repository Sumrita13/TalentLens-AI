import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { BarChart3 } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'candidate' | 'recruiter'>('recruiter');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/auth/register`, { name, email, password, role });
      login(response.data.token, response.data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to register');
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center p-6 lg:p-10">
      <div className="w-full max-w-6xl h-auto min-h-[75vh] flex flex-col lg:flex-row rounded-3xl overflow-hidden shadow-2xl shadow-pink-900/20 border border-white/5 bg-[#0a0815]">
        
        {/* Left Form Side */}
        <div className="w-full lg:w-1/2 p-10 md:p-16 flex flex-col justify-center relative z-10 overflow-y-auto">
          <Link to="/" className="flex items-center gap-3 mb-10 group w-fit">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <BarChart3 className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-black tracking-tighter text-white">
              TalentLens <span className="text-pink-500">AI</span>
            </span>
          </Link>

          <div>
            <h2 className="text-4xl font-black text-white mb-2 tracking-tight">Create Account</h2>
            <p className="text-purple-200/60 font-medium mb-8">Join the next generation of AI hiring.</p>
            
            {error && <div className="p-4 mb-6 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-sm font-medium">{error}</div>}
            
            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Full Name</label>
                <input 
                  type="text" 
                  className="w-full bg-[#151320] border border-white/5 text-white rounded-xl px-5 py-3 focus:outline-none focus:border-pink-500/50 transition-all placeholder-slate-600 font-medium"
                  placeholder="e.g. Alex Chen"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Email Address</label>
                <input 
                  type="email" 
                  className="w-full bg-[#151320] border border-white/5 text-white rounded-xl px-5 py-3 focus:outline-none focus:border-pink-500/50 transition-all placeholder-slate-600 font-medium"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Password</label>
                <input 
                  type="password" 
                  className="w-full bg-[#151320] border border-white/5 text-white rounded-xl px-5 py-3 focus:outline-none focus:border-pink-500/50 transition-all placeholder-slate-600 font-medium"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {/* Role selector removed - defaults to recruiter */}
              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-pink-600 to-indigo-600 text-white py-4 mt-2 rounded-xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] transition-transform shadow-lg shadow-pink-600/20"
              >
                Create Account
              </button>
            </form>
            
            <p className="mt-8 text-center text-slate-400 text-sm font-medium">
              Already have an account? <Link to="/login" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">Sign in</Link>
            </p>
          </div>
        </div>

        {/* Right Visual Side */}
        <div className="hidden lg:flex w-1/2 relative bg-[#151320] items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-pink-600/20 mix-blend-overlay z-0" />
          <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/30 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-pink-600/30 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 max-w-md p-10 backdrop-blur-sm bg-white/5 border border-white/10 rounded-3xl text-center">
            <div className="w-20 h-20 bg-indigo-500/20 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-indigo-500/20 border border-indigo-500/30">
              <BarChart3 className="w-10 h-10 text-indigo-400" />
            </div>
            <h3 className="text-2xl font-black text-white mb-4 leading-tight">Join 100,000+ candidates and 500+ top tier tech companies.</h3>
            <p className="text-purple-200/60 font-medium">Your next big opportunity or your next perfect hire is just a few clicks away.</p>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Register;
