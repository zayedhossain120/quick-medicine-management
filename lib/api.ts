class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${endpoint}`;

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(data.error || "An error occurred", response.status);
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError("Network error!", 500);
  }
}

// Auth API
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    apiRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  register: (userData: any) =>
    apiRequest("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  changePassword: (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
    email: string;
  }) => {
    if (data.newPassword !== data.confirmPassword) {
      throw new ApiError("New password and confirm password do not match", 400);
    }

    return apiRequest("/api/auth/change-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Admin profile management
  updateProfile: (profileData: {
    name?: string;
    image?: string;
    phone?: string;
    address?: string;
  }) =>
    apiRequest("/api/auth/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    }),

  getProfile: () => apiRequest("/api/auth/profile"),

  changeAdminPassword: (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    if (data.newPassword !== data.confirmPassword) {
      throw new ApiError("New password and confirm password do not match", 400);
    }

    return apiRequest("/api/auth/admin/change-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};

// Members API
export const membersApi = {
  getAll: (params?: {
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append("search", params.search);
    if (params?.status) searchParams.append("status", params.status);
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());

    return apiRequest(`/api/members?${searchParams.toString()}`);
  },

  getById: (id: string) => apiRequest(`/api/members/${id}`),

  create: (memberData: any) =>
    apiRequest("/api/members", {
      method: "POST",
      body: JSON.stringify(memberData),
    }),

  update: (id: string, memberData: any) =>
    apiRequest(`/api/members/${id}`, {
      method: "PUT",
      body: JSON.stringify(memberData),
    }),

  delete: (id: string) =>
    apiRequest(`/api/members/${id}`, {
      method: "DELETE",
    }),
};

// Transactions API
export const transactionsApi = {
  getAll: (params?: {
    search?: string;
    type?: string;
    status?: string;
    memberId?: string;
    page?: number;
    limit?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append("search", params.search);
    if (params?.type) searchParams.append("type", params.type);
    if (params?.status) searchParams.append("status", params.status);
    if (params?.memberId) searchParams.append("memberId", params.memberId);
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());

    return apiRequest(`/api/transactions?${searchParams.toString()}`);
  },

  create: (transactionData: any) =>
    apiRequest("/api/transactions", {
      method: "POST",
      body: JSON.stringify(transactionData),
    }),
};

// Deposits API
export const depositsApi = {
  getAll: () => apiRequest("/api/deposits"),

  create: (depositData: any) =>
    apiRequest("/api/deposits", {
      method: "POST",
      body: JSON.stringify(depositData),
    }),

  requestDeposit: (requestData: any) =>
    apiRequest("/api/deposits/request", {
      method: "POST",
      body: JSON.stringify(requestData),
    }),

  approve: (id: string) =>
    apiRequest(`/api/deposits/approve/${id}`, {
      method: "POST",
    }),

  decline: (id: string) =>
    apiRequest(`/api/deposits/decline/${id}`, {
      method: "POST",
    }),

  delete: (id: string) =>
    apiRequest(`/api/deposits/${id}`, {
      method: "DELETE",
    }),
};

// Withdrawals API
export const withdrawalsApi = {
  getAll: () => apiRequest("/api/withdrawals"),

  create: (withdrawalData: any) =>
    apiRequest("/api/withdrawals", {
      method: "POST",
      body: JSON.stringify(withdrawalData),
    }),

  requestWithdrawal: (requestData: any) =>
    apiRequest("/api/withdrawals/request", {
      method: "POST",
      body: JSON.stringify(requestData),
    }),

  approve: (id: string) =>
    apiRequest(`/api/withdrawals/approve/${id}`, {
      method: "POST",
    }),

  decline: (id: string) =>
    apiRequest(`/api/withdrawals/decline/${id}`, {
      method: "POST",
    }),

  delete: (id: string) =>
    apiRequest(`/api/withdrawals/${id}`, {
      method: "DELETE",
    }),
};

// Profits API
export const profitsApi = {
  getAll: () => apiRequest("/api/profits"),

  create: (profitData: any) =>
    apiRequest("/api/profits", {
      method: "POST",
      body: JSON.stringify(profitData),
    }),

  delete: (id: string) =>
    apiRequest(`/api/profits/${id}`, {
      method: "DELETE",
    }),
};

// Dashboard API
export const dashboardApi = {
  getStats: (memberId?: string) => {
    const params = memberId ? `?memberId=${memberId}` : "";
    return apiRequest(`/api/dashboard/stats${params}`);
  },
};

export { ApiError };
