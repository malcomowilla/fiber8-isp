import React, { useState, useCallback, useEffect, lazy } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check, Sparkles, Eye } from 'lucide-react';
import ModalImage from './ModalImage';
import toast, { Toaster } from 'react-hot-toast';
import { useApplicationSettings } from '../settings/ApplicationSettings';
const SettingsNotification = lazy(() => import('../notification/SettingsNotification'));
import Backdrop from '../backdrop/Backdrop';

const HotspotTemplates = () => {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [imagetitle, setImagetitle] = useState(null);

  const { templateStates, setTemplateStates } = useApplicationSettings();
  const [open, setOpen] = useState(false);
  const [openNotifactionSettings, setOpenSettings] = useState(false);
  const [isloading, setisloading] = useState(false);

  const handleImageClick = (image, title) => {
    setPreviewImage(image);
    setIsModalOpen(true);
    setImagetitle(title);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseNotifaction = () => {
    setOpenSettings(false);
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    navigate('/hotspot-page', { state: { template } });
  };

  const handleCheckboxChange = (event) => {
    const { checked, value } = event.target;
    setTemplateStates(event.target.checked);

    if (value === 'default_template' && checked) {
      setTemplateStates({
        ...templateStates,
        sleek: false,
        sleekspot: false,
        default_template: true,
        attractive: false,
        flat: false,
        minimal: false,
        simple: false,
        clean: false,
        pepea: false,
        premium: false,
      });
    } else if (value === 'sleekspot' && checked) {
      setTemplateStates({
        ...templateStates,
        attractive: false,
        sleekspot: true,
        default_template: false,
        flat: false,
        minimal: false,
        simple: false,
        clean: false,
        pepea: false,
        premium: false,
      });
    } else if (value === 'attractive' && checked) {
      setTemplateStates({
        ...templateStates,
        sleekspot: false,
        default_template: false,
        attractive: true,
        flat: false,
        minimal: false,
        simple: false,
        clean: false,
        pepea: false,
        premium: false,
      });
    } else if (value === 'pepea' && checked) {
      setTemplateStates({
        ...templateStates,
        sleekspot: false,
        pepea: true,
        default_template: false,
        attractive: false,
        flat: false,
        minimal: false,
        simple: false,
        clean: false,
        premium: false,
      });
    } else if (value === 'premium' && checked) {
      setTemplateStates({
        ...templateStates,
        sleekspot: false,
        pepea: false,
        default_template: false,
        attractive: false,
        flat: false,
        minimal: false,
        simple: false,
        clean: false,
        premium: true,
      });
    }
  };

  const imageTemplates = [
    { id: 1, name: 'default_template', image: null, tag: 'Classic' },
    { id: 2, name: 'sleekspot', image: '/images/template_image/sleek.png', tag: 'Modern' },
    { id: 3, name: 'attractive', image: '/images/template_image/Attractive.png', tag: 'Bold' },
    { id: 8, name: 'pepea', image: '/images/template_image/pepea.png', tag: 'Playful' },
    { id: 9, name: 'flat', image: '/images/template_image/flat.png', tag: 'Minimal' },
    { id: 4, name: 'premium', image: '/images/template_image/premium.png', tag: 'Premium' },
    { id: 5, name: 'minimal', image: '/images/template_image/minimal.png', tag: 'Clean' },
    { id: 6, name: 'simple', image: '/images/template_image/simple.png', tag: 'Simple' },
    { id: 7, name: 'clean', image: '/images/template_image/clean.png', tag: 'Fresh' },
  ];

  const subdomain = window.location.hostname.split('.')[0];

  const saveHotspotTemplate = async (e) => {
    e.preventDefault();

    try {
      setisloading(true);
      setOpen(true);
      const response = await fetch('/api/hotspot_templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Subdomain': subdomain,
        },
        body: JSON.stringify({
          hotspot_templates: templateStates,
        }),
      });

      const newData = await response.json();

      if (response.ok) {
        toast.success('Hotspot Templates Saved Successfully', {
          duration: 3000,
          position: 'top-right',
        });

        setisloading(false);
        setOpen(false);
        setOpenSettings(true);

        const { attractive, flat, minimal, simple, clean, default_template, sleekspot, pepea, premium } = newData;

        setTemplateStates({
          ...templateStates,
          sleekspot,
          default_template,
          attractive,
          flat,
          minimal,
          simple,
          clean,
          pepea,
          premium,
        });
      } else {
        toast.error('Something went wrong', {
          duration: 3000,
          position: 'top-right',
        });
        setisloading(false);
        setOpen(false);
        setOpenSettings(false);
      }
    } catch (error) {
      setisloading(false);
      setOpen(false);
      setOpenSettings(false);
    }
  };

  const getHotspotTemplates = useCallback(async () => {
    const response = await fetch('/api/hotspot_templates', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Subdomain': subdomain,
      },
    });

    const newData = await response.json();
    if (response.ok) {
      const { attractive, flat, minimal, simple, clean, default_template, sleekspot, pepea, premium } = newData[0];

      setTemplateStates({
        ...templateStates,
        sleekspot,
        default: default_template,
        attractive,
        flat,
        minimal,
        simple,
        clean,
        pepea,
        premium,
      });
    } else {
      toast.error('failed to get hotspot templates settings', {
        duration: 3000,
        position: 'top-right',
      });
    }
  }, []);

  useEffect(() => {
    getHotspotTemplates();
  }, [getHotspotTemplates]);

  const selectedCount = imageTemplates.filter((t) => templateStates[t.name]).length;

  return (
    <>
      <Toaster />
      <Backdrop handleClose={handleClose} open={open} />
      <SettingsNotification open={openNotifactionSettings} handleClose={handleCloseNotifaction} />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 font-sans">
        {/* ambient glow blobs */}
        <div className="pointer-events-none fixed -top-24 -left-24 h-72 w-72 rounded-full bg-indigo-300/30 dark:bg-indigo-600/10 blur-3xl" />
        <div className="pointer-events-none fixed top-1/3 -right-24 h-72 w-72 rounded-full bg-fuchsia-300/20 dark:bg-fuchsia-600/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          {/* Header */}
          <div className="text-center mb-10 sm:mb-14">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 dark:bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300 ring-1 ring-inset ring-indigo-200 dark:ring-indigo-500/20">
              <Sparkles className="h-3.5 w-3.5" />
              Captive portal design
            </span>
            <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
              Choose a Hotspot Template
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              Pick the look your customers see when they connect. You can preview each style before saving.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {imageTemplates.map((template) => {
              const isSelected = !!templateStates[template.name];
              return (
                <motion.div
                  key={template.id}
                  layout
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                  className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl transition-shadow
                    ${isSelected
                      ? 'border-indigo-400 dark:border-indigo-500 ring-2 ring-indigo-400/60 dark:ring-indigo-500/40'
                      : 'border-slate-200 dark:border-slate-800'}`}
                >
                  {/* Selected badge */}
                  {isSelected && (
                    <div className="absolute top-3 right-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg">
                      <Check className="h-4 w-4" strokeWidth={3} />
                    </div>
                  )}

                  {/* Image / preview area */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    {template.image ? (
                      <>
                        <img
                          src={template.image}
                          alt={`${template.name} template preview`}
                          onClick={() => handleImageClick(template.image, template.name)}
                          className="h-full w-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
                        />
                        <button
                          onClick={() => handleImageClick(template.image, template.name)}
                          className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors"
                        >
                          <span className="flex items-center gap-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-100 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all">
                            <Eye className="h-3.5 w-3.5" />
                            Preview
                          </span>
                        </button>
                      </>
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800">
                        <span className="text-slate-400 dark:text-slate-500 text-sm font-medium">No preview</span>
                      </div>
                    )}

                    {/* Tag chip */}
                    <span className="absolute top-3 left-3 rounded-full bg-white/90 dark:bg-slate-900/85 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:text-slate-200 backdrop-blur">
                      {template.tag}
                    </span>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between gap-3 p-4">
                    <h2 className="capitalize text-sm sm:text-[15px] font-semibold text-slate-800 dark:text-slate-100 truncate">
                      {template.name.replace(/_/g, ' ')}
                    </h2>

                    <label className="relative inline-flex shrink-0 items-center cursor-pointer">
                      <input
                        type="checkbox"
                        value={template.name}
                        checked={isSelected}
                        onChange={(e) => handleCheckboxChange(e)}
                        className="peer sr-only"
                      />
                      <span
                        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors
                          ${isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-slate-200 dark:group-hover:bg-slate-700'}`}
                      >
                        {isSelected ? (
                          <>
                            <Check className="h-3.5 w-3.5" /> Selected
                          </>
                        ) : (
                          'Select'
                        )}
                      </span>
                    </label>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Preview modal */}
          <ModalImage
            isModalOpen={isModalOpen}
            title={imagetitle}
            setIsModalOpen={setIsModalOpen}
            previewImage={previewImage}
          />
        </div>

        {/* Sticky save bar */}
        <div className="sticky bottom-0 inset-x-0 z-20 border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {selectedCount > 0
                ? `${selectedCount} template${selectedCount > 1 ? 's' : ''} selected`
                : 'No template selected yet'}
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={isloading}
              onClick={saveHotspotTemplate}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 text-sm shadow-lg shadow-indigo-600/25 transition-colors"
            >
              {isloading ? (
                <>
                  <span className="h-3.5 w-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                  Saving…
                </>
              ) : (
                'Save Template'
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </>
  );
};

export default HotspotTemplates;