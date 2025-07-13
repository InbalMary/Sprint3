
# Appsus

Appsus is a unified productivity web application that combines three essential tools:  
- **Mail**: An email client  
- **Notes**: A note-taking app  
- **Books**: An online bookstore

## Features

### 📧 Mail App
- Manage your inbox with smart organization tools
- Mark emails as read/unread, starred, or remove them
- Reply to emails and save emails as notes
- Label and filter emails

### 📝 Notes App
- Create, edit, pin, archive, and bin notes
- Support for text, lists, images, and videos in notes
- Color customization and search/filtering
- Restore or permanently delete notes from the bin

### 📚 Books App
- Browse, search, and view book details
- Add, edit, and remove books
- Add reviews to books
- Visualize book categories with charts

## Project Structure

```
RootCmp.jsx
app.js
index.html
assets/
  css/
  icons/
cmps/
  AppHeader.jsx
  LabelPicker.jsx
  UserMsg.jsx
apps/
  mail/
    cmps/
    pages/
    services/
  note/
    cmps/
    pages/
    services/
  books/
    cmps/
    pages/
    services/
lib/
  (React, Babel, Router, etc.)
pages/
  About.jsx
  Home.jsx
services/
  async-storage.service.js
  event-bus.service.js
  util.service.js
```

## Getting Started

1. **Install dependencies**  
   This project uses CDN scripts for React and Babel, so no npm install is required for running.

2. **Run the app**  
   Open `index.html` in your browser.  
   The app uses `HashRouter` for client-side routing.

3. **Development**  
   - Source code is in JSX and ES6 modules, compiled in-browser using Babel.
   - Main entry point: [`app.js`](app.js)
   - Routing and main layout: [`RootCmp.jsx`](RootCmp.jsx)

## Styling

- Main styles are in [`assets/css/main.css`](assets/css/main.css)
- Each app and component has its own CSS file imported in `main.css`

## Notable Files

- **Mail Service**: [`apps/mail/services/mail.service.js`](apps/mail/services/mail.service.js)
- **Note Service**: [`apps/note/services/note.service.js`](apps/note/services/note.service.js)
- **Book Service**: [`apps/books/services/book.service.js`](apps/books/services/book.service.js)
- **App Header**: [`cmps/AppHeader.jsx`](cmps/AppHeader.jsx)
- **User Messages**: [`cmps/UserMsg.jsx`](cmps/UserMsg.jsx)

---

**Enjoy using Appsus!**