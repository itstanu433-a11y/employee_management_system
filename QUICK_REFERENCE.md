# 📋 Quick Reference Guide

## 🎯 Essential Commands

### Installation
```bash
npm install              # Install all dependencies
```

### Running the App
```bash
npm run server          # Start JSON Server (Terminal 1)
npm start               # Start React app (Terminal 2)
npm run dev             # Both servers (needs concurrently)
```

### Building
```bash
npm run build           # Create production build
```

## 📂 Project Structure at a Glance

```
src/
├── components/          ← Reusable UI components
├── pages/              ← Full page components
├── layouts/            ← Layout components (Sidebar, Navbar)
├── services/           ← API and service functions
├── context/            ← React Context (Auth)
├── routes/             ← Route protection logic
├── styles/             ← CSS stylesheets
├── utils/              ← Helper functions
├── App.js              ← Main app component
└── index.js            ← Entry point
```

## 🔑 Key Files

| File | Purpose |
|------|---------|
| `App.js` | Main component with routing |
| `src/context/AuthContext.js` | Authentication state |
| `src/services/apiService.js` | API calls |
| `db.json` | Mock database |
| `.env` | Environment variables |
| `package.json` | Dependencies |

## 🔐 Login Details

**Email:** admin@gmail.com
**Password:** 123456

## 🌐 API Endpoints

```
JSON Server runs on: http://localhost:5000
React App runs on:   http://localhost:3000
```

### Available Resources
- `/employees`
- `/departments`
- `/attendance`
- `/users`

## 📱 Component Overview

### Pages (5 total)
1. **Login.js** - Login page
2. **Dashboard.js** - Statistics & charts
3. **Employees.js** - Employee management
4. **Departments.js** - Department management
5. **Attendance.js** - Attendance tracking

### Components (8 reusable)
1. **DashboardHeader** - Page header
2. **StatCard** - Statistics card
3. **EmployeeTable** - Employee table with pagination
4. **EmployeeForm** - Add/edit employee form
5. **DepartmentForm** - Add/edit department form
6. **AttendanceForm** - Mark attendance form
7. **DepartmentChart** - Pie chart
8. **JoiningTrendChart** - Bar chart

### Layouts
1. **MainLayout** - Main app layout wrapper
2. **Sidebar** - Navigation sidebar
3. **Navbar** - Top navigation bar

## 🛠️ Services & Utilities

### API Services (`apiService.js`)
- `authService` - Login/logout
- `employeeService` - CRUD operations
- `departmentService` - Department operations
- `attendanceService` - Attendance operations

### Utilities (`helpers.js`)
- `formatDate()` - Date formatting
- `formatCurrency()` - Currency formatting
- `validateEmail()` - Email validation
- `validatePhone()` - Phone validation
- `debounce()` - Debounce function

## 🎨 Color Scheme

```
Primary Blue:      #1e3a8a
Secondary Blue:    #1e40af
Green (Active):    #10b981 / #06b6d4
Red (Inactive):    #ef4444
Yellow (Leave):    #f59e0b
Gray (Text):       #64748b
```

## 🔄 Data Flow

```
User Input → Component State → API Service → JSON Server → UI Update
```

## ✨ Key Features

✅ Authentication with localStorage
✅ Protected routes
✅ Form validation
✅ Search & filter
✅ Pagination
✅ Responsive design
✅ Charts & analytics
✅ Modal forms
✅ Status badges
✅ Error handling

## 🚀 Deployment Checklist

- [ ] Install all dependencies
- [ ] Verify .env configuration
- [ ] Test all CRUD operations
- [ ] Check form validations
- [ ] Test on mobile devices
- [ ] Review console for errors
- [ ] Run `npm run build`
- [ ] Deploy build folder

## 📊 Database Schema

### employees table
```
id (int), name, email, phone, gender, 
department, designation, salary, joiningDate, status
```

### departments table
```
id (int), name, manager, totalEmployees
```

### attendance table
```
id (int), employeeId (int), date, status
```

### users table
```
id (int), email, password, name
```

## 🐛 Debug Mode

Enable debug logs (edit `src/utils/apiClient.js`):
```javascript
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response);
    return response;
  }
);
```

## 📦 NPM Scripts

```json
{
  "start": "react-scripts start",
  "build": "react-scripts build",
  "test": "react-scripts test",
  "server": "json-server --watch db.json --port 5000",
  "dev": "concurrently \"npm start\" \"npm run server\""
}
```

## 🎯 Common Customizations

### Change Port
```bash
# Backend: Edit package.json
"server": "json-server --watch db.json --port 8000"

# Frontend: Set in .env
PORT=3001
```

### Add New Page
1. Create file in `src/pages/`
2. Add route in `App.js`
3. Add menu item in `Sidebar.js`

### Add New Component
1. Create file in `src/components/`
2. Import and use in pages
3. Pass props as needed

## 🔗 External Links

- React: https://react.dev
- React Router: https://reactrouter.com
- Axios: https://axios-http.com
- JSON Server: https://github.com/typicode/json-server
- Recharts: https://recharts.org

## ⏱️ Typical Development Workflow

1. **Morning:** Start both servers
2. **Dev Time:** Make code changes (auto-reload)
3. **Testing:** Test in browser
4. **Debug:** Use DevTools (F12)
5. **Commit:** Save changes
6. **Evening:** Stop servers (Ctrl+C)

## 💡 Pro Tips

- Use VS Code Extensions: ES7+ React/Redux/React-Native snippets
- Install React DevTools browser extension
- Use Redux DevTools for debugging
- Keep console open while developing (F12)
- Test responsive design with DevTools

## 🎓 Learning Path

1. Understand folder structure
2. Study `App.js` and routing
3. Review `AuthContext.js` for state management
4. Examine component props flow
5. Review `apiService.js` for API integration
6. Try modifying a component
7. Add a new feature

---

**Version:** 1.0.0  
**Last Updated:** January 2024  
**Status:** ✅ Ready for Development
