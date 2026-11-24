import { md5 } from './md5';

export interface WatchPaysConfig {
  merchantId: string;
  apiKey: string;
  callbackUrl: string;
  apiUrl: string;
  isLiveMode: boolean; // if true calls https://api.watchpays.com/v1/create
}

export interface WatchPaysOrderParams {
  merchant_id: string;
  amount: string; // formatted e.g. "1000.00"
  merchant_order_no: string;
  callback_url: string;
  extra?: string;
}

export interface WatchPaysSignatureResult {
  sortedParams: Record<string, string>;
  rawQueryString: string;
  stringToSign: string;
  signature: string;
}

export interface WatchPaysCreateRequest {
  merchant_id: string;
  api_key: string;
  amount: string;
  merchant_order_no: string;
  callback_url: string;
  extra?: string;
  signature: string;
}

export interface WatchPaysCreateResponse {
  success: boolean;
  merchant_order_no?: string;
  order_no?: string;
  amount?: string;
  payment_url?: string;
  status?: string;
  message?: string;
  error?: string;
}

export const DEFAULT_WATCHPAYS_CONFIG: WatchPaysConfig = {
  merchantId: '100666059',
  apiKey: '02198abbdfd5bf52f621c4a217a1387f',
  callbackUrl: typeof window !== 'undefined' ? `${window.location.origin}/api/watchpays/callback` : 'https://site.com/callback',
  apiUrl: 'https://api.watchpays.com/v1/create',
  isLiveMode: true
};

const WATCHPAYS_STORAGE_KEY = 'earninghub_watchpays_config_v2';

export function getStoredWatchPaysConfig(): WatchPaysConfig {
  if (typeof window === 'undefined') return DEFAULT_WATCHPAYS_CONFIG;
  try {
    const saved = localStorage.getItem(WATCHPAYS_STORAGE_KEY) || localStorage.getItem('earninghub_watchpays_config_v1');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Auto-migrate if older placeholder credentials were saved
      if (!parsed.merchantId || parsed.merchantId === '100555001' || !parsed.apiKey || parsed.apiKey === 'sk_live_xxx') {
        const updated: WatchPaysConfig = {
          ...DEFAULT_WATCHPAYS_CONFIG,
          ...parsed,
          merchantId: '100666059',
          apiKey: '02198abbdfd5bf52f621c4a217a1387f',
          isLiveMode: true
        };
        localStorage.setItem(WATCHPAYS_STORAGE_KEY, JSON.stringify(updated));
        return updated;
      }
      return { ...DEFAULT_WATCHPAYS_CONFIG, ...parsed };
    }
  } catch (e) {
    console.error('Failed to load WatchPays config from localStorage:', e);
  }
  return DEFAULT_WATCHPAYS_CONFIG;
}

export function saveWatchPaysConfig(config: WatchPaysConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(WATCHPAYS_STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save WatchPays config to localStorage:', e);
  }
}

/**
 * Executes the exact 6 steps as per WatchPays specification:
 * Step 1: Prepare params merchant_id, amount, merchant_order_no, callback_url
 * Step 2: Remove empty values
 * Step 3: Sort alphabetically (amount → callback_url → merchant_id → merchant_order_no)
 * Step 4: Build string "amount=1000.00&callback_url=...&merchant_id=...&merchant_order_no=..."
 * Step 5: Append API key "&key=API_KEY"
 * Step 6: MD5 hash → signature
 */
export function generateWatchPaysSignature(
  params: {
    merchant_id: string;
    amount: string | number;
    merchant_order_no: string;
    callback_url: string;
  },
  apiKey: string
): WatchPaysSignatureResult {
  // Format amount to 2 decimal places e.g. "1000.00"
  const formattedAmount = typeof params.amount === 'number' 
    ? params.amount.toFixed(2) 
    : Number(params.amount).toFixed(2);

  const rawMap: Record<string, string> = {
    merchant_id: params.merchant_id ? String(params.merchant_id).trim() : '',
    amount: formattedAmount,
    merchant_order_no: params.merchant_order_no ? String(params.merchant_order_no).trim() : '',
    callback_url: params.callback_url ? String(params.callback_url).trim() : ''
  };

  // Step 2: Remove empty values
  const filteredKeys = Object.keys(rawMap).filter((k) => rawMap[k] !== '' && rawMap[k] !== undefined && rawMap[k] !== null);

  // Step 3: Sort keys alphabetically (ksort in PHP)
  filteredKeys.sort();

  // Step 4: Build string
  let signStr = '';
  const sortedParams: Record<string, string> = {};
  for (const k of filteredKeys) {
    sortedParams[k] = rawMap[k];
    signStr += `${k}=${rawMap[k]}&`;
  }

  // Step 5: Append API key (&key=API_KEY)
  const stringToSign = `${signStr}key=${apiKey.trim()}`;

  // Step 6: MD5 hash → signature
  const signature = md5(stringToSign);

  return {
    sortedParams,
    rawQueryString: signStr.slice(0, -1),
    stringToSign,
    signature
  };
}

/**
 * Creates an order by calling the WatchPays endpoint / server proxy
 */
export async function createWatchPaysOrder(
  amount: number,
  userId: string,
  config?: WatchPaysConfig
): Promise<WatchPaysCreateResponse> {
  const currentConfig = config || getStoredWatchPaysConfig();
  const merchantOrderNo = `ORD${Date.now()}${Math.floor(100 + Math.random() * 900)}`;
  const formattedAmount = amount.toFixed(2);

  const signResult = generateWatchPaysSignature(
    {
      merchant_id: currentConfig.merchantId,
      amount: formattedAmount,
      merchant_order_no: merchantOrderNo,
      callback_url: currentConfig.callbackUrl
    },
    currentConfig.apiKey
  );

  const requestBody = {
    merchant_id: currentConfig.merchantId,
    api_key: currentConfig.apiKey,
    amount: formattedAmount,
    merchant_order_no: merchantOrderNo,
    callback_url: currentConfig.callbackUrl,
    extra: userId || 'user001',
    signature: signResult.signature,
    sign: signResult.signature
  };

  // First try calling our backend server proxy (/api/watchpays/create)
  try {
    const res = await fetch('/api/watchpays/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...requestBody,
        apiUrl: currentConfig.apiUrl,
        isLiveMode: currentConfig.isLiveMode
      })
    });

    if (res.ok) {
      const data: WatchPaysCreateResponse = await res.json();
      return data;
    }
  } catch (err) {
    console.warn('Backend proxy /api/watchpays/create unavailable, falling back to direct / simulated:', err);
  }

  // If live mode is enabled, attempt direct call to WatchPays API (may fail due to CORS in browser)
  if (currentConfig.isLiveMode) {
    try {
      const liveRes = await fetch(currentConfig.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      const responseData = await liveRes.json();
      return responseData;
    } catch (directErr: any) {
      console.warn('Direct WatchPays call failed (likely CORS or network):', directErr);
      // Fallback with informative error or simulated checkout
      return {
        success: false,
        merchant_order_no: merchantOrderNo,
        amount: formattedAmount,
        error: directErr?.message || 'CORS or Network Connection Error to WatchPays API'
      };
    }
  }

  // Test / Simulation Mode (when testing without live merchant account)
  return {
    success: true,
    merchant_order_no: merchantOrderNo,
    order_no: `GW${Date.now()}`,
    amount: formattedAmount,
    payment_url: `https://gateway.watchpays.com/pay/GW${Date.now()}`,
    status: 'created'
  };
}
