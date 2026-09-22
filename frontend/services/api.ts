const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

async function refreshToken(): Promise<string> {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) throw new Error('No refresh token');

  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) throw new Error('Refresh failed');
  const data = await res.json();
  localStorage.setItem('token', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
  return data.accessToken;
}

async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  let token = localStorage.getItem('token');

  const makeRequest = (): Promise<Response> => {
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  };

  let response = await makeRequest();

  if (response.status === 401) {
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const newToken = await refreshToken();
        token = newToken;
        isRefreshing = false;
        refreshSubscribers.forEach(cb => cb(newToken));
        refreshSubscribers = [];
      } catch (error) {
        isRefreshing = false;
        refreshSubscribers = [];
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        throw error;
      }
    }

    // Wait for refresh to complete
    if (isRefreshing) {
      const newToken = await new Promise<string>((resolve) => {
        refreshSubscribers.push(resolve);
      });
      token = newToken;
    }

    response = await makeRequest();
  }

  return response;
}

export async function loginUser(email: string, password: string) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Login failed');
  return res.json();
}

export async function registerUser(email: string, password: string) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Registration failed');
  return res.json();
}

export async function logoutUser() {
  const refreshToken = localStorage.getItem('refreshToken');
  if (refreshToken) {
    await fetch(`${BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
  }
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
}

export async function getTasks(params: { page: number; limit: number; search: string; status: string }) {
  const url = new URL(`${BASE_URL}/tasks`);
  url.searchParams.append('page', String(params.page));
  url.searchParams.append('limit', String(params.limit));
  if (params.search) url.searchParams.append('search', params.search);
  if (params.status && params.status !== 'all') url.searchParams.append('status', params.status);

  const res = await fetchWithAuth(url.toString());
  return res.json();
}

export async function createTask(title: string) {
  const res = await fetchWithAuth(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  return res.json();
}

export async function updateTask(id: number, title: string) {
  const res = await fetchWithAuth(`${BASE_URL}/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  return res.json();
}

export async function deleteTask(id: number) {
  await fetchWithAuth(`${BASE_URL}/tasks/${id}`, { method: 'DELETE' });
}

export async function toggleTask(id: number) {
  const res = await fetchWithAuth(`${BASE_URL}/tasks/${id}/toggle`, {
    method: 'PATCH',
  });
  return res.json();
}