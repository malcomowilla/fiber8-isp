import { useEffect, useRef } from 'react';

const subdomain = window.location.hostname.split('.')[0];

export async function api(path, { method = 'GET', body, raw = false } = {}) {
  const res = await fetch(`/api/call_center/${path}`, {
    method,
    headers: { 'X-Subdomain': subdomain, ...(body ? { 'Content-Type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (raw) return res;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || data.errors?.join?.(', ') || `Request failed (${res.status})`);
  return data;
}

export function usePoll(fn, ms) {
  const ref = useRef(fn);
  ref.current = fn;
  useEffect(() => {
    let on = true;
    const tick = () => { if (on && !document.hidden) ref.current(); };
    tick();
    const id = setInterval(tick, ms);
    return () => { on = false; clearInterval(id); };
  }, [ms]);
}

export const fmtDur = (s = 0) => `${Math.floor(s / 60)}:${String(Math.floor(s) % 60).padStart(2, '0')}`;