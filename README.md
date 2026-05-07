# FindPG 🏠

FindPG is a full-stack web application that helps users find and book Paying Guest (PG) accommodations easily. It provides a platform for customers to search PG listings and for owners to manage their properties and bookings efficiently.

## 🚀 Features

### User Features
- User registration and login authentication
- Browse available PG listings
- View PG details (price, amenities, location, images)
- Book PG accommodations
- Track booking history

### Owner Features
- Owner registration and login
- Add new PG listings
- Edit and delete PG properties
- Manage bookings
- View owner dashboard analytics

### Authentication & Security
- JWT authentication
- Role-based access control (User / Owner)
- Protected routes
- Secure API access

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios
- React Router DOM

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt.js

## 📂 Project Structure

```bash
FindPG/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── server.js
│
└── README.md
```

## ⚙️ Installation

### Clone Repository
```bash
git clone https://github.com/your-username/findpg.git
cd findpg
```

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🔑 Environment Variables

Create a `.env` file inside backend folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

## API Endpoints

### Auth Routes
- POST `/api/auth/register`
- POST `/api/auth/login`

### PG Routes
- GET `/api/pgs`
- POST `/api/pgs`
- PUT `/api/pgs/:id`
- DELETE `/api/pgs/:id`

### Booking Routes
- POST `/api/bookings`
- GET `/api/bookings`

## Future Enhancements
- Payment gateway integration
- Google Maps location support
- Reviews and ratings
- Wishlist feature
- Admin dashboard
  
## Deployment
- Frontend: Vercel
- Backend: Render

## Author
** Sambit **
- GitHub: https://github.com/SambitKumar28

---

Made with ❤️ using MERN Stack
