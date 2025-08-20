# To-Do App (Next.js + SQLite)

A modern **per-user to-do list application** built with **Next.js 13 (App Router)** and **SQLite**. This app implements authentication, client-side interactivity, and local theme persistence while providing a responsive and user-friendly interface.

---

## Key Features

* **User Authentication**

  * Register and login securely with username and password.
  * Session-based login for individual users.

* **CRUD Operations**

  * Create, read, update, and delete to-dos.
  * Mark tasks as completed or pending.
  * Update titles, descriptions, and due dates.

* **Sorting & Filtering**

  * Filter by search text (title or description).
  * Sort tasks by creation date, alphabetical order, or due date.

* **Form Validation**

  * Client-side validation for empty fields.
  * Dynamic error messages (e.g., “Username is taken”, “Password must be at least 6 characters”, “User does not exist”, “Wrong password”).
  * Visual feedback: input borders turn red when validation fails.

* **Theming**

  * Light/Dark mode toggle persisted in `localStorage`.
  * Smooth transitions between themes.

* **Responsive & Accessible**

  * Fully responsive layout for desktops and mobile devices.
  * Keyboard-accessible forms and buttons.

* **Modern Tech Stack**

  * **Next.js 13** (App Router, Server & Client Components)
  * **SQLite** (per-user database storage)
  * **TypeScript** (type safety)
  * **Zod** for validation
  * React hooks for client-side interactivity

---

## Screenshots

*(Add screenshots of login, dashboard, sorting/filtering, and theme toggle here)*

---

## Project Structure

```
src/
├─ app/   
│  ├─ dashboard/page.tsx       
│  ├─ global.css                
│  ├─ page.tsx                  
│  ├─ layout.tsx               
├─ components/
│  ├─ TodoItem.tsx             
│  ├─ SortFilterBar.tsx         
│  ├─ ThemeToggle.tsx     
│  ├─ AuthForm.tsx             
├─ lib/
│  ├─ db.ts                    
│  ├─ todosDb.ts              
│  ├─ auth.ts                  
│  ├─ validation.ts           
│  ├─ paths.ts                  
```

---

## Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/todo-next-sqlite.git
cd todo-next-sqlite
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Run the development server**

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Usage

1. **Register a new account** or login with existing credentials.
2. **Add a new to-do** by entering a title, description, and optional due date.
3. **Sort and filter** tasks using the top bar.
4. **Toggle completion** with the checkbox, edit details, or delete tasks.
5. **Switch themes** using the theme toggle button in the header.

---

## Future Improvements

* Add **user avatars** and profile management.
* Enable **drag-and-drop** reordering of to-dos.
* Integrate **reminders/notifications** for due tasks.
* Add **tags/categories** for better organization.
