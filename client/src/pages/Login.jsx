import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Loader2, ShieldAlert, Eye, EyeOff } from 'lucide-react';
import { loginStart, loginSuccess, loginFailure, selectAuth } from '../redux/authSlice';
import { loginAdminApi, checkAdminStatusApi } from '../services/api';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, loading, error } = useSelector(selectAuth);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [hasAdmin, setHasAdmin] = useState(null); // null means checking/loading

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Check if admin is registered on mount
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const data = await checkAdminStatusApi();
        setHasAdmin(data.hasAdmin);
      } catch (err) {
        console.error('Failed to verify admin account status:', err);
        setHasAdmin(true); // Default fallback
      }
    };
    checkStatus();
  }, []);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    dispatch(loginStart());
    try {
      const data = await loginAdminApi(username, password);
      if (data.success && data.token) {
        dispatch(loginSuccess({ token: data.token, username: data.username }));
        navigate('/');
      } else {
        throw new Error(data.error || 'Invalid credentials');
      }
    } catch (err) {
      console.error(err);
      dispatch(loginFailure(err.message || 'Login failed. Please verify credentials.'));
    }
  };

  return (
    <div className="flex flex-col justify-center min-h-[70vh] py-12 sm:px-6 lg:px-8 bg-slate-50/50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="w-16 h-16 bg-primary-light flex items-center justify-center rounded-full mx-auto mb-4 border border-primary/20 animate-pulse">
          <Lock className="h-7 w-7 text-primary" />
        </div>
        <h2 className="text-center font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {hasAdmin === false ? 'Create Admin Account' : 'Admin Portal Login'}
        </h2>
        <p className="mt-1.5 text-center text-xs text-slate-500">
          {hasAdmin === false 
            ? 'Set up your master credentials to manage customer bookings & enquiries.' 
            : 'Enter credentials to manage customer bookings & enquiries.'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 border border-slate-200/80 rounded-3xl shadow-xl shadow-slate-100 space-y-6">
          
          {/* Welcome Alert for First Time Setup */}
          {hasAdmin === false && (
            <div className="bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-100 text-slate-700 text-xs p-4 rounded-2xl flex flex-col gap-1.5 shadow-sm">
              <span className="font-bold text-sky-850 text-xs sm:text-sm flex items-center gap-1.5">
                ✨ First-Time Portal Setup
              </span>
              <span>
                No administrator account has been set up yet. Enter any username (email) and password below to immediately register and initialize the portal.
              </span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold p-4 rounded-xl text-center">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {hasAdmin === false ? 'Set Username / Email' : 'Username'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={hasAdmin === false ? "e.g. client@gmail.com" : "admin"}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-800 focus:outline-none focus:bg-white focus:border-primary transition-all"
                />
                <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {hasAdmin === false ? 'Set Password' : 'Password'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-10 text-sm text-slate-800 focus:outline-none focus:bg-white focus:border-primary transition-all"
                />
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || hasAdmin === null}
              className="w-full bg-primary hover:bg-primary-hover text-white text-sm font-extrabold h-12 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-primary/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{hasAdmin === false ? 'Setting up...' : 'Logging in...'}</span>
                </>
              ) : (
                <span>{hasAdmin === false ? 'Initialize Admin Dashboard' : 'Access Dashboard'}</span>
              )}
            </button>

            <div className="border-t border-slate-100 pt-4 mt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => navigate('/admin-reset')}
                className="w-full text-xs font-semibold text-amber-600 hover:text-amber-700 h-8 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                🔑 Forgot credentials? Reset them securely
              </button>
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem('userRole');
                  navigate('/');
                }}
                className="w-full bg-slate-50 hover:bg-slate-100 text-slate-650 hover:text-slate-800 text-xs font-bold h-10 rounded-xl flex items-center justify-center gap-2 border border-slate-200 transition-all cursor-pointer"
              >
                Logout / Change Role
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
