# Employee Management System (EMS)

A modern, full-featured web application for managing employees, departments, and attendance with authentication and CRUD operations. Built with React, Material UI, and JSON Server.

## 🎯 Features

### ✅ Authentication Module
- Login with email and password
- Protected routes
- Session management with localStorage
- Demo credentials: `admin@gmail.com` / `123456`

### 📊 Dashboard
- Total employees count
- Total departments count
- Active employees statistics
- Employees on leave count
- Department distribution pie chart
- Monthly joining trends bar chart

### 👥 Employee Management (Full CRUD)
- Add new employees with form validation
- Edit employee details
- Delete employees (with confirmation)
- Search employees by name or email
- Filter by department
- Pagination support
- Employee fields: ID, Name, Email, Phone, Gender, Department, Designation, Salary, Joining Date, Status

### 🏢 Department Management
- Create departments
- Edit department information
- Delete departments
- View department statistics
- Track manager names and employee counts

### 📅 Attendance Management
- Mark daily attendance (Present/Absent/Leave)
- Filter attendance by month
- View attendance records in table format
- Track attendance trends

### 🎨 UI/UX Features
- Professional admin dashboard theme
- Responsive design (mobile, tablet, desktop)
- Sidebar navigation with collapsible menu
- Top navbar with user profile
- Loading spinners
- Form validation and error messages
- Status badges with color coding
- Modern blue and indigo color scheme
- Smooth animations and transitions

## 🧱 Tech Stack

### Frontend
- **React 18** - UI library with functional components
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Hook Form** - Form handling and validation
- **Recharts** - Data visualization (charts)
- **Material UI** - Component library
- **React Icons** - Icon library
- **Tailwind CSS alternative** - Custom CSS styling

### Backend (Mock)
- **JSON Server** - Fake REST API server
- Sample data with employees, departments, and attendance records

## 📁 Project Structure

```
employee-management-system/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── DashboardHeader.js
│   │   ├── StatCard.js
│   │   ├── DepartmentChart.js
│   │   ├── JoiningTrendChart.js
│   │   ├── EmployeeTable.js
│   │   ├── EmployeeForm.js
│   │   ├── DepartmentForm.js
│   │   └── AttendanceForm.js
│   ├── pages/
│   │   ├── Login.js
│   │   ├── Dashboard.js
│   │   ├── Employees.js
│   │   ├── Departments.js
│   │   └── Attendance.js
│   ├── layouts/
│   │   ├── MainLayout.js
│   │   ├── Sidebar.js
│   │   └── Navbar.js
│   ├── services/
│   │   └── apiService.js
│   ├── context/
│   │   └── AuthContext.js
│   ├── routes/
│   │   └── ProtectedRoute.js
│   ├── styles/
│   │   ├── login.css
│   │   ├── dashboard.css
│   │   ├── employees.css
│   │   ├── departments.css
│   │   ├── attendance.css
│   │   ├── layout.css
│   │   └── components.css
│   ├── utils/
│   │   ├── apiClient.js
│   │   └── helpers.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── db.json (JSON Server database)
├── package.json
├── .env
├── .gitignore
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation Steps

1. **Clone or navigate to the project directory:**
```bash
cd c:\myproject\New folder
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start JSON Server (in a new terminal):**
```bash
npm run server
```
This will start the mock API on `http://localhost:5000`

4. **Start React Development Server (in another terminal):**
```bash
npm start
```
The app will open at `http://localhost:3000`

5. **Or run both concurrently (if you have concurrently installed):**
```bash
npm install concurrently --save-dev
npm run dev
```

### Login Credentials
- **Email:** admin@gmail.com
- **Password:** 123456

## 📖 Usage Guide

### Dashboard
- View key statistics on the dashboard
- See department distribution and joining trends
- Monitor active employees and leave status

### Managing Employees
1. Click on **Employees** in the sidebar
2. Click **+ Add Employee** to create a new employee
3. Fill in the form with required details
4. Search employees by name or email
5. Filter by department
6. Edit or delete employees as needed

### Managing Departments
1. Click on **Departments** in the sidebar
2. Click **+ Add Department** to create a new department
3. Manage department information
4. Edit or delete departments

### Tracking Attendance
1. Click on **Attendance** in the sidebar
2. Click **+ Mark Attendance** to record attendance
3. Select employee, date, and status
4. Filter by month to view attendance records
5. Track Present, Absent, and Leave statuses

## 🔒 Authentication & Security

- Login page with form validation
- Auth state stored in localStorage
- Protected routes - redirect to login if not authenticated
- Session management
- Logout functionality

