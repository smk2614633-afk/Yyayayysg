import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory log of recent WatchPays transactions & webhook callbacks for Admin inspection
interface GatewayLog {
  id: string;
  timestamp: string;
  type: 'create_order' | 'callback' | 'test';
  request: any;
  response: any;
  status: 'success' | 'error';
}

const gatewayLogs: GatewayLog[] = [];

/**
 * WatchPays Signature Verification Helper (Node.js crypto)
 */
function verifyWatchPaysSignature(
  params: Record<string, string | number>,
  apiKey: string,
  providedSignature: string
): boolean {
  const rawMap: Record<string, string> = {};
  for (const [k, v] of Object.entries(params)) {
    if (k !== 'signature' && k !== 'api_key' && k !== 'extra' && v !== '' && v !== undefined && v !== null) {
      rawMap[k] = String(v);
    }
  }

  const sortedKeys = Object.keys(rawMap).sort();
  let signStr = '';
  for (const k of sortedKeys) {
    signStr += `${k}=${rawMap[k]}&`;
  }
  signStr += `key=${apiKey}`;

  const calculatedSignature = crypto.createHash('md5').update(signStr).digest('hex');
  return calculatedSignature.toLowerCase() === providedSignature.toLowerCase();
}

/**
 * API: Create Order Proxy to https://api.watchpays.com/v1/create
 * Eliminates browser CORS issues and keeps credentials secure.
 */
app.post('/api/watchpays/create', async (req: Request, res: Response) => {
  const {
    merchant_id,
    api_key,
    amount,
    merchant_order_no,
    callback_url,
    extra,
    signature,
    apiUrl,
    isLiveMode
  } = req.body;

  const targetUrl = apiUrl || 'https://api.watchpays.com/v1/create';

  const finalMerchantId = (merchant_id && merchant_id !== '100555001') ? String(merchant_id).trim() : '100666059';
  const finalApiKey = (api_key && api_key !== 'sk_live_xxx') ? String(api_key).trim() : '02198abbdfd5bf52f621c4a217a1387f';
  const formattedAmount = typeof amount === 'number' ? amount.toFixed(2) : Number(amount).toFixed(2);
  const finalCallbackUrl = callback_url || `${req.protocol}://${req.get('host')}/api/watchpays/callback`;
  const finalOrderNo = merchant_order_no || `ORD${Date.now()}`;

  // Execute the exact 6-step WatchPays MD5 signature algorithm
  const rawMap: Record<string, string> = {
    amount: formattedAmount,
    callback_url: finalCallbackUrl,
    merchant_id: finalMerchantId,
    merchant_order_no: finalOrderNo
  };
  const sortedKeys = Object.keys(rawMap).sort();
  let signStr = '';
  for (const k of sortedKeys) {
    signStr += `${k}=${rawMap[k]}&`;
  }
  signStr += `key=${finalApiKey}`;
  const computedSignature = crypto.createHash('md5').update(signStr).digest('hex');
  const finalSignature = signature || computedSignature;

  const payload = {
    merchant_id: finalMerchantId,
    api_key: finalApiKey,
    amount: formattedAmount,
    merchant_order_no: finalOrderNo,
    callback_url: finalCallbackUrl,
    extra: extra || 'user001',
    signature: finalSignature,
    sign: finalSignature
  };

  try {
    // If not live mode or testing placeholder, allow simulated response if requested
    if (isLiveMode === false) {
      const mockSuccess = {
        success: true,
        merchant_order_no,
        order_no: `GW${Date.now()}`,
        amount: payload.amount,
        payment_url: `https://gateway.watchpays.com/pay/GW${Date.now()}`,
        status: 'created',
        mode: 'simulation'
      };

      gatewayLogs.unshift({
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'create_order',
        request: payload,
        response: mockSuccess,
        status: 'success'
      });

      return res.json(mockSuccess);
    }

    // Call official WatchPays API endpoint
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    let data: any;
    const responseText = await response.text();
    try {
      data = JSON.parse(responseText);
    } catch {
      data = { raw: responseText, success: false, error: responseText };
    }

    gatewayLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'create_order',
      request: payload,
      response: data,
      status: response.ok && data?.success !== false ? 'success' : 'error'
    });

    // Keep log max length 50
    if (gatewayLogs.length > 50) gatewayLogs.pop();

    return res.status(response.status).json(data);
  } catch (error: any) {
    console.error('WatchPays API Error:', error);

    const errorResp = {
      success: false,
      merchant_order_no,
      amount: payload.amount,
      error: error?.message || 'Failed to connect to WatchPays Gateway API'
    };

    gatewayLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'create_order',
      request: payload,
      response: errorResp,
      status: 'error'
    });

    return res.status(502).json(errorResp);
  }
});

/**
 * API: Webhook Callback from WatchPays
 * Receives payment status updates (e.g. status: 'paid' / 'success')
 */
app.all('/api/watchpays/callback', (req: Request, res: Response) => {
  const data = req.method === 'POST' ? req.body : req.query;

  gatewayLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    type: 'callback',
    request: data,
    response: { received: true, ack: 'SUCCESS' },
    status: 'success'
  });

  // WatchPays expects acknowledgment (usually "SUCCESS" or { "status": "success" })
  res.send('SUCCESS');
});

/**
 * API: Get Gateway Logs for Admin Panel
 */
app.get('/api/watchpays/logs', (_req: Request, res: Response) => {
  res.json({ logs: gatewayLogs });
});

/**
 * Main application bootstrap with Vite
 */
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        host: '0.0.0.0',
        port: 3000
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`WatchPays Full-Stack server running on port ${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
