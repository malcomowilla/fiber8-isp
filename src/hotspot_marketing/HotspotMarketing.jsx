import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Edit, Trash2, Eye, EyeOff, Calendar, BarChart3, TrendingUp, Smartphone, MousePointerClick } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import MaterialTable from 'material-table';
import {
  Delete,
  Visibility,
  VisibilityOff,
  BarChart,
  CalendarToday,
  Add,
  Star,
  LocalOffer,
} from '@mui/icons-material';
import { CiSettings } from 'react-icons/ci';
import DeleteHotspotAd from '../delete/DeleteHotspotAd';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import DefaultSystemAdsManager from "./DefaultSystemAds"

function SkeletonBlock({ h = 'h-8', w = 'w-full', rounded = 'rounded-lg' }) {
  return <div className={`skeleton ${h} ${w} ${rounded}`} />;
}

const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');
    .dash-root { font-family: 'Plus Jakarta Sans', sans-serif; }
    @keyframes shimmer { 0% { background-position: -400px 0; } 100% { background-position: 400px 0; } }
    @keyframes countUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
    @keyframes gradientShift { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
    .skeleton { background: linear-gradient(90deg, #2984D1 25%, #075F5A 50%, #1A7595 75%); background-size: 400px 100%; animation: shimmer 1.4s infinite; }
    .stat-num { animation: countUp 0.5s ease forwards; }
    .card-hover { transition: transform .2s, box-shadow .2s; }
    .card-hover:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(0,0,0,.12); }
    .scrollbar-thin::-webkit-scrollbar { width: 4px; }
    .scrollbar-thin::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
    .g-stat-card {
      background: #fff; border-radius: 16px; padding: 20px 22px; border: 1px solid #eef0f2;
      box-shadow: 0 1px 2px rgba(16,24,40,0.04);
    }
    .dark .g-stat-card { background: #1f2430; border-color: #2a303c; }
    .g-badge { font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 999px; }
    .g-badge.up { background: #e6f4ea; color: #1e7e34; }
    .g-badge.paused { background: #fff4e5; color: #b26a00; }
    .g-badge.active { background: #e6f4ea; color: #1e7e34; }
  `}</style>
);

// Google-Ads-style stat card: label, big number, icon chip, optional sub-line.
function StatCard({ label, value, icon, loading, sub, accent = '#1a73e8' }) {
  return (
    <div className="g-stat-card card-hover">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{label}</p>
          {loading ? (
            <div className="mt-2"><SkeletonBlock h="h-8" w="w-16" /></div>
          ) : (
            <p className="stat-num text-3xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          )}
          {sub && !loading && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{sub}</p>}
        </div>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${accent}1A`, color: accent }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

const HotspotMarketing = () => {
  const navigate = useNavigate();
  const [numberOfAds, setNumberOfAds] = useState(0);

  const [ads, setAds] = useState([]);
  const [openDeleteHotspotAdd, setOpenDeleteHotspotAdd] = useState(false);
  const [adId, setAdId] = useState(0);
  const [loading, setLoading] = useState(true);

  const [adStats, setAdStats] = useState({}); // { [adId]: { impressions, clicks, completed_views, views, ctr, engaged_devices } }
  const [trend, setTrend] = useState([]); // [{ date, clicks, completed_views }] last 30 days
  const [trendLoading, setTrendLoading] = useState(true);



  const [activeTab, setActiveTab] = useState('custom'); // 'custom' | 'default'
  const handleCloseDeleteHotspotAdd = () => setOpenDeleteHotspotAdd(false);

  const subdomain = window.location.hostname.split('.')[0];

  const getAdStats = useCallback(async () => {
    try {
      const response = await fetch('/api/ad_stats', { headers: { 'X-Subdomain': subdomain } });
      const data = await response.json();
      if (response.ok) {
        const byId = {};
        data.forEach((s) => {
          byId[s.ad_id] = s;
        });
        setAdStats(byId);
      }
    } catch (_) {}
  }, []);

  useEffect(() => {
    getAdStats();
  }, [getAdStats]);

  const getEngagementTrend = useCallback(async () => {
    try {
      const response = await fetch('/api/ad_engagement_trend', { headers: { 'X-Subdomain': subdomain } });
      const data = await response.json();
      if (response.ok) setTrend(data);
    } catch (_) {
    } finally {
      setTrendLoading(false);
    }
  }, []);

  useEffect(() => {
    getEngagementTrend();
  }, [getEngagementTrend]);

  function useIsDarkMode() {
    const [isDark, setIsDark] = useState(
      () => typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
    );
    useEffect(() => {
      const root = document.documentElement;
      const update = () => setIsDark(root.classList.contains('dark'));
      update();
      const observer = new MutationObserver(update);
      observer.observe(root, { attributes: true, attributeFilter: ['class'] });
      return () => observer.disconnect();
    }, []);
    return isDark;
  }

  const isDark = useIsDarkMode();

  const tableTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDark ? 'dark' : 'light',
          background: { paper: isDark ? '#1e1e1e' : '#ffffff', default: isDark ? '#1e1e1e' : '#ffffff' },
          text: { primary: isDark ? '#f1f1f1' : '#1a1a1a', secondary: isDark ? '#a3a3a3' : '#6b7280' },
        },
      }),
    [isDark]
  );

  const getNumberOfAds = useCallback(async () => {
    try {
      const response = await fetch('/api/number_of_ads', { headers: { 'X-Subdomain': subdomain } });
      const newData = await response.json();
      if (response.ok) {
        setNumberOfAds(newData);
      } else {
        if (response.status === 401) {
          toast.error(newData.error, { position: 'top-center', autoClose: 5000 });
          setTimeout(() => {
            window.location.href = '/signin';
          }, 1900);
        }
      }
    } catch (error) {
      toast.error('Internal server error while getting number of ads', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }, []);

  useEffect(() => {
    getNumberOfAds();
  }, [getNumberOfAds]);

  const getAdd = useCallback(async () => {
    try {
      const response = await fetch('/api/ad_settings', { headers: { 'X-Subdomain': subdomain } });
      const newData = await response.json();
      if (response.ok) {
        setAds(newData);
      } else {
        if (response.status === 401) {
          toast.error(newData.error, { position: 'top-center', autoClose: 5000 });
          setTimeout(() => {
            window.location.href = '/signin';
          }, 1900);
        }
      }
    } catch (error) {}
  }, []);

  useEffect(() => {
    getAdd();
  }, [getAdd]);

  const [totalClicks, setTotalClicks] = useState(0);
  const [totalImpressions, setTotalImpressions] = useState(0);

  const getTotalImpressions = useCallback(async () => {
    try {
      const response = await fetch('/api/total_ad_impressions', { headers: { 'X-Subdomain': subdomain } });
      const newData = await response.json();
      if (response.ok) {
        setTotalImpressions(newData);
        setLoading(false);
      }
    } catch (error) {}
  }, []);

  useEffect(() => {
    getTotalImpressions();
  }, [getTotalImpressions]);

  const getTotalClicks = useCallback(async () => {
    try {
      const response = await fetch('/api/total_ad_clicks', { headers: { 'X-Subdomain': subdomain } });
      const newData = await response.json();
      if (response.ok) {
        setTotalClicks(newData);
        setLoading(false);
      }
    } catch (error) {}
  }, []);

  useEffect(() => {
    getTotalClicks();
  }, [getTotalClicks]);

  const deleteAd = async () => {
    try {
      const response = await fetch(`/api/ad_settings/${adId}`, {
        headers: { 'X-Subdomain': subdomain },
        method: 'DELETE',
      });
      if (response.ok) {
        setOpenDeleteHotspotAdd(false);
        toast.success('Ad deleted successfully', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setAds(ads.filter((ad) => ad.id !== adId));
      } else {
        toast.error('Failed to delete ad', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      toast.error('error while deleting ad, please try again', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  // ── Aggregate totals across all ads, derived from per-ad stats ──────────
  const aggregate = useMemo(() => {
    const values = Object.values(adStats);
    const impressions = values.reduce((sum, s) => sum + (s.impressions || 0), 0);
    const clicks = values.reduce((sum, s) => sum + (s.clicks || 0), 0);
    const views = values.reduce((sum, s) => sum + (s.views || 0), 0);
    const engagedDevices = values.reduce((sum, s) => sum + (s.engaged_devices || 0), 0);
    const ctr = impressions > 0 ? ((clicks / impressions) * 100).toFixed(1) : '0.0';
    return { impressions, clicks, views, engagedDevices, ctr };
  }, [adStats]);

  // Top ads by impressions, for the "clicks vs completed views" bar chart.
  const engagementByAd = useMemo(() => {
    return ads
      .map((ad) => {
        const s = adStats[ad.id] || { clicks: 0, completed_views: 0, impressions: 0 };
        return {
          name: (ad.ad_title || 'Untitled').length > 14 ? `${ad.ad_title.slice(0, 14)}…` : ad.ad_title || 'Untitled',
          clicks: s.clicks || 0,
          completed_views: s.completed_views || 0,
          impressions: s.impressions || 0,
        };
      })
      .sort((a, b) => b.impressions - a.impressions)
      .slice(0, 8);
  }, [ads, adStats]);

  // Rough reach estimate for the "Latest submissions" panel — impressions
  // rounded down to the nearest hundred with a "+" the way ad platforms
  // show estimated reach before enough data has accumulated.
  const reachLabel = (adIdVal) => {
    const impressions = adStats[adIdVal]?.impressions || 0;
    if (impressions === 0) return 'Reach not yet available';
    const rounded = Math.max(100, Math.floor(impressions / 100) * 100);
    return `Reach ${rounded}+ People`;
  };

  const latestSubmissions = useMemo(() => {
    return [...ads]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 2);
  }, [ads]);

  const columns = [
    {
      title: <p className="text-black font-semibold">Ad Title</p>,
      field: 'ad_title',
      headerStyle: { fontWeight: 'bold', backgroundColor: '#f8fafc' },
      render: (rowData) => (
        <div className="flex items-center space-x-3">
          {rowData.image_url && (
            <img src={rowData?.image_url} alt={rowData?.title} className="w-10 h-10 rounded-lg object-cover" />
          )}
          <div>
            <p className="font-semibold text-gray-900">{rowData?.ad_title}</p>
          </div>
        </div>
      ),
    },
    {
      title: <p className="text-black font-semibold">Status</p>,
      field: 'ad_enabled',
      headerStyle: { fontWeight: 'bold', backgroundColor: '#f8fafc' },
      render: (rowData) => (
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            rowData.ad_enabled === true ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {rowData.ad_enabled === true ? 'Active' : 'Paused'}
        </span>
      ),
    },
    {
      title: <p className="text-black font-semibold">Performance</p>,
      field: 'performance',
      headerStyle: { fontWeight: 'bold', backgroundColor: '#f8fafc' },
      render: (rowData) => {
        const s = adStats[rowData.id] || { impressions: 0, views: 0, clicks: 0, ctr: 0 };
        return (
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <BarChart className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-900">{s.impressions} impressions</span>
            </div>
            <div className="text-xs text-gray-500">
              {s.views} views · {s.clicks} clicks · {s.ctr}% CTR
            </div>
          </div>
        );
      },
    },
    {
      title: <p className="text-black font-semibold">Engaged Devices</p>,
      field: 'engaged_devices',
      headerStyle: { fontWeight: 'bold', backgroundColor: '#f8fafc' },
      render: (rowData) => {
        const s = adStats[rowData.id] || { engaged_devices: 0 };
        return (
          <div className="flex items-center space-x-2">
            <Smartphone className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-900">{s.engaged_devices}</span>
          </div>
        );
      },
    },
    {
      title: <p className="text-black font-semibold">Created</p>,
      field: 'created_at',
      headerStyle: { fontWeight: 'bold', backgroundColor: '#f8fafc' },
      render: (rowData) => (
        <div className="flex items-center space-x-2">
          <CalendarToday className="w-4 h-4 text-gray-700" />
          <span className="text-sm text-gray-600">{rowData.created_at}</span>
        </div>
      ),
    },
    {
      title: <p className="text-black font-semibold">Actions</p>,
      field: 'actions',
      headerStyle: { fontWeight: 'bold', backgroundColor: '#f8fafc' },
      render: (rowData) => (
        <div className="flex space-x-1">
          <button
            onClick={(e) => e.stopPropagation()}
            className="p-2 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Edit
              onClick={() => {
                navigate(
                  `/admin/add-settings?id=${rowData.id} &ad_enabled=${rowData.ad_enabled} &ad_title=${rowData.ad_title} &position=${rowData.position} &media_type=${rowData.media_type} &reward_type=${rowData.reward_type} &free_minutes=${rowData.free_minutes} &selected_package=${rowData.selected_package} &ad_link=${rowData.ad_link}  &skip_after=${rowData.skip_after} &can_skip=${rowData.can_skip} &ad_duration=${rowData.ad_duration}`
                );
              }}
              className="w-4 h-4"
            />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setAdId(rowData.id);
              setOpenDeleteHotspotAdd(true);
            }}
            className="p-2 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <Delete className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Styles />
      <ToastContainer />
      <DeleteHotspotAd
        handleCloseDeleteHotspotAdd={handleCloseDeleteHotspotAdd}
        openDeleteHotspotAdd={openDeleteHotspotAdd}
        deleteHotspotAdd={deleteAd}
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 font-sans">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Ad Management</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage your WiFi hotspot advertisements</p>
            </div>
            <button
              onClick={() => navigate('/admin/add-settings')}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2"
            >
              <CiSettings className="w-5 h-5" />
              <span>Ad Settings</span>
            </button>
          </div>


{/* Tab switcher */}
<div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
  <button
    onClick={() => setActiveTab('custom')}
    className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
      activeTab === 'custom'
        ? 'border-blue-600 text-blue-600'
        : 'border-transparent text-gray-500 hover:text-gray-700'
    }`}
  >
    Custom Ads
  </button>
  <button
    onClick={() => setActiveTab('default')}
    className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
      activeTab === 'default'
        ? 'border-blue-600 text-blue-600'
        : 'border-transparent text-gray-500 hover:text-gray-700'
    }`}
  >
    Default Ad Library
  </button>
</div>

{activeTab === 'default' && <DefaultSystemAdsManager />}




          {/* ── Overview stat cards: Impressions, Views, CTR, Engaged Devices ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              label="Impressions"
              value={aggregate.impressions.toLocaleString()}
              icon={<Eye className="w-5 h-5" />}
              loading={loading}
              sub="Times an ad was shown"
              accent="#1a73e8"
            />
            <StatCard
              label="Views (engaged)"
              value={aggregate.views.toLocaleString()}
              icon={<TrendingUp className="w-5 h-5" />}
              loading={loading}
              sub="Watched, clicked, or dwelled"
              accent="#188038"
            />
            <StatCard
              label="CTR"
              value={`${aggregate.ctr}%`}
              icon={<MousePointerClick className="w-5 h-5" />}
              loading={loading}
              sub={`${aggregate.clicks.toLocaleString()} clicks ÷ impressions`}
              accent="#e37400"
            />
            <StatCard
              label="Engaged Devices"
              value={aggregate.engagedDevices.toLocaleString()}
              icon={<Smartphone className="w-5 h-5" />}
              loading={loading}
              sub="Distinct devices that engaged"
              accent="#8430ce"
            />
          </div>

          {/* ── Charts: Engagement (clicks vs completed views) + 30-day trend ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
            <div className="g-stat-card">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                Engagement · clicks vs completed views
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Per ad, top 8 by impressions</p>
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer>
                  <ReBarChart data={engagementByAd} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#2a303c' : '#eef0f2'} />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={50} />
                    <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="clicks" name="Clicks" fill="#1a73e8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="completed_views" name="Completed views" fill="#188038" radius={[4, 4, 0, 0]} />
                  </ReBarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="g-stat-card">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">Engagement · last 30 days</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Clicks and completed views across all ads</p>
              <div style={{ width: '100%', height: 260 }}>
                {trendLoading ? (
                  <SkeletonBlock h="h-full" />
                ) : (
                  <ResponsiveContainer>
                    <AreaChart data={trend} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                      <defs>
                        <linearGradient id="clicksGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1a73e8" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#1a73e8" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#188038" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#188038" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#2a303c' : '#eef0f2'} />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 10 }}
                        tickFormatter={(d) => d.slice(5)}
                        interval={4}
                      />
                      <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Area type="monotone" dataKey="clicks" name="Clicks" stroke="#1a73e8" fill="url(#clicksGrad)" strokeWidth={2} />
                      <Area
                        type="monotone"
                        dataKey="completed_views"
                        name="Completed views"
                        stroke="#188038"
                        fill="url(#viewsGrad)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>

          {/* ── Pipeline / latest submissions, Meta-Ads-Manager style ── */}
          <div className="g-stat-card mb-8">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">Latest submissions</p>
              <span className="text-xs text-gray-400">{numberOfAds} total ads</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {latestSubmissions.length === 0 && (
                <p className="text-sm text-gray-500 col-span-2">No ads submitted yet.</p>
              )}
              {latestSubmissions.map((ad) => (
                <div
                  key={ad.id}
                  className="rounded-xl border border-gray-100 dark:border-gray-700 p-4 flex flex-col gap-2 cursor-pointer hover:border-gray-300 dark:hover:border-gray-500 transition-colors"
                  onClick={() =>
                    navigate(
                      `/admin/add-settings?id=${ad.id} &ad_enabled=${ad.ad_enabled} &ad_title=${ad.ad_title}`
                    )
                  }
                >
                  <div className="flex items-start justify-between">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">
                      {ad.ad_title || 'Untitled ad'}
                    </p>
                    <span className={`g-badge ${ad.ad_enabled ? 'active' : 'paused'}`}>
                      {ad.ad_enabled ? 'active' : 'paused'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{ad.created_at}</p>
                  {ad.ad_link && (
                    <p className="text-xs text-gray-600 dark:text-gray-300 truncate">{ad.ad_link}</p>
                  )}
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <Eye className="w-3.5 h-3.5" />
                    {reachLabel(ad.id)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <ThemeProvider theme={tableTheme}>
            {/* Material Table */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
              <MaterialTable
                title={<p className="text-2xl font-bold">Active Advertisements</p>}
                columns={columns}
                data={ads}
                options={{
                  sorting: true,
                  pageSizeOptions: [2, 5, 10, 20],
                  pageSize: 20,
                  paginationPosition: 'bottom',
                  exportButton: true,
                  exportAllData: true,
                  selection: true,
                  search: false,
                  searchAutoFocus: true,
                  showSelectAllCheckbox: false,
                  showTextRowsSelected: false,
                  emptyRowsWhenPaging: false,
                  actionsColumnIndex: -1,
                  headerStyle: {
                    fontFamily: 'monospace',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                    fontSize: '12px',
                    backgroundColor: isDark ? '#2a2a2a' : '#f4f1ea',
                    color: isDark ? '#f1f1f1' : '#1a1a1a',
                    borderBottom: isDark ? '2px solid #3a3a3a' : '2px solid #e5e0d5',
                  },
                  rowStyle: (rowData, index) => ({
                    backgroundColor: isDark
                      ? index % 2 === 0
                        ? '#1e1e1e'
                        : '#262626'
                      : index % 2 === 0
                      ? '#ffffff'
                      : '#fafaf7',
                    color: isDark ? '#f1f1f1' : '#1a1a1a',
                    fontFamily: 'monospace',
                  }),
                }}
                localization={{
                  body: {
                    emptyDataSourceMessage: (
                      <p className="font-sans">No ads found. Create your first ad to get started!</p>
                    ),
                  },
                }}
                actions={[
                  {
                    icon: () => <Add className="text-white" />,
                    tooltip: 'Add New Ad',
                    isFreeAction: true,
                    onClick: () => navigate('/admin/add-settings'),
                  },
                ]}
              />
            </div>
          </ThemeProvider>
        </div>
      </div>
    </>
  );
};

export default HotspotMarketing;