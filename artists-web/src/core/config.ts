export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  wsUrl: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080/ws',
  tokenKey: 'artists_token',
  tokenExpiryKey: 'artists_token_expiry',
};
