# Tally
Tally is a simple, interactive **budget planning tool** that helps users track and visualize their monthly savings, expenditures, and overall financial health. Built using **vanilla HTML, CSS, and JavaScript**, it offers intuitive features to validate, store, and review financial entries — making budgeting easy and visually engaging.

---

## 📌 Features

 ### 📝 Add Monthly Data 
- Click **“Log”** to begin tracking.
- Enter:
  - Month
  - Total balance
  - Savings
  - Expenditure
- Add multiple labeled expense items for better clarity.
- **Validations** ensure:
  - `Balance = Savings + Expenditure`
  - Sum of expense items = Expenditure
- If all inputs are valid, a **summary** is shown immediately.

---

### 🔁 Duplicate Month Handling
If data already exists for the entered month:
- **OK**: Merges new data with the existing entry.
- **Cancel**: Clears form for fresh input.

Merged data updates:
- Savings and expenditure are added.
- Items are appended.
- New summary is shown.
- Input fields reset automatically.

---

### 📊 Dashboard Overview
- Click **“Dashboard”** to view all saved months.
- Each entry is shown as a **card**, containing:
  - Month-Year
  - Total savings & expenditure
  - List of all expense items
  - **Savings percentage**
- **Color indicators**:
  - 🔴 Red: below 15%
  - 🟡 Yellow: 15–30%
  - 🟢 Green: above 30%

---

### 🗑️ Delete Any Entry
- Every card has a ❌ icon to delete that month.
- Deletion updates the dashboard and `localStorage` instantly.

---

### 📄 Download Report as PDF
- Generate a **PDF report** from the dashboard with one click.
- PDF includes:
  - Month
  - Savings, expenditure, and savings %
  - Complete expense breakdown

---

### 💾 Persistent Data
- All data is stored in your browser using `localStorage`.
- Entries remain available across sessions.
- 
---

## 🚀 How to Use

1. **Open the HTML file** in your browser.
2. Click **"Let's Start"** to begin entering monthly data.
3. Fill in:
   - **Month-Year** (choose from date picker)
   - **Current Balance**
   - **Savings**
   - **Expenditure**
   - Add items using **+ Add Item** button
4. Click **"Show Summary"**:
   - If data is valid → summary is shown and saved
   - If errors → app will highlight them for correction
5. Click **"Dashboard"** to review all past months' data.
6. Optionally, click **"Download"** to get a PDF file of all your entries.

---
## 🧠 Tech Stack

- **HTML5**
- **CSS3** (custom styling + responsive design)
- **JavaScript (Vanilla)**
- **jsPDF** library for PDF export
- **localStorage** for persistent client-side data storage

## 🎯 Future Goals

- Convert into a **MERN stack** app
- Add **multi-user login with authentication**
- Add **graphs** and **data filters** for better insights

---

## 📁 Project Structure

├── index.html # Main HTML structure
├── style.css # Styling for layout and components
├── script.js # JavaScript logic and interactivity


---

**⚠️ This project is currently not licensed for reuse.**

---
