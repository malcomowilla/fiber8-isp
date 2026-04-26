import React, { useState } from 'react';
import './HotspotSMSInfo.css';

const HotspotSMSInfo = () => {
  const [copied, setCopied] = useState(false);
  const ussdCode = "*456*9*5#";

  const handleCopyCode = () => {
    navigator.clipboard.writeText(ussdCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="hotspot-sms-inline">
      <p>
        <span>📱 Not receiving your voucher code through SMS after payment? Dial </span>
        <code 
          className="ussd-highlight"
          onClick={handleCopyCode}
          style={{cursor: 'pointer'}}
          title="Click to copy"
        >
          {ussdCode}
        </code>
        <span> then select <strong>Option 5</strong> to activate promo messages.</span>
      </p>
      {copied && <small style={{color: 'green', marginTop: '4px', display: 'block'}}>✓ Code copied to clipboard</small>}
    </div>
  );
};

export default HotspotSMSInfo;