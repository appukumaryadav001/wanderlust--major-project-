# 🏕️ Wanderlust

An Airbnb-inspired full stack web application where users can create, browse, and review travel listings.

---

## 🚀 Features

- **User Authentication** — Signup, Login, Logout using Session
- **Listings** — Create, Read, Update, Delete listings with image upload
- **Reviews** — Add and delete reviews on listings
- **Authorization** — Only listing/review owner can update or delete
- **Image Upload** — Images stored on Cloudinary via Multer
- **Pagination** — Listings displayed with page navigation
- **Flash Messages** — Success and error notifications
- **Default Image** — Fallback image if no image uploaded

---

## 🛠️ Tech Stack

| Technology | Usage |
|---|---|
| Node.js | Runtime |
| Express.js | Web Framework |
| MongoDB | Database |
| Mongoose | ODM |
| EJS + EJS-Mate | Templating Engine |
| Express-Session | Authentication |
| Connect-Mongo | Session Store in MongoDB |
| Bcrypt | Password Hashing |
| Multer | File Upload |
| Cloudinary | Cloud Image Storage |
| Connect-Flash | Flash Messages |
| Method-Override | PUT/DELETE from forms |

---

## 📁 Project Structure

```
wanderlust/
├── public/
│   ├── CSS/
│   ├── js/
│   └── images/
├── src/
│   ├── controllers/
│   │   ├── listing.controller.js
│   │   ├── review.controller.js
│   │   └── user.controller.js
│   ├── models/
│   │   ├── listing.model.js
│   │   ├── review.model.js
│   │   └── user.model.js
│   ├── routes/
│   │   ├── listing.route.js
│   │   ├── review.route.js
│   │   └── user.route.js
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── multer.middleware.js
│   │   └── error.middleware.js
│   ├── utils/
│   │   ├── ApiError.js
│   │   ├── cloudinary.js
│   │   └── wrapAsync.js
│   ├── db/
│   │   └── config.db.js
│   ├── app.js
│   └── index.js
└── views/
    ├── layouts/
    ├── includes/
    ├── listings/
    └── users/
```

---

## 🔗 API Routes

### User Routes — `/user`

| Method | Route | Description | Auth Required |
|---|---|---|---|
| GET | `/user/signup` | Signup page | No |
| POST | `/user/signup` | Create account | No |
| GET | `/user/login` | Login page | No |
| POST | `/user/login` | Login user | No |
| POST | `/user/logout` | Logout user | Yes |

### Listing Routes — `/listing`

| Method | Route | Description | Auth Required |
|---|---|---|---|
| GET | `/listing` | All listings (with pagination) | No |
| POST | `/listing` | Create new listing | Yes |
| GET | `/listing/new-listing` | New listing form | Yes |
| GET | `/listing/:listingId` | Show listing | No |
| PUT | `/listing/:listingId` | Update listing | Yes (Owner only) |
| DELETE | `/listing/:listingId` | Delete listing | Yes (Owner only) |
| GET | `/listing/:listingId/edit` | Edit listing form | Yes (Owner only) |

### Review Routes — `/listing/:listingId/review`

| Method | Route | Description | Auth Required |
|---|---|---|---|
| POST | `/listing/:listingId/review` | Add review | Yes |
| DELETE | `/listing/:listingId/review/:reviewId` | Delete review | Yes (Owner only) |

---

## ⚙️ How to Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/wanderlust.git
cd wanderlust
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env` file

```env
MONGO_URL=your_mongodb_url
SESSION_SECRET=your_session_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=8080
```

### 4. Run the server

```bash
# Development
npm run dev

# Production
npm start
```

### 5. Open in browser

```
http://localhost:8080
```

---

## 🔐 Authentication Flow

```
User Signup → Password hashed with bcrypt → Saved in DB
User Login  → Password verified → Session created → userId stored in session
Protected Routes → isLoggedIn middleware checks session
User Logout → Session destroyed
```

---

## 👤 Author

**Appu Kumar Yadav**