## 🎨 Styling Features

- **Color Scheme:** Blue (#1e3a8a) and Indigo primary colors
- **Responsive Design:** Mobile, tablet, and desktop optimized
- **Animations:** Smooth transitions and fade-ins
- **Card Layout:** Clean card-based UI design
- **Status Badges:** Color-coded status indicators
- **Icons:** Emoji icons for visual appeal

## 📊 API Endpoints (JSON Server)

The app connects to JSON Server mock API:

```
GET    /employees              - Get all employees
GET    /employees/:id          - Get employee by ID
POST   /employees              - Create new employee
PUT    /employees/:id          - Update employee
DELETE /employees/:id          - Delete employee

GET    /departments            - Get all departments
GET    /departments/:id        - Get department by ID
POST   /departments            - Create new department
PUT    /departments/:id        - Update department
DELETE /departments/:id        - Delete department

GET    /attendance             - Get all attendance
GET    /attendance?employeeId=:id - Get employee attendance
POST   /attendance             - Mark attendance
PUT    /attendance/:id         - Update attendance
DELETE /attendance/:id         - Delete attendance

GET    /users                  - Get users for login
```

## 📝 Form Validation

### Employee Form
- Name: Required
- Email: Required, valid email format
- Phone: Required, 10 digits
- Department: Required
- Designation: Required
- Salary: Required
- Joining Date: Required
- Status: Active/Inactive

### Department Form
- Department Name: Required
- Manager Name: Required
- Total Employees: Optional (default 0)

### Attendance Form
- Employee: Required
- Date: Required
- Status: Required (Present/Absent/Leave)

## 🛠️ Configuration

### Environment Variables (.env)
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_NAME=Employee Management System
```

### Modify JSON Server Port
Edit `package.json` script:
```json
"server": "json-server --watch db.json --port 5000"
```

## 🔄 Data Structure

### Employee Object
```javascript
{
  "id": 1,
  "name": "John Doe",
  "email": "john.doe@company.com",
  "phone": "9876543210",
  "gender": "Male",
  "department": "IT",
  "designation": "Senior Developer",
  "salary": 120000,
  "joiningDate": "2022-01-15",
  "status": "Active"
}
```

### Department Object
```javascript
{
  "id": 1,
  "name": "IT",
  "manager": "John Doe",
  "totalEmployees": 5
}
```

### Attendance Object
```javascript
{
  "id": 1,
  "employeeId": 1,
  "date": "2024-01-15",
  "status": "Present"
}
```

## 🚨 Common Issues & Solutions

### Issue: "Cannot find module" error
**Solution:** Run `npm install` to ensure all dependencies are installed

### Issue: JSON Server not running
**Solution:** Make sure port 5000 is not in use. Check with:
```bash
netstat -ano | findstr :5000  (Windows)
lsof -i :5000                 (Mac/Linux)
```

### Issue: API calls failing
**Solution:** Verify JSON Server is running on correct port and .env file is configured properly

### Issue: Login not working
**Solution:** Ensure db.json has the users data and JSON Server is running

## 📦 Building for Production

To create a production build:

```bash
npm run build
```

This will create an optimized build in the `build/` folder.

## 🤝 Contributing

This is a learning project. Feel free to:
- Modify components
- Add new features
- Improve styling
- Enhance validation
- Add more pages

## 📚 Learning Resources

- [React Documentation](https://react.dev)
- [React Router](https://reactrouter.com)
- [Axios](https://axios-http.com)
- [JSON Server](https://github.com/typicode/json-server)
- [Recharts](https://recharts.org)
- [React Hook Form](https://react-hook-form.com)

## 📄 License

This project is created for educational purposes.

## 🎓 Final Year Project Notes

This Employee Management System is designed as a complete solution for a final year project with:

✅ **Well-structured code** with proper separation of concerns
✅ **Reusable components** following React best practices
✅ **Form validation** and error handling
✅ **Clean comments** throughout the code
✅ **Professional UI** with modern design
✅ **Complete CRUD operations** for all modules
✅ **Authentication system** with protected routes
✅ **Responsive design** for all devices
✅ **Sample data** for demonstration
✅ **Comprehensive documentation** (this README)

## 🎯 Future Enhancements

- Export to Excel/PDF functionality
- Advanced filtering and sorting
- Email notifications
- Role-based access control
- Multi-language support
- Dark mode
- Advanced analytics
- Backend integration (Node.js + MongoDB)
- Docker containerization
- Unit and integration tests

---

**Created with ❤️ for modern employee management**

For any questions or issues, refer to the code comments and component documentation.
