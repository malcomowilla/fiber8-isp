import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import toast, { Toaster } from 'react-hot-toast';

const EMPTY_FORM = {
  name: '',
  email: '',
  phone_number: '',
  password: '',
  password_confirmation: '',
};

const OutsideReferrerAuth = () => {
  const [mode, setMode] = useState('sign_in'); // 'sign_in' | 'sign_up'
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = mode === 'sign_up' ? '/api/outside_referrers/sign_up' : '/api/outside_referrers/sign_in';
      const body =
        mode === 'sign_up'
          ? form
          : { email: form.email, phone_number: form.phone_number, password: form.password };

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });
      const data = await response.json();

      if (response.ok) {
        toast.success(mode === 'sign_up' ? 'Account created!' : 'Welcome back!');
        setTimeout(() => navigate('/referrer-dashboard'), 800);
      } else {
        const message =
          typeof data.errors === 'object'
            ? Object.values(data.errors).flat().join(', ')
            : data.error || 'Something went wrong';
        toast.error(message);
      }
    } catch (error) {
      toast.error('Network error, please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 font-sans px-4">
      <Toaster />
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-1">
            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
              <PersonAddAlt1Icon fontSize="small" />
            </span>
            <div>
              <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {mode === 'sign_up' ? 'Become a referrer' : 'Referrer sign in'}
              </h1>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Earn KSh 300 per ISP you refer that converts
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
            {mode === 'sign_up' && (
              <input
                type="text"
                name="name"
                placeholder="Full name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg
                  focus:ring-emerald-500 focus:border-emerald-500 p-2.5
                  dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              />
            )}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg
                focus:ring-emerald-500 focus:border-emerald-500 p-2.5
                dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            />
            <input
              type="text"
              name="phone_number"
              placeholder="Phone number (M-Pesa)"
              value={form.phone_number}
              onChange={handleChange}
              required
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg
                focus:ring-emerald-500 focus:border-emerald-500 p-2.5
                dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg
                focus:ring-emerald-500 focus:border-emerald-500 p-2.5
                dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            />
            {mode === 'sign_up' && (
              <input
                type="password"
                name="password_confirmation"
                placeholder="Confirm password"
                value={form.password_confirmation}
                onChange={handleChange}
                required
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg
                  focus:ring-emerald-500 focus:border-emerald-500 p-2.5
                  dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              />
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-600
                disabled:opacity-60 text-white text-sm font-medium px-4 py-2.5 transition-colors"
            >
              {loading && <CircularProgress size={14} sx={{ color: 'white' }} />}
              {mode === 'sign_up' ? 'Create referrer account' : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-5">
            {mode === 'sign_up' ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => setMode(mode === 'sign_up' ? 'sign_in' : 'sign_up')}
              className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline"
            >
              {mode === 'sign_up' ? 'Sign in' : 'Sign up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OutsideReferrerAuth;