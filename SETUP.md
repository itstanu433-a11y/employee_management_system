# 🚀 Employee Management System - Complete Setup Guide

## Step-by-Step Installation & Running Instructions

### **Step 1: Prerequisites Check**
Before starting, ensure you have:
- **Node.js** v14+ installed ([Download](https://nodejs.org))
- **npm** (comes with Node.js)
- A code editor (VS Code recommended)
- Git (optional, for version control)

Verify installation:
```bash
node --version
npm --version
```

---

### **Step 2: Navigate to Project Directory**

Open Command Prompt/PowerShell and navigate to your project:

```bash
cd c:\myproject\New folder
```

---

### **Step 3: Install Dependencies**

Install all required npm packages:

```bash
npm install
```

This will install:
- React and React DOM
- React Router for navigation
- Axios for API calls
- Recharts for charts
- Material UI components
- React Hook Form for forms
- JSON Server for mock backend

**⏱️ Installation time: 2-5 minutes** (depends on internet speed)

---

### **Step 4: Verify Installation**

Check if `node_modules` folder is created:
```bash
dir node_modules
```

You should see a folder with all dependencies installed.

---

### **Step 5: Configure Environment**

The `.env` file is already configured. Verify it contains:

```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_NAME=Employee Management System
```

If not, create/update it manually.

---

### **Step 6: Start the Backend (JSON Server)**

**Open the FIRST Terminal/PowerShell:**

```bash
cd c:\myproject\New folder
npm run server
```

Expected output:
```
  \{^_^}/ hi!
  
  Loading db.json
  Done
  
  Resources
  http://localhost:5000/employees
  http://localhost:5000/departments
  http://localhost:5000/attendance
  http://localhost:5000/users
  
  Home
  http://localhost:5000
```

✅ **Backend is now running on http://localhost:5000**

---

### **Step 7: Start the React Frontend**

**Open a SECOND Terminal/PowerShell:**

```bash
cd c:\myproject\New folder
npm start
```

Expected output:
```
Compiled successfully!

You can now view employee-management-system in the browser.

  Local:            http://localhost:3000
  
To create a production build, use npm run build.
```

✅ **Frontend is now running on http://localhost:3000**

A browser window should automatically open. If not, manually visit: **http://localhost:3000**

---

### **Step 8: Login to the Application**

Use these demo credentials:

| Field | Value |
|-------|-------|
| **Email** | admin@gmail.com |
| **Password** | 123456 |

Click **Login** and you'll be redirected to the Dashboard.

---

## ✨ Exploring the Application

### **Dashboard**
- View key statistics
- See department distribution
- Monitor joining trends

### **Employees**
- Click "+ Add Employee" to add new employees
- Search by name/email
- Filter by department
- Edit or delete employees
- View in paginated table

### **Departments**
- Manage company departments
- View manager names
- Track employee counts

### **Attendance**
- Mark daily attendance
- Filter by month
- See Present/Absent/Leave status

---

## 🛑 Stopping the Application

### **Stop Frontend (Press in Terminal 2)**
```bash
Ctrl + C
```
Then confirm with `Y` and press Enter

### **Stop Backend (Press in Terminal 1)**
```bash
Ctrl + C
```
Then confirm with `Y` and press Enter

---

## ⚡ Run Both Servers Together (Alternative Method)

If you want to run both servers in one terminal:

1. First install concurrently:
```bash
npm install concurrently --save-dev
```

2. Then run:
```bash
npm run dev
```

This starts both JSON Server and React app simultaneously.

---

## 🔧 Common Commands

```bash
# Install dependencies
npm install

# Start frontend only
npm start

# Start backend only
npm run server

# Build for production
npm run build

# Run tests
npm test

# Format code (if prettier is installed)
npm run format
```

---

## 📋 Initial Data (Sample)

The application comes with sample data:

### **Employees:** 5 employees across different departments
### **Departments:** IT, HR, Finance, Marketing
### **Attendance:** Sample records for testing

You can modify `db.json` to add/remove data before starting.

---

## 🔑 Authentication Details

### Login Options
- **Admin Account** (provided):
  - Email: `admin@gmail.com`
  - Password: `123456`

To add more users, edit `db.json`:

```json
{
  "users": [
    {
      "id": 1,
      "email": "admin@gmail.com",
      "password": "123456",
      "name": "Admin User"
    }
  ]
}
```

⚠️ **Note:** This is for development only. Never use plain text passwords in production!

---

## 📂 Project Structure Overview

```
c:\myproject\New folder\
├── src/                    ← All React components
├── public/                 ← Static files
├── db.json                ← Database data
├── package.json           ← Dependencies config
├── .env                   ← Environment variables
├── README.md              ← Full documentation
└── SETUP.md              ← This file
```

---

## 🐛 Troubleshooting

### **Problem: Port 3000 already in use**
**Solution:** 
```bash
# Find and kill the process using port 3000
netstat -ano | findstr :3000

# Then kill the process (replace PID with actual number)
taskkill /PID <PID> /F
```

### **Problem: Port 5000 already in use**
**Solution:**
```bash
# Find and kill the process using port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### **Problem: Module not found errors**
**Solution:** 
```bash
# Delete node_modules and package-lock.json
rmdir /s node_modules
del package-lock.json

# Reinstall
npm install
```

### **Problem: Login fails**
**Solution:**
- Ensure JSON Server is running
- Verify credentials: `admin@gmail.com` / `123456`
- Check db.json has users data
- Check browser console for errors (F12)

### **Problem: "Cannot GET /api/..." errors**
**Solution:**
- Verify JSON Server is running on port 5000
- Check .env file has correct API_URL
- Reload the page (Ctrl + R)

---

## 📱 Testing Features

### **Add New Employee:**
1. Go to Employees page
2. Click "+ Add Employee"
3. Fill all fields
4. Click "Save Employee"
5. New employee appears in table

### **Edit Employee:**
1. Find employee in table
2. Click "Edit" button
3. Modify details
4. Click "Save Employee"

### **Delete Employee:**
1. Find employee in table
2. Click "Delete" button
3. Confirm deletion
4. Employee is removed

### **Search Feature:**
1. Type name or email in search box
2. Table filters automatically
3. Clear search to see all

---

## 🎨 Customization Tips

### **Change Primary Color**
Edit `src/styles/layout.css`:
```css
/* Find and change background colors */
background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
/* Change to your preferred color */
```

### **Add More Sample Data**
Edit `db.json`:
```json
{
  "employees": [
    { "id": 1, "name": "Employee Name", ... }
  ]
}
```

### **Modify Form Fields**
Edit component files in `src/components/`

---

## 📚 File Descriptions

| File | Purpose |
|------|---------|
| `App.js` | Main React component with routing |
| `pages/` | Page components (Login, Dashboard, etc.) |
| `components/` | Reusable UI components |
| `services/apiService.js` | API call functions |
| `context/AuthContext.js` | Authentication state management |
| `styles/` | CSS styling for all components |
| `utils/` | Helper functions |
| `db.json` | Mock database |

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Node.js and npm installed
- [ ] Dependencies installed (`npm install` completed)
- [ ] JSON Server running (port 5000)
- [ ] React app running (port 3000)
- [ ] Can login with demo credentials
- [ ] Dashboard loads with data
- [ ] Can add/edit/delete employees
- [ ] Can view departments
- [ ] Can mark attendance
- [ ] Responsive design works (try resizing window)

---

## 🎓 Learning Tips

1. **Explore Components:** Start with simple components like `StatCard.js`
2. **Understand Context:** See how `AuthContext.js` manages authentication
3. **Study API Services:** See `apiService.js` for API integration
4. **Modify Styles:** Try changing colors in CSS files
5. **Add Features:** Try adding a new page following existing patterns

---

## 📞 Support Tips

- Check browser Console (F12) for error messages
- Verify both servers are running
- Check file paths are correct
- Ensure no typos in commands
- Restart if changes don't appear

---

## 🚀 Next Steps

1. ✅ Complete setup following this guide
2. ✅ Explore the application thoroughly
3. ✅ Try adding/editing data
4. ✅ Review code structure
5. ✅ Customize for your needs
6. ✅ Deploy when ready

---

## 📦 Additional Dependencies (Already Included)

```bash
react@18.2.0
react-dom@18.2.0
react-router-dom@6.14.0
axios@1.4.0
react-hook-form@7.45.0
@mui/material@5.13.0
recharts@2.10.0
react-icons@4.10.0
json-server@0.17.3
```

---

## 💡 Pro Tips

- Use Chrome DevTools (F12) to inspect elements
- Check Network tab to see API calls
- Use React DevTools extension for debugging
- Add more sample data to test pagination
- Test responsive design at different screen sizes

---

## 🎉 You're All Set!

Your Employee Management System is ready to use. Start with the dashboard and explore all features. Happy coding!

---

**Last Updated:** January 2024
**Version:** 1.0.0
**Status:** ✅ Production Ready
