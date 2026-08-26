import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { KeyRound, User, Lock, Loader2, ShieldCheck, Eye, EyeOff, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { loginSuccess } from '../redux/authSlice';
import { resetAdminCredentialsApi } from '../services/api';

const AdminReset = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [resetKey, setResetKey] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setError(null);

    if (!resetKey.trim() || !newUsername.trim() || !newPassword.trim()) {
      setError('All fields are required.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    try {
      const data = await resetAdminCredentialsApi(resetKey, newUsername, newPassword);
      if (data.success && data.token) {
        setSuccess(true);
        // Auto-login with the new credentials
        setTimeout(() => {
          dispatch(loginSuccess({ token: data.token, username: data.username }));
          navigate('/admin');
        }, 2000);
      } else {
        throw new Error(data.error || 'Reset failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Reset failed. Please check your reset key and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center min-h-[85vh] py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Icon */}
        <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center rounded-2xl mx-auto mb-4 shadow-lg shadow-amber-200">
          <KeyRound className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-center font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Reset Admin Credentials
        </h2>
        <p className="mt-2 text-center text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
          Your existing bookings and service data will <strong>not</strong> be affected. Only your login credentials will be updated.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 border border-slate-200/80 rounded-3xl shadow-xl shadow-slate-100/80 space-y-5">

          {/* Success State */}
          {success ? (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <div className="w-16 h-16 bg-emerald-100 flex items-center justify-center rounded-full">
                <CheckCircle2 className="h-9 w-9 text-emerald-500" />
              </div>
              <div>
                <p className="font-black text-slate-800 text-lg">Credentials Reset!</p>
                <p className="text-slate-500 text-sm mt-1">Logging you in with your new credentials…</p>
              </div>
              <div className="w-8 h-1 bg-emerald-200 rounded-full animate-pulse" />
            </div>
          ) : (
            <>
              {/* Info Banner */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 items-start">
                <ShieldCheck className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-amber-800 text-xs">Reset Key Required</p>
                  <p className="text-amber-700 text-xs mt-0.5 leading-relaxed">
                    Enter the <strong>ADMIN_RESET_KEY</strong> from your server <code className="bg-amber-100 px-1 rounded">.env</code> file to authorize this reset.
                  </p>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold p-4 rounded-xl text-center">
                  ⚠️ {error}
                </div>
              )}

              <form onSubmit={handleReset} className="space-y-4">

                {/* Reset Key */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Reset Key (from .env)
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={resetKey}
                      onChange={(e) => setResetKey(e.target.value)}
                      placeholder="Enter your ADMIN_RESET_KEY"
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-800 focus:outline-none focus:bg-white focus:border-amber-400 transition-all"
                    />
                    <KeyRound className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  </div>
                </div>

                {/* New Username */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    New Username / Email
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      placeholder="e.g. admin@saraichur.com"
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-800 focus:outline-none focus:bg-white focus:border-primary transition-all"
                    />
                    <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  </div>
                </div>

                {/* New Password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-10 text-sm text-slate-800 focus:outline-none focus:bg-white focus:border-primary transition-all"
                    />
                    <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none cursor-pointer"
                      aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-10 text-sm text-slate-800 focus:outline-none focus:bg-white focus:border-primary transition-all"
                    />
                    <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none cursor-pointer"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {/* Password match indicator */}
                  {confirmPassword && (
                    <p className={`text-[10px] font-semibold mt-0.5 ${newPassword === confirmPassword ? 'text-emerald-600' : 'text-red-500'}`}>
                      {newPassword === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm font-extrabold h-12 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Resetting credentials…</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="h-4 w-4" />
                      <span>Reset Admin Credentials</span>
                    </>
                  )}
                </button>

                {/* Back to login */}
                <div className="border-t border-slate-100 pt-4 mt-2">
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="w-full bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-800 text-xs font-bold h-10 rounded-xl flex items-center justify-center gap-2 border border-slate-200 transition-all cursor-pointer"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to Login
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

        {/* Help note */}
        <p className="text-center text-[11px] text-slate-400 mt-4 px-4 leading-relaxed">
          The Reset Key is stored in your server's <code className="bg-slate-100 text-slate-600 px-1 rounded">.env</code> file as <code className="bg-slate-100 text-slate-600 px-1 rounded">ADMIN_RESET_KEY</code>. Only the site owner has access to this.
        </p>
      </div>
    </div>
  );
};

export default AdminReset;
