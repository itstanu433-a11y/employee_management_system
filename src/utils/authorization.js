// Role hierarchy
const ROLES = {
  CEO: 'ceo',
  MANAGER: 'manager',
  EMPLOYEE: 'employee',
};

// Permission definitions
const PERMISSIONS = {
  VIEW_ALL_EMPLOYEES: 'view_all_employees',
  EDIT_ALL_EMPLOYEES: 'edit_all_employees',
  DELETE_EMPLOYEES: 'delete_employees',
  VIEW_DEPARTMENT_EMPLOYEES: 'view_department_employees',
  VIEW_OWN_PROFILE: 'view_own_profile',
  REQUEST_LEAVE: 'request_leave',
  APPROVE_LEAVE: 'approve_leave',
  MANAGE_DEPARTMENTS: 'manage_departments',
  VIEW_REPORTS: 'view_reports',
};

// Role to permissions mapping
const rolePermissions = {
  [ROLES.CEO]: [
    PERMISSIONS.VIEW_ALL_EMPLOYEES,
    PERMISSIONS.EDIT_ALL_EMPLOYEES,
    PERMISSIONS.DELETE_EMPLOYEES,
    PERMISSIONS.APPROVE_LEAVE,
    PERMISSIONS.MANAGE_DEPARTMENTS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.VIEW_OWN_PROFILE,
  ],
  [ROLES.MANAGER]: [
    PERMISSIONS.VIEW_DEPARTMENT_EMPLOYEES,
    PERMISSIONS.EDIT_ALL_EMPLOYEES,
    PERMISSIONS.REQUEST_LEAVE,
    PERMISSIONS.APPROVE_LEAVE,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.VIEW_OWN_PROFILE,
  ],
  [ROLES.EMPLOYEE]: [
    PERMISSIONS.VIEW_DEPARTMENT_EMPLOYEES,
    PERMISSIONS.REQUEST_LEAVE,
    PERMISSIONS.VIEW_OWN_PROFILE,
  ],
};

// Check if user has permission
export const hasPermission = (userRole, permission) => {
  if (!userRole || !rolePermissions[userRole]) {
    return false;
  }
  return rolePermissions[userRole].includes(permission);
};

// Check if user has any of the given roles
export const hasRole = (userRole, allowedRoles) => {
  return allowedRoles.includes(userRole);
};

// Get user permissions
export const getUserPermissions = (userRole) => {
  return rolePermissions[userRole] || [];
};

// Get role display name
export const getRoleDisplayName = (role) => {
  const roleNames = {
    ceo: 'CEO',
    manager: 'Manager',
    employee: 'Employee',
  };
  return roleNames[role] || role;
};

// Check if user can manage leave requests
export const canApproveLeave = (userRole, departmentId, requestDepartmentId) => {
  if (userRole === ROLES.CEO) {
    return true; // CEO can approve any leave
  }
  if (userRole === ROLES.MANAGER && departmentId === requestDepartmentId) {
    return true; // Manager can approve leaves from their department
  }
  return false;
};

// Check if user can view employee
export const canViewEmployee = (userRole, userDepartmentId, employeeDepartmentId) => {
  if (userRole === ROLES.CEO) {
    return true; // CEO can view all employees
  }
  if (userRole === ROLES.MANAGER && userDepartmentId === employeeDepartmentId) {
    return true; // Manager can view employees in their department
  }
  if (userRole === ROLES.EMPLOYEE && userDepartmentId === employeeDepartmentId) {
    return true; // Employee can view colleagues in their department
  }
  return false;
};

// Check if user can edit employee
export const canEditEmployee = (userRole, userDepartmentId, employeeDepartmentId) => {
  if (userRole === ROLES.CEO) {
    return true; // CEO can edit all employees
  }
  if (userRole === ROLES.MANAGER && userDepartmentId === employeeDepartmentId) {
    return true; // Manager can edit employees in their department
  }
  return false;
};

// Check if user can delete employee
export const canDeleteEmployee = (userRole) => {
  return userRole === ROLES.CEO; // Only CEO can delete employees
};

export default {
  ROLES,
  PERMISSIONS,
  hasPermission,
  hasRole,
  getUserPermissions,
  getRoleDisplayName,
  canApproveLeave,
  canViewEmployee,
  canEditEmployee,
  canDeleteEmployee,
};
