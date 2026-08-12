import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { Image as ImageIcon, Video, Paintbrush } from 'lucide-react';
import HotspotAdBuilder from './HotspotAdBuilder';

const AD_FORMATS = [
  { id: 'image',  label: 'Image',        icon: ImageIcon,  hint: 'Upload a static image ad' },
  { id: 'video',  label: 'Video',        icon: Video,      hint: 'Customer watches, then gets access' },
  { id: 'design',  label: 'Build a design', icon: Paintbrush, hint: 'Design an ad in the builder' },
];



const isBlankLink = (url) => {
  if (!url) return true;
  const trimmed = url.trim();
  if (!trimmed) return true;
  const bareForms = ['https://wa.me/', 'https://', 'tel:', 'mailto:', 'https://maps.google.com/?q='];
  return bareForms.includes(trimmed);
};

const REWARD_TYPES = [
  { id: 'none',        label: 'No reward — just an ad' },
  { id: 'free_browse', label: 'Grant free browsing time' },
  { id: 'specific',    label: 'Unlock a specific package' },
];

export default function AddAdSettings() {
  const navigate = useNavigate();
  const location = useLocation();
  const adId = new URLSearchParams(location.search).get('id');
  const subdomain = window.location.hostname.split('.')[0];
  const isEditing = !!adId;

  // ── core fields ──────────────────────────────────────────
  const [adTitle, setAdTitle] = useState('');
  const [adFormat, setAdFormat] = useState('image'); // image | video | design
  const [adEnabled, setAdEnabled] = useState(true);
  const [position, setPosition] = useState('bottom-right');
  const [adDuration, setAdDuration] = useState(15);
  const [skipAfter, setSkipAfter] = useState(5);
  const [canSkip, setCanSkip] = useState(true);

  // ── media (image/video) ─────────────────────────────────
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState('');
  const [existingMediaUrl, setExistingMediaUrl] = useState('');

  // ── design (builder) ────────────────────────────────────
  const [designConfig, setDesignConfig] = useState(null);
  const [existingDesignConfig, setExistingDesignConfig] = useState(null);

  // ── reward ──────────────────────────────────────────────
  const [rewardType, setRewardType] = useState('none');
  const [selectedPackage, setSelectedPackage] = useState('');
  const [freeMinutes, setFreeMinutes] = useState('');
  const [packages, setPackages] = useState([]);

  // ── link (for image/design tap-through) ─────────────────
  const [adLink, setAdLink] = useState('');

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch packages for the reward dropdown
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/allow_get_hotspot_packages', {
          headers: { 'X-Subdomain': subdomain },
        });
        if (res.ok) setPackages(await res.json());
      } catch (_) {}
    })();
  }, [subdomain]);

  // Autofill when editing
  useEffect(() => {
    if (!adId) return;
    (async () => {
      try {
        const res = await fetch(`/api/get_ad_settings_by_id?id=${adId}`, {
          headers: { 'X-Subdomain': subdomain },
        });
        const data = await res.json();
        if (!res.ok) {
          toast.error('Failed to load ad settings');
          return;
        }

        setAdTitle(data.ad_title || '');
        setAdFormat(data.media_type === 'video' ? 'video' : (data.media_type === 'custom_design' || (data.design_config && data.design_config !== '[]') ? 'design' : 'image'));
        setAdEnabled(!!data.ad_enabled);
        setPosition(data.position || 'bottom-right');
        setAdDuration(data.ad_duration || 15);
        setSkipAfter(data.skip_after || 5);
        setCanSkip(data.can_skip ?? true);
        // media_url is the actual Cloudinary URL for image/video ads.
        // ad_link is reserved for the tap-through link and is a separate field.
        // setExistingMediaUrl(data.media_url || '');
        // setAdLink(data.ad_link || '');
        setExistingMediaUrl(data.media_url || '');
setAdLink(isBlankLink(data.ad_link) ? '' : data.ad_link);
        setRewardType(data.reward_type || 'none');
        setSelectedPackage(data.selected_package || '');
        setFreeMinutes(data.free_minutes || '');

       if (data.design_config) {
  try {
    const parsed = JSON.parse(data.design_config);
    const cleanLink = isBlankLink(data.ad_link) ? '' : data.ad_link;
    setExistingDesignConfig({
      elements: parsed,
      background: data.design_background,
      canvasW: data.design_canvas_w,
      canvasH: data.design_canvas_h,
      linkType: data.link_type,
      linkValue: cleanLink,
      link: cleanLink, // real "link" key so handleSave never needs to fall back
    });
  } catch (_) {}
}
      } catch (error) {
        toast.error('Network error loading ad');
      } finally {
        setLoading(false);
      }
    })();
  }, [adId, subdomain]);

  const handleMediaChange = (file) => {
    setMediaFile(file);
    setMediaPreview(URL.createObjectURL(file));
  };


    console.log('existin config', existingDesignConfig)


  const validate = () => {
    const errs = {};
    if (!adTitle.trim()) errs.adTitle = 'Ad title is required';

    if (adFormat === 'image' || adFormat === 'video') {
      if (!mediaFile && !existingMediaUrl) errs.media = `Please upload ${adFormat === 'video' ? 'a video' : 'an image'}`;
    }

    if (adFormat === 'design') {
      if (!designConfig && !existingDesignConfig) errs.design = 'Build a design or switch to Image/Video';
    }

    // Reward validation only applies to the reward type the user actually picked —
    // never blanket-required, and never blocking for a plain ad with no reward.
    if (rewardType === 'specific' && !selectedPackage) {
      errs.reward = 'Choose which package this ad unlocks';
    }
    if (rewardType === 'free_browse' && !freeMinutes) {
      errs.reward = 'Enter how many free minutes to grant';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      toast.error('Please fix the highlighted fields');
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('ad_title', adTitle);
      formData.append('ad_format', adFormat);
      formData.append('media_type', adFormat === 'video' ? 'video' : (adFormat === 'design' ? 'custom_design' : 'image'));
      formData.append('ad_enabled', adEnabled);
      formData.append('position', position);
      formData.append('ad_duration', adDuration);
      formData.append('skip_after', skipAfter);
      formData.append('can_skip', canSkip);
      formData.append('reward_type', rewardType);
      formData.append('selected_package', rewardType === 'specific' ? selectedPackage : '');
      formData.append('free_minutes', rewardType === 'free_browse' ? freeMinutes : '');

      if (adFormat === 'design') {
        const cfg = designConfig || existingDesignConfig;
  formData.append('design_config', JSON.stringify(cfg.elements));
  formData.append('design_background', cfg.background);
  formData.append('design_canvas_w', cfg.canvasW);
  formData.append('design_canvas_h', cfg.canvasH);
  formData.append('link_type', cfg.linkType);
  // Design ads only ever use the link chosen inside the builder itself —
  // never fall back to the separate image/video adLink field, and never
  // resubmit a stale prefix-only value.
  const designLink = cfg.link || '';
  formData.append('ad_link', isBlankLink(designLink) ? '' : designLink);
      } else {
        formData.append('ad_link', adLink);
        formData.append('design_config', '');
        if (mediaFile) formData.append('media_file', mediaFile);
      }

      if (isEditing) {
        formData.append('_method', 'patch');
      }

      const url = isEditing ? `/api/ad_settings/${adId}` : '/api/ad_settings';

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'X-Subdomain': subdomain },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(isEditing ? 'Ad updated' : 'Ad created');
        navigate('/admin/hotspot-marketing-dashboard');
      } else {
        toast.error(data.error?.join?.(', ') || data.error || 'Failed to save ad');
      }
    } catch (error) {
      toast.error('Network error while saving ad');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading ad settings…</div>;
  }

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 font-sans">
        <div className="max-w-4xl mx-auto px-4 space-y-6">

          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEditing ? 'Edit Advertisement' : 'New Advertisement'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">One place to configure everything, one button to save it.</p>
          </div>

          {/* Ad title */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Ad Title</label>
            <input
              type="text"
              value={adTitle}
              onChange={e => setAdTitle(e.target.value)}
              className={`w-full p-3 rounded-lg border ${errors.adTitle ? 'border-red-500' : 'border-gray-300'} dark:bg-gray-700 dark:text-white`}
              placeholder="e.g. Westlands Cafe Promo"
            />
            {errors.adTitle && <p className="text-red-500 text-xs mt-1">{errors.adTitle}</p>}
          </div>

          {/* Format selector */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              How do you want to build this ad?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {AD_FORMATS.map(f => {
                const Icon = f.icon;
                const active = adFormat === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setAdFormat(f.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-colors ${
                      active ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-2 ${active ? 'text-blue-600' : 'text-gray-400'}`} />
                    <p className="font-semibold text-gray-900 dark:text-white">{f.label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{f.hint}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Media upload — image/video only */}
          {(adFormat === 'image' || adFormat === 'video') && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 space-y-4">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                {adFormat === 'video' ? 'Upload Video' : 'Upload Image'}
              </label>
              <input
                type="file"
                accept={adFormat === 'video' ? 'video/*' : 'image/*'}
                onChange={e => e.target.files[0] && handleMediaChange(e.target.files[0])}
                className="block w-full text-sm"
              />
              {(mediaPreview || existingMediaUrl) && (
                adFormat === 'video'
                  ? <video src={mediaPreview || existingMediaUrl} controls className="mt-3 w-full max-w-sm rounded-lg" />
                  : <img src={mediaPreview || existingMediaUrl} alt="" className="mt-3 w-full max-w-sm rounded-lg object-cover" />
              )}
              {errors.media && <p className="text-red-500 text-xs">{errors.media}</p>}

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Tap-through Link (optional)</label>
                <input
                  type="text"
                  value={adLink}
                  onChange={e => setAdLink(e.target.value)}
                  placeholder="https://wa.me/254712345678"
                  className="w-full p-3 rounded-lg border border-gray-300 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* Design builder */}
          {adFormat === 'design' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4">
              <HotspotAdBuilder
                initialConfig={existingDesignConfig}
                onChange={setDesignConfig}
              />
              {errors.design && <p className="text-red-500 text-xs mt-2">{errors.design}</p>}
            </div>
          )}

          {/* Reward — optional, independent of format */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 space-y-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Reward (optional)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {REWARD_TYPES.map(r => (
                <button
                  key={r.id}
                  onClick={() => setRewardType(r.id)}
                  className={`p-3 rounded-lg border-2 text-sm text-left ${
                    rewardType === r.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            {rewardType === 'specific' && (
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Package to unlock</label>
                <select
                  value={selectedPackage}
                  onChange={e => setSelectedPackage(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select a package…</option>
                  {packages.map(p => (
                    <option key={p.id} value={p.name}>{p.name} — Ksh {p.price}</option>
                  ))}
                </select>
              </div>
            )}

            {rewardType === 'free_browse' && (
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Free minutes to grant</label>
                <input
                  type="number"
                  value={freeMinutes}
                  onChange={e => setFreeMinutes(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g. 15"
                />
              </div>
            )}

            {errors.reward && <p className="text-red-500 text-xs">{errors.reward}</p>}
          </div>

          {/* Display settings — mainly relevant for video */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 space-y-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Display Settings</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Position on screen</label>
                <select
                  value={position}
                  onChange={e => setPosition(e.target.value)}
                  className="w-full p-2 rounded-lg border border-gray-300 dark:bg-gray-700 dark:text-white"
                >
                   <option value="top-left">Top Left</option>
  <option value="top-right">Top Right</option>
  <option value="bottom-left">Bottom Left</option>
  <option value="bottom-right">Bottom Right</option>
  <option value="center-modal">Center Modal (dimmed background)</option>
  <option value="fullscreen">Full Screen (entire image visible)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Duration (seconds)</label>
                <input type="number" value={adDuration} onChange={e => setAdDuration(e.target.value)}
                  className="w-full p-2 rounded-lg border border-gray-300 dark:bg-gray-700 dark:text-white" />
              </div>
              {adFormat === 'video' && (
                <>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Skip after (seconds)</label>
                    <input type="number" value={skipAfter} onChange={e => setSkipAfter(e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:bg-gray-700 dark:text-white" />
                  </div>
                  <div className="flex items-center gap-2 mt-5">
                    <input type="checkbox" checked={canSkip} onChange={e => setCanSkip(e.target.checked)} />
                    <label className="text-sm text-gray-600 dark:text-gray-400">Allow skipping</label>
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={adEnabled} onChange={e => setAdEnabled(e.target.checked)} />
              <label className="text-sm text-gray-600 dark:text-gray-400">Ad enabled</label>
            </div>
          </div>

          {/* THE one save button */}
          <div className="flex justify-end gap-3">
            <button
              onClick={() => navigate('/admin/hotspot-marketing')}
              className="px-6 py-3 rounded-lg font-semibold text-gray-600 border border-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
            >
              {saving ? 'Saving…' : isEditing ? 'Save Changes' : 'Create Ad'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}