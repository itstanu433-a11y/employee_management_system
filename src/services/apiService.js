import apiClient from '../utils/apiClient';

// Authentication Service
export const authService = {
  login: async (email, password) => {
    try {
      const users = await apiClient.get('/users');
      const user = users.data.find(
        (u) => u.email === email && u.password === password
      );

      if (!user) {
        // Check if user exists
        const userExists = users.data.some((u) => u.email === email);
        if (!userExists) {
          return { success: false, userNotFound: true, message: 'User does not exist in the system' };
        }
        return { success: false, message: 'Invalid credentials' };
      }

      // Check if account is locked
      if (user.isLocked) {
        const lockTime = new Date(user.lockedUntil);
        const now = new Date();
        if (now < lockTime) {
          return {
            success: false,
            isLocked: true,
            message: 'Account is temporarily locked',
          };
        }
      }

      // Store auth data in localStorage
      localStorage.setItem('authToken', 'token_' + user.id);
      localStorage.setItem('user', JSON.stringify(user));
      return { success: true, user };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  trackLoginAttempt: async (email) => {
    try {
      const users = await apiClient.get('/users');
      const user = users.data.find((u) => u.email === email);

      if (!user) {
        return { success: false, message: 'User not found' };
      }

      const now = new Date();
      let attempts = user.loginAttempts || 0;
      let isLocked = false;

      // Reset attempts if last attempt was more than 5 minutes ago
      if (user.lastLoginAttempt) {
        const lastAttemptTime = new Date(user.lastLoginAttempt);
        const timeDiff = (now - lastAttemptTime) / 1000 / 60; // minutes
        if (timeDiff > 5) {
          attempts = 0;
        }
      }

      attempts++;

      // Lock account if 5 failed attempts
      if (attempts >= 5) {
        isLocked = true;
        const lockedUntil = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes
        await apiClient.patch(`/users/${user.id}`, {
          loginAttempts: attempts,
          lastLoginAttempt: now.toISOString(),
          isLocked: true,
          lockedUntil: lockedUntil.toISOString(),
        });
      } else {
        await apiClient.patch(`/users/${user.id}`, {
          loginAttempts: attempts,
          lastLoginAttempt: now.toISOString(),
        });
      }

      return {
        success: true,
        attempts,
        isLocked,
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  register: async (userData) => {
    try {
      const users = await apiClient.get('/users');

      // Check if email already exists
      const existingUser = users.data.find((u) => u.email === userData.email);
      if (existingUser) {
        return { success: false, message: 'Email already registered' };
      }

      // Create new user
      const newUser = {
        id: Math.max(...users.data.map((u) => u.id), 0) + 1,
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: 'employee',
        departmentId: userData.departmentId || null,
        loginAttempts: 0,
        lastLoginAttempt: null,
        isLocked: false,
        lockedUntil: null,
        createdAt: new Date().toISOString(),
      };

      await apiClient.post('/users', newUser);
      return { success: true, message: 'Registration successful' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },
};

// Employee Service
export const employeeService = {
  getAllEmployees: () => apiClient.get('/employees'),

  getEmployeeById: (id) => apiClient.get(`/employees/${id}`),

  createEmployee: (data) => apiClient.post('/employees', data),

  updateEmployee: (id, data) => apiClient.put(`/employees/${id}`, data),

  deleteEmployee: (id) => apiClient.delete(`/employees/${id}`),

  searchEmployees: async (query) => {
    const response = await apiClient.get('/employees');
    const lowerQuery = query.toLowerCase();
    return response.data.filter(
      (emp) =>
        emp.name.toLowerCase().includes(lowerQuery) ||
        emp.email.toLowerCase().includes(lowerQuery)
    );
  },
};

// Department Service
export const departmentService = {
  getAllDepartments: () => apiClient.get('/departments'),

  getDepartmentById: (id) => apiClient.get(`/departments/${id}`),

  createDepartment: (data) => apiClient.post('/departments', data),

  updateDepartment: (id, data) => apiClient.put(`/departments/${id}`, data),

  deleteDepartment: (id) => apiClient.delete(`/departments/${id}`),

  getEmployeeCountByDepartment: async (departmentId) => {
    const employees = await apiClient.get('/employees');
    const count = employees.data.filter(
      (emp) => emp.department === departmentId
    ).length;
    return count;
  },

  syncDepartmentEmployeeCount: async () => {
    try {
      const departments = await apiClient.get('/departments');
      const employees = await apiClient.get('/employees');

      for (const dept of departments.data) {
        const count = employees.data.filter(
          (emp) => emp.department === dept.name
        ).length;
        if (count !== dept.totalEmployees) {
          await apiClient.patch(`/departments/${dept.id}`, {
            totalEmployees: count,
          });
        }
      }
      return { success: true, message: 'Department counts synced' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },
};

// Leave Management Service
export const leaveService = {
  getAllLeaveRequests: () => apiClient.get('/leaveRequests'),

  getLeaveRequestsByEmployee: async (employeeId) => {
    const response = await apiClient.get('/leaveRequests');
    return response.data.filter((leave) => leave.employeeId === employeeId);
  },

  createLeaveRequest: (data) => apiClient.post('/leaveRequests', data),

  updateLeaveRequest: (id, data) => apiClient.put(`/leaveRequests/${id}`, data),

  deleteLeaveRequest: (id) => apiClient.delete(`/leaveRequests/${id}`),

  approveLeaveRequest: (id, approvedBy) =>
    apiClient.patch(`/leaveRequests/${id}`, {
      status: 'approved',
      approvedBy,
      approvedAt: new Date().toISOString(),
    }),

  rejectLeaveRequest: (id, approvedBy) =>
    apiClient.patch(`/leaveRequests/${id}`, {
      status: 'rejected',
      approvedBy,
      approvedAt: new Date().toISOString(),
    }),

  getLeaveBalance: (employeeId) =>
    apiClient.get(`/leaveBalances?employeeId=${employeeId}`),

  updateLeaveBalance: (employeeId, leaveData) =>
    apiClient.patch(
      `/leaveBalances/${employeeId}`,
      leaveData
    ),
};

// Attendance Service
export const attendanceService = {
  getAllAttendance: () => apiClient.get('/attendance'),

  getAttendanceByEmployee: async (employeeId) => {
    const response = await apiClient.get('/attendance');
    return response.data.filter((att) => att.employeeId === employeeId);
  },

  getAttendanceByDate: async (date) => {
    const response = await apiClient.get('/attendance');
    return response.data.filter((att) => att.date === date);
  },

  markAttendance: (data) => apiClient.post('/attendance', data),

  updateAttendance: (id, data) => apiClient.put(`/attendance/${id}`, data),

  deleteAttendance: (id) => apiClient.delete(`/attendance/${id}`),

  getMonthlyAttendance: async (employeeId, year, month) => {
    const response = await apiClient.get('/attendance');
    return response.data.filter((att) => {
      const attDate = new Date(att.date);
      return (
        att.employeeId === employeeId &&
        attDate.getFullYear() === year &&
        attDate.getMonth() + 1 === month
      );
    });
  },
};

// Feedback Service
export const feedbackService = {
  getAllFeedback: () => apiClient.get('/feedback'),

  getFeedbackByEmployee: async (employeeId) => {
    const response = await apiClient.get('/feedback');
    return response.data.filter((fb) => fb.employeeId === employeeId);
  },

  getFeedbackByDepartment: async (departmentId) => {
    const response = await apiClient.get('/feedback');
    return response.data.filter((fb) => fb.departmentId === departmentId);
  },

  createFeedback: (data) => apiClient.post('/feedback', data),

  updateFeedback: (id, data) => apiClient.put(`/feedback/${id}`, data),

  deleteFeedback: (id) => apiClient.delete(`/feedback/${id}`),

  respondToFeedback: (id, response) =>
    apiClient.patch(`/feedback/${id}`, {
      status: 'Reviewed',
      response,
      reviewedAt: new Date().toISOString(),
    }),
};

// Holiday Service
export const holidayService = {
  getAllHolidays: () => apiClient.get('/holidays'),

  getHolidaysByYear: async (year) => {
    const response = await apiClient.get('/holidays');
    return response.data.filter((h) => new Date(h.date).getFullYear() === year);
  },

  createHoliday: (data) => apiClient.post('/holidays', data),

  updateHoliday: (id, data) => apiClient.put(`/holidays/${id}`, data),

  deleteHoliday: (id) => apiClient.delete(`/holidays/${id}`),

  isHoliday: async (date) => {
    const response = await apiClient.get('/holidays');
    return response.data.some((h) => h.date === date);
  },
};

// Performance Review Service
export const performanceService = {
  getAllReviews: () => apiClient.get('/performanceReviews'),

  getReviewsByEmployee: async (employeeId) => {
    const response = await apiClient.get('/performanceReviews');
    return response.data.filter((r) => r.employeeId === employeeId);
  },

  getReviewsByYear: async (year) => {
    const response = await apiClient.get('/performanceReviews');
    return response.data.filter((r) => r.year === year);
  },

  createReview: (data) => apiClient.post('/performanceReviews', data),

  updateReview: (id, data) => apiClient.put(`/performanceReviews/${id}`, data),

  deleteReview: (id) => apiClient.delete(`/performanceReviews/${id}`),
};

// Salary History Service
export const salaryService = {
  getAllSalaryHistory: () => apiClient.get('/salaryHistory'),

  getSalaryHistoryByEmployee: async (employeeId) => {
    const response = await apiClient.get('/salaryHistory');
    return response.data.filter((s) => s.employeeId === employeeId);
  },

  addSalaryIncrement: (data) => apiClient.post('/salaryHistory', data),

  updateSalaryIncrement: (id, data) =>
    apiClient.put(`/salaryHistory/${id}`, data),

  deleteSalaryIncrement: (id) => apiClient.delete(`/salaryHistory/${id}`),
};

// Transfer History Service
export const transferService = {
  getAllTransfers: () => apiClient.get('/transferHistory'),

  getTransfersByEmployee: async (employeeId) => {
    const response = await apiClient.get('/transferHistory');
    return response.data.filter((t) => t.employeeId === employeeId);
  },

  createTransfer: (data) => apiClient.post('/transferHistory', data),

  updateTransfer: (id, data) => apiClient.put(`/transferHistory/${id}`, data),

  deleteTransfer: (id) => apiClient.delete(`/transferHistory/${id}`),
};
