# Employee Management System - User Guide

## 🎯 Quick Navigation

| Feature | Location | Action |
|---------|----------|--------|
| Dashboard | Menu > Dashboard | View statistics & charts |
| Employees | Menu > Employees | Manage all employees |
| Departments | Menu > Departments | Manage departments |
| Attendance | Menu > Attendance | Track attendance |
| Logout | Menu > Logout | Exit application |

---

## 📊 Dashboard Features

### Statistics Cards
- **Total Employees:** Count of all employees in system
- **Total Departments:** Count of departments
- **Active Employees:** Count of active status employees
- **On Leave:** Count of employees on leave

### Charts
- **Pie Chart:** Department-wise employee distribution
- **Bar Chart:** Monthly employee joining trends

---

## 👥 Employee Management Guide

### Adding an Employee

1. Click **Employees** in sidebar
2. Click **+ Add Employee** button
3. Fill in the form:
   - **Name** (Required)
   - **Email** (Required - valid format)
   - **Phone** (Required - 10 digits)
   - **Gender** (Select: Male/Female/Other)
   - **Department** (Select from list)
   - **Designation** (Required)
   - **Salary** (Required - numeric)
   - **Joining Date** (Required - date picker)
   - **Status** (Select: Active/Inactive)
4. Click **Save Employee**
5. New employee appears in the table

### Searching Employees

1. Use search box: Type name or email
2. Results filter in real-time
3. Clear search to see all employees

### Filtering by Department

1. Click department dropdown
2. Select a department
3. Table shows only that department's employees
4. Combine with search for advanced filtering

### Editing an Employee

1. Find employee in table
2. Click **Edit** button
3. Modify required fields
4. Click **Save Employee**
5. Changes reflected immediately

### Deleting an Employee

1. Find employee in table
2. Click **Delete** button
3. Confirm deletion in popup
4. Employee removed from system

### Pagination

- Results show 10 employees per page
- Navigate using **Previous** and **Next** buttons
- Current page indicator shown

---

## 🏢 Department Management Guide

### Adding a Department

1. Click **Departments** in sidebar
2. Click **+ Add Department** button
3. Fill in:
   - **Department Name** (Required)
   - **Manager Name** (Required)
   - **Total Employees** (Optional)
4. Click **Save Department**

### Viewing Departments

- Cards layout showing all departments
- Each card displays:
  - Department name
  - Manager name
  - Total employees
  - Edit and Delete buttons

### Editing a Department

1. Find department card
2. Click **Edit** button
3. Update information
4. Click **Save Department**

### Deleting a Department

1. Find department card
2. Click **Delete** button
3. Confirm deletion
4. Department removed

---

## 📅 Attendance Management Guide

### Marking Attendance

1. Click **Attendance** in sidebar
2. Click **+ Mark Attendance** button
3. Select:
   - **Employee** (Select from list)
   - **Date** (Date picker - defaults to today)
   - **Status** (Present/Absent/Leave)
4. Click **Mark Attendance**

### Viewing Attendance Records

- Table shows all attendance records
- Columns: Employee Name, Date, Status
- Status badges color-coded:
  - 🟢 Green = Present
  - 🔴 Red = Absent
  - 🟡 Yellow = Leave

### Filtering by Month

1. Use month picker: Select month/year
2. Table updates to show that month's records
3. Navigate months to see different periods

### Status Indicators

- **Present:** Green badge
- **Absent:** Red badge
- **Leave:** Yellow badge

---

## 🔐 User Account Management

### Logging In

1. Enter email: `admin@gmail.com`
2. Enter password: `123456`
3. Click **Login**
4. Redirected to Dashboard

### User Profile

- Located in top-right navbar
- Shows user's name and email
- Profile avatar with first letter

### Logging Out

1. Click **Logout** in sidebar
2. Redirected to login page
3. All session data cleared

---

## 🎨 UI Features Explained

### Sidebar Navigation
- **Blue theme** with white text
- **Collapsible menu** for space saving
- **Smooth animations** when navigating
- **Responsive design** adapts to screen size

### Main Navbar
- Shows application name
- Displays user profile
- Located at top of dashboard

### Status Badges
- Color-coded for quick identification
- Different colors for different statuses
- Found in employee status columns

### Loading States
- Spinner shows during data fetch
- Prevents duplicate submissions
- Indicates background operations

### Modals/Forms
- Overlay design for better focus
- Validation errors shown immediately
- Cancel button to close without saving

---

## 💾 Data Management

### Saving Data

- All data saved to JSON Server database
- Changes persist after page refresh
- No manual save required

### Data Types

| Field | Type | Example |
|-------|------|---------|
| ID | Number | 1 |
| Name | Text | John Doe |
| Email | Email | john@company.com |
| Phone | Number | 9876543210 |
| Salary | Number | 120000 |
| Date | Date | 2024-01-15 |
| Status | Dropdown | Active |

---

## ⚠️ Important Notes

- **Session:** Automatically logs out if inactive
- **Data:** JSON Server stores in `db.json` file
- **Credentials:** Demo account only - no real authentication
- **Offline:** Works only when JSON Server is running
- **Permissions:** Currently single-role system

---

## 🎓 Tips for Effective Usage

1. **Search:** Use search before scrolling large lists
2. **Filter:** Combine search and department filter
3. **Verify:** Double-check phone numbers (10 digits)
4. **Backup:** Export important data regularly
5. **Organize:** Use consistent department naming

---

## 📱 Mobile Access

- Application is responsive
- Works on tablets and phones
- Touch-friendly buttons
- Sidebar collapses on small screens
- Tables scroll horizontally on mobile

---

## 🔄 Common Workflows

### Add New Employee

```
Employees → + Add Employee → Fill Form → Save → ✅ Done
```

### Search for Employee

```
Employees → Search Box → Type Name → ✅ Filtered Results
```

### Track Monthly Attendance

```
Attendance → Month Picker → Select Month → ✅ View Records
```

### Manage Department

```
Departments → Find Department → Edit/Delete → ✅ Update
```

---

## ✅ Quick Checklist

Before submitting data, verify:

- [ ] All required fields filled
- [ ] Email format is correct
- [ ] Phone number is 10 digits
- [ ] Department is selected
- [ ] Salary is numeric
- [ ] Date format is correct
- [ ] Status is selected

---

## 🆘 Getting Help

### Common Issues

**Q: Can't login?**
- A: Verify credentials: admin@gmail.com / 123456

**Q: Can't add employee?**
- A: Check all required fields are filled correctly

**Q: Can't see updated data?**
- A: Refresh page (Ctrl + R) or logout and login

**Q: Missing employees?**
- A: Check department filter or search box

---

## 🎯 Best Practices

1. ✅ Use meaningful names for departments
2. ✅ Keep email addresses consistent
3. ✅ Update attendance regularly
4. ✅ Archive inactive employees
5. ✅ Back up important data

---

## 📞 Support

For technical issues:
1. Check browser console (F12)
2. Verify JSON Server is running
3. Try refreshing page
4. Clear browser cache
5. Restart both servers

---

**Happy Managing! 🎉**

For more details, see README.md and SETUP.md
