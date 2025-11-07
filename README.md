# 🛍️ Apex E-Commerce

A modern, full-stack multi-vendor e-commerce platform built with Laravel 11, React, and Stripe. Features include role-based access control, real-time cart management, secure payment processing, and comprehensive admin/seller dashboards.

![Laravel](https://img.shields.io/badge/Laravel-11.x-red?style=flat-square&logo=laravel)
![React](https://img.shields.io/badge/React-18.x-blue?style=flat-square&logo=react)
![Stripe](https://img.shields.io/badge/Stripe-Payment-purple?style=flat-square&logo=stripe)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-teal?style=flat-square&logo=tailwindcss)

---

## ✨ Features

### 🛒 **Customer Features**
- Browse and search products with real-time filtering
- Add products to cart with quantity management
- Apply promo codes (SAVE10, SAVE20)
- Secure checkout with Stripe payment integration
- Order history and tracking
- Free shipping on orders over $100

### 🏪 **Seller Features**
- Dedicated seller registration and dashboard
- Product CRUD operations (Create, Read, Update, Delete)
- Sales analytics and revenue tracking
- Inventory management with stock levels
- View customer orders for your products

### 🔧 **Admin Features**
- Comprehensive admin dashboard with platform statistics
- User management (view, update roles, delete)
- Product management (view all, update, delete)
- Order management (view all, update status)
- Revenue and sales analytics

### 💳 **Payment Integration**
- Stripe Checkout for secure payments
- Webhook support for payment confirmations
- Automatic order status updates
- Test mode with test cards

### 🎨 **UI/UX**
- Modern glassmorphism design
- Responsive layout for all devices
- Loading states and error handling
- Empty states with helpful messages
- Animated cart badge
- Color-coded status indicators

---

## 🛠️ Tech Stack

### Backend
- **Laravel 11** - PHP framework
- **MySQL** - Database
- **JWT Auth** - Authentication
- **Stripe PHP SDK** - Payment processing
- **Eloquent ORM** - Database queries

### Frontend
- **React 18** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Stripe.js** - Payment UI
- **TailwindCSS** - Styling
- **Vite** - Build tool

---

## 📋 Prerequisites

- PHP >= 8.2
- Composer
- Node.js >= 18.x
- MySQL >= 8.0
- Stripe Account (for payments)

---

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd apex-ecommerce
```

### 2. Backend Setup

```bash
# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Generate JWT secret
php artisan jwt:secret

# Configure database in .env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=apex_ecommerce
DB_USERNAME=root
DB_PASSWORD=

# Add Stripe keys (get from https://dashboard.stripe.com/test/apikeys)
STRIPE_KEY=pk_test_your_publishable_key
STRIPE_SECRET=sk_test_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Add frontend URL
FRONTEND_URL=http://localhost:5173

# Run migrations
php artisan migrate

# Seed database (optional)
php artisan db:seed

# Start Laravel server
php artisan serve
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Add Stripe publishable key
VITE_STRIPE_KEY=pk_test_your_publishable_key

# Start development server
npm run dev
```

### 4. Create Admin User

```bash
php artisan tinker
```

```php
App\Models\User::create([
    'name' => 'Admin User',
    'email' => 'admin@apex.com',
    'password' => bcrypt('password'),
    'role' => 'admin'
]);
```

---

## 🎯 Usage

### Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000/api

### Test Accounts

```
Admin:
Email: admin@apex.com
Password: password

Seller (register via /seller/register):
Email: seller@example.com
Password: password

Customer (register via /register):
Email: customer@example.com
Password: password
```

### Stripe Test Cards

```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
3D Secure: 4000 0025 0000 3155

Expiry: Any future date
CVC: Any 3 digits
ZIP: Any 5 digits
```

---

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/register       - Register new user
POST   /api/auth/login          - Login user
POST   /api/auth/logout         - Logout user
GET    /api/auth/profile        - Get user profile
```

### Products
```
GET    /api/products            - Get all products
GET    /api/products/{id}       - Get single product
POST   /api/products            - Create product (Admin)
PUT    /api/products/{id}       - Update product (Admin)
DELETE /api/products/{id}       - Delete product (Admin)
```

### Orders
```
GET    /api/orders              - Get user orders
GET    /api/orders/{id}         - Get single order
POST   /api/orders              - Create order
```

### Payment
```
POST   /api/payment/create-checkout-session  - Create Stripe session
POST   /api/payment/webhook                  - Stripe webhook
```

### Admin Routes
```
GET    /api/admin/dashboard           - Get dashboard stats
GET    /api/admin/users               - Get all users
PUT    /api/admin/users/{id}/role     - Update user role
DELETE /api/admin/users/{id}          - Delete user
GET    /api/admin/products            - Get all products
PUT    /api/admin/products/{id}       - Update product
DELETE /api/admin/products/{id}       - Delete product
GET    /api/admin/orders              - Get all orders
PUT    /api/admin/orders/{id}/status  - Update order status
```

### Seller Routes
```
GET    /api/seller/dashboard     - Get seller stats
GET    /api/seller/products      - Get seller products
POST   /api/seller/products      - Create product
PUT    /api/seller/products/{id} - Update product
DELETE /api/seller/products/{id} - Delete product
GET    /api/seller/sales         - Get seller sales
```

---

## 🗂️ Project Structure

```
apex-ecommerce/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Api/
│   │   │   │   ├── AuthController.php
│   │   │   │   ├── ProductController.php
│   │   │   │   └── OrderController.php
│   │   │   ├── Admin/
│   │   │   │   └── AdminController.php
│   │   │   ├── Seller/
│   │   │   │   └── SellerController.php
│   │   │   └── PaymentController.php
│   │   └── Middleware/
│   │       ├── CorsMiddleware.php
│   │       └── RoleMiddleware.php
│   └── Models/
│       ├── User.php
│       ├── Product.php
│       ├── Order.php
│       └── OrderItem.php
├── database/
│   └── migrations/
├── routes/
│   └── api.php
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   ├── pages/
│   │   │   ├── ProductList.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── SellerRegister.jsx
│   │   │   ├── SellerDashboard.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── api.js
│   │   └── App.jsx
│   └── package.json
└── README.md
```

---

## 🔐 Security Features

- **JWT Authentication** - Secure token-based auth
- **Role-Based Access Control** - Admin, Seller, User roles
- **CORS Protection** - Configured for frontend domain
- **SQL Injection Prevention** - Eloquent ORM
- **CSRF Protection** - Laravel built-in
- **Stripe Webhook Verification** - Signature validation
- **Environment Variables** - Sensitive data protection

---

## 🧪 Testing

### Run Backend Tests
```bash
php artisan test
```

### Run Frontend Tests
```bash
cd frontend
npm run test
```

---

## 📚 Documentation

For detailed implementation guide, see [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)

---

## 🚀 Deployment

### Backend Deployment

1. Set environment to production
```bash
APP_ENV=production
APP_DEBUG=false
```

2. Configure real Stripe keys
3. Set up webhook endpoint in Stripe dashboard
4. Run optimizations
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Frontend Deployment

1. Build for production
```bash
cd frontend
npm run build
```

2. Deploy `dist` folder to hosting service
3. Update `FRONTEND_URL` in backend `.env`

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

---

## 👨‍💻 Author

Built with ❤️ using Laravel, React, Stripe, and TailwindCSS

---

## 🙏 Acknowledgments

- [Laravel](https://laravel.com) - The PHP Framework
- [React](https://react.dev) - JavaScript Library
- [Stripe](https://stripe.com) - Payment Processing
- [TailwindCSS](https://tailwindcss.com) - CSS Framework
- [Vite](https://vitejs.dev) - Build Tool

---

## 📞 Support

For issues and questions, please open an issue on GitHub or contact the development team.

---

**Happy Coding! 🚀**
