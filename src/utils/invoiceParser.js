// utils/invoiceParser.js
export const parseInvoiceDescription = (description) => {
  if (!description) return { summary: '', items: [] };

  try {
    // First, try to parse as JSON (if backend was updated)
    const parsedJson = JSON.parse(description);
    if (parsedJson.summary && parsedJson.items) {
      return parsedJson;
    }
  } catch {
    // If not JSON, parse the text format
  }

  // Parse the text format
  const lines = description.split('\n').filter(line => line.trim() !== '');
  const items = [];
  let summary = '';

  // Extract summary from first line
  if (lines.length > 0) {
    summary = lines[0].replace(':', '').trim();
  }

  // Parse each line
  lines.slice(1).forEach((line) => {
    if (line.includes(':')) {
      const [label, valueWithUnit] = line.split(':').map(str => str.trim());
      const value = valueWithUnit.split(' ')[0];
      const unit = valueWithUnit.split(' ').slice(1).join(' ') || 'KES';

      let item = {
        label,
        rawValue: valueWithUnit,
        value: parseFloat(value) || 0,
        unit
      };

      // Categorize the line
      if (line.includes('Hotspot revenue')) {
        items.push({
          description: 'Hotspot Revenue',
          details: 'Total revenue from hotspot services',
          quantity: parseFloat(value),
          unit: 'KES',
          rate: null,
          amount: null,
          type: 'revenue'
        });
      } else if (line.includes('Hotspot charge')) {
        items.push({
          description: 'Hotspot Service Fee',
          details: '4% of total hotspot revenue',
          quantity: null,
          unit: 'KES',
          rate: '4%',
          amount: parseFloat(value),
          type: 'charge'
        });
      } else if (line.includes('PPPoE clients')) {
        items.push({
          description: 'PPPoE Active Clients',
          details: 'Number of active PPPoE subscribers',
          quantity: parseInt(value),
          unit: 'clients',
          rate: null,
          amount: null,
          type: 'count'
        });
      } else if (line.includes('PPPoE charge')) {
        items.push({
          description: 'PPPoE Management Fee',
          details: '25 KES per client per month',
          quantity: null,
          unit: 'KES',
          rate: '25 KES/client',
          amount: parseFloat(value),
          type: 'charge'
        });
      }
    }
  });

  return { summary, items };
};