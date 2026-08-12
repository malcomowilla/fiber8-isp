// public/hotspot-client.js — served statically, one copy for all tenants
(function () {
  const { mac, ip, subdomain, apiBase } = window.HOTSPOT_CONFIG;

  async function loadPackages() {
    const el = document.getElementById('packages-list');
    if (!el) return;
    try {
      const res = await fetch(`${apiBase}/api/allow_get_hotspot_packages`, { headers: { 'X-Subdomain': subdomain } });
      const packages = await res.json();
      el.innerHTML = packages.map(p => `
        <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid rgba(255,255,255,.06)">
          <span>${p.name} — ${p.valid}</span><strong>Ksh ${p.price}</strong>
        </div>`).join('');
    } catch (e) {
      el.textContent = 'Could not load packages';
    }
  }

  document.getElementById('voucher-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const voucher = document.getElementById('voucher-input').value;
    const res = await fetch(`${apiBase}/api/login_with_hotspot_voucher`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Subdomain': subdomain },
      body: JSON.stringify({ voucher, mac, ip }),
    });
    alert(res.ok ? 'Connected! You can start browsing.' : 'Invalid voucher.');
  });

  document.getElementById('receipt-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const receipt_number = document.getElementById('receipt-input').value;
    const res = await fetch(`${apiBase}/api/login_with_receipt_number`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Subdomain': subdomain },
      body: JSON.stringify({ receipt_number, mac, ip }),
    });
    alert(res.ok ? 'Connected!' : 'Receipt not found.');
  });

  loadPackages();
})();