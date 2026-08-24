const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const fetchServices = async (category = '', search = '') => {
  const params = new URLSearchParams();
  if (category) params.append('category', category);
  if (search) params.append('search', search);

  const res = await fetch(`${API_BASE}/services?${params.toString()}`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to retrieve services catalog.');
  }
  return res.json();
};

export const fetchServiceById = async (id) => {
  const res = await fetch(`${API_BASE}/services/${id}`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to retrieve service details.');
  }
  return res.json();
};

export const submitBooking = async (bookingData) => {
  const res = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bookingData)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to submit your booking.');
  }
  return res.json();
};

export const checkAdminStatusApi = async () => {
  const res = await fetch(`${API_BASE}/auth/status`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to check administrator status.');
  }
  return res.json();
};

export const loginAdminApi = async (username, password) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Authentication failed.');
  }
  return res.json();
};

export const fetchAdminBookings = async (token) => {
  const res = await fetch(`${API_BASE}/bookings`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to load bookings list.');
  }
  return res.json();
};

export const updateBookingStatusApi = async (token, id, status) => {
  const res = await fetch(`${API_BASE}/bookings/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to modify booking status.');
  }
  return res.json();
};

export const fetchBookingsByPhone = async (phone) => {
  const res = await fetch(`${API_BASE}/bookings/phone/${phone}`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to search bookings history.');
  }
  return res.json();
};

export const createServiceApi = async (token, serviceData) => {
  const res = await fetch(`${API_BASE}/services`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(serviceData)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to create service.');
  }
  return res.json();
};

export const updateServiceApi = async (token, id, serviceData) => {
  const res = await fetch(`${API_BASE}/services/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(serviceData)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to update service.');
  }
  return res.json();
};

export const deleteServiceApi = async (token, id) => {
  const res = await fetch(`${API_BASE}/services/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to delete service.');
  }
  return res.json();
};
