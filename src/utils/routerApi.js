export const apiFetch = async (url, options = {}) => {
  const { headers, body, ...rest } = options;
  const res = await fetch(url, {
    ...rest,
    body: body && typeof body !== 'string' ? JSON.stringify(body) : body,
    headers: {
      'X-Subdomain': window.location.hostname.split('.')[0],
      'X-Domain': window.location.hostname,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
  });
  if (res.status === 402) {
    setTimeout(() => { window.location.href = '/license-expired'; }, 1800);
  }
  return res;
};

export const readJson = async (res) => {
  try { return await res.json(); } catch { return {}; }
};