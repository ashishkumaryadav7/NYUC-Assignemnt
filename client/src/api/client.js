import BASE_URL from './url'

export async function apiFetch(path, options = {}, getAccessToken, refreshFn) {
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };

  let token = getAccessToken?.();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let res = await fetch(url, {
    method: options.method || 'GET',
    headers,
    credentials: 'include',
    body: options.body ? JSON.stringify(options.body) : undefined
    
  });

  if (res.status === 401 && refreshFn) {
  // const ok = await refreshFn();
    const ok = await refreshFn(sessionStorage.getItem('refreshToken'));
  if (ok) {
    const newToken = getAccessToken?.();
    const retryHeaders = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
      ...(newToken ? { Authorization: `Bearer ${newToken}` } : {})
    };

    res = await fetch(url, {
      method: options.method || 'GET',
      headers: retryHeaders,
      credentials: 'include',
      body: options.body ? JSON.stringify(options.body) : undefined
    });
  }
}


  return res;
}
