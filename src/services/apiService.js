import apiClient from '../utils/apiClient';

// Authentication Service
export const authService = {
  login: async (email, password) => {
    try {
      const users = await apiClient.get('/users');
      const user = users.data.find(
        (u) => u.email === email && u.password === password
      );
      
      if (user) {
        // Store auth data in localStorage
        localStorage.setItem('authToken', 'token_' + user.id);
        localStorage.setItem('user', JSON.stringify(user));
        return { success: true, user };
      }
      return { success: false, message: 'Invalid credentials' };
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
};

// Attendance Service
export const attendanceService = {
  getAllAttendance: () => apiClient.get('/attendance'),
  
  getAttendanceByEmployeeId: (employeeId) =>
    apiClient.get(`/attendance?employeeId=${employeeId}`),
  
  markAttendance: (data) => apiClient.post('/attendance', data),
  
  updateAttendance: (id, data) => apiClient.put(`/attendance/${id}`, data),
  
  deleteAttendance: (id) => apiClient.delete(`/attendance/${id}`),
};

// Leave Service
export const leaveService = {
  getAllLeaveRequests: () => apiClient.get('/leaveRequests'),
  
  getLeaveRequestById: (id) => apiClient.get(`/leaveRequests/${id}`),
  
  getLeaveRequestsByEmployeeId: (employeeId) =>
    apiClient.get(`/leaveRequests?employeeId=${employeeId}`),
  
  getPendingLeaveRequests: async () => {
    const response = await apiClient.get('/leaveRequests');
    return response.data.filter((leave) => leave.status === 'pending');
  },
  
  createLeaveRequest: (data) => apiClient.post('/leaveRequests', data),
  
  updateLeaveRequest: (id, data) => apiClient.put(`/leaveRequests/${id}`, data),
  
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
  
  deleteLeaveRequest: (id) => apiClient.delete(`/leaveRequests/${id}`),
};
