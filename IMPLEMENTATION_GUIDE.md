# Apex E-Commerce - Complete Implementation Guide

## 🎉 Features Implemented

### 1. **Stripe Payment Integration**
- Full Stripe Checkout integration
- Secure payment processing
- Webhook support for payment confirmation
- Automatic order status updates

### 2. **Multi-Role System**
- **User** - Regular customers
- **Seller** - Product vendors
- **Admin** - Platform administrators

### 3. **Admin Dashboard**
Complete platform management:
- View dashboard statistics (users, sellers, products, orders, revenue)
- User management (view, update roles, delete)
- Product management (view all, update, delete)
- Order management (view all, update status)

### 4. **Seller Dashboard**
Vendor management interface:
- View seller statistics (products, sales, revenue)
- Product CRUD operations (create, read, update, delete)
- View sales and orders
- Track revenue

### 5. **Enhanced Features**
- Product search and filtering
- Promo code system (SAVE10, SAVE20)
- Cart badge with item count
- Free shipping on orders > $100
- Modern UI with Tailwind CSS
- Loading states and error handling
- Empty states for better UX

---

## 🔧 Backend Setup

### Database Migrations
```bash
php artisan migrate
```

**New Tables/Columns:**
- `users.role` - User role (user/seller/admin)
- `products.seller_id` - Foreign key to users table

### Stripe Configuration

1. Get your Stripe keys from https://dashboard.stripe.com/test/apikeys

2. Update `.env`:
```env
STRIPE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

3. For frontend, add to `.env`:
```env
VITE_STRIPE_KEY=pk_test_your_publishable_key_here
```

### Create Admin User
```bash
php artisan tinker
```
```php
$admin = App\Models\User::create([
    'name' => 'Admin User',
    'email' => 'admin@apex.com',
    'password' => bcrypt('password'),
    'role' => 'admin'
]);
```

---

## 📡 API Endpoints

### Authentication
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/profile
```

**Register with Role:**
```json
{
  "name": "Seller Name",
  "email": "seller@example.com",
  "password": "password",
  "role": "seller"
}
```

### Public Routes
```
GET /api/products
GET /api/products/{id}
```

### User Routes (Authenticated)
```
GET  /api/orders
POST /api/orders
POST /api/payment/create-checkout-session
```

### Admin Routes (Admin Only)
```
GET    /api/admin/dashboard
GET    /api/admin/users
PUT    /api/admin/users/{id}/role
DELETE /api/admin/users/{id}
GET    /api/admin/products
PUT    /api/admin/products/{id}
DELETE /api/admin/products/{id}
GET    /api/admin/orders
PUT    /api/admin/orders/{id}/status
```

### Seller Routes (Seller/Admin)
```
GET    /api/seller/dashboard
GET    /api/seller/products
POST   /api/seller/products
PUT    /api/seller/products/{id}
DELETE /api/seller/products/{id}
GET    /api/seller/sales
```

### Stripe Webhook
```
POST /api/payment/webhook
```

---

## 💳 Stripe Payment Flow

### 1. Customer Places Order
```javascript
// Frontend creates order first
const orderResponse = await api.post('/orders', { items });
const orderId = orderResponse.data.id;

// Then creates Stripe checkout session
const sessionResponse = await api.post('/payment/create-checkout-session', {
  order_id: orderId
});

// Redirect to Stripe
window.location.href = sessionResponse.data.url;
```

### 2. Stripe Processes Payment
- Customer completes payment on Stripe's secure page
- Stripe sends webhook to `/api/payment/webhook`
- Order status automatically updated to "processing"

### 3. Success/Cancel Redirects
- Success: `http://localhost:5173/orders?success=true&session_id={CHECKOUT_SESSION_ID}`
- Cancel: `http://localhost:5173/orders?canceled=true`

---

## 🎨 Frontend Implementation

### Install Stripe.js
```bash
npm install @stripe/stripe-js
```

### Seller Registration Page
Create `frontend/src/pages/SellerRegister.jsx`:
```javascript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function SellerRegister() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', { 
        name, 
        email, 
        password,
        role: 'seller' 
      });
      localStorage.setItem('token', res.data.access_token);
      navigate('/seller/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 shadow-2xl">
          <h2 className="text-3xl font-bold text-white mb-2">Become a Seller</h2>
          <p className="text-gray-400 mb-6">Start selling on Apex Store</p>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Business Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-gray-900/50 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-gray-900/50 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-gray-900/50 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
              />
            </div>
            
            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-teal-500/50"
            >
              Register as Seller
            </button>
            
            <p className="text-center text-gray-400 text-sm mt-4">
              Already have an account?{' '}
              <a href="/login" className="text-teal-400 hover:text-teal-300 font-medium">
                Sign in
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SellerRegister;
```

---

## 🔐 Role-Based Access Control

### Middleware Usage
The `RoleMiddleware` checks user roles:

```php
// Single role
Route::middleware([RoleMiddleware::class . ':admin'])

// Multiple roles (OR condition)
Route::middleware([RoleMiddleware::class . ':seller,admin'])
```

### Frontend Role Checking
```javascript
// Get user profile
const user = await api.get('/auth/profile');

// Check role
if (user.data.role === 'admin') {
  // Show admin features
} else if (user.data.role === 'seller') {
  // Show seller features
}
```

---

## 📊 Dashboard Examples

### Admin Dashboard Stats
```json
{
  "total_users": 150,
  "total_sellers": 25,
  "total_products": 500,
  "total_orders": 1200,
  "pending_orders": 45,
  "total_revenue": 125000.50
}
```

### Seller Dashboard Stats
```json
{
  "total_products": 20,
  "active_products": 18,
  "total_sales": 150,
  "total_revenue": 15000.00
}
```

---

## 🧪 Testing

### Test Accounts
```
Admin:
- Email: admin@apex.com
- Password: password

Seller:
- Email: seller@apex.com
- Password: password

User:
- Email: user@apex.com
- Password: password
```

### Stripe Test Cards
```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
3D Secure: 4000 0025 0000 3155
```

---

## 🚀 Deployment Checklist

1. ✅ Set real Stripe keys in production `.env`
2. ✅ Configure Stripe webhook endpoint
3. ✅ Set `APP_ENV=production`
4. ✅ Run `php artisan config:cache`
5. ✅ Run `php artisan route:cache`
6. ✅ Set up HTTPS for security
7. ✅ Configure CORS for production frontend URL
8. ✅ Create admin user
9. ✅ Test payment flow end-to-end

---

## 📝 Promo Codes

Available codes:
- `SAVE10` - 10% discount
- `SAVE20` - 20% discount

Add more in `Cart.jsx` `applyPromo()` function.

---

## 🎯 Next Steps (Optional Enhancements)

1. **Product Images** - Add image upload functionality
2. **Email Notifications** - Order confirmations, shipping updates
3. **Reviews & Ratings** - Customer feedback system
4. **Analytics** - Sales charts and reports
5. **Inventory Alerts** - Low stock notifications
6. **Multi-currency** - Support multiple currencies
7. **Shipping Integration** - Real shipping providers
8. **Tax Calculation** - Automatic tax computation
9. **Refunds** - Handle refund requests
10. **Product Categories** - Organize products better

---

## 🐛 Troubleshooting

### Stripe Webhook Not Working
1. Use Stripe CLI for local testing:
   ```bash
   stripe listen --forward-to localhost:8000/api/payment/webhook
   ```
2. Update `STRIPE_WEBHOOK_SECRET` with the webhook signing secret

### CORS Issues
Ensure `CorsMiddleware` is properly configured in `bootstrap/app.php`

### Role Middleware Not Working
Check that user has correct role in database:
```sql
SELECT id, name, email, role FROM users;
```

---

## 📚 Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Laravel Documentation](https://laravel.com/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)

---

**Built with ❤️ using Laravel, React, Stripe, and Tailwind CSS**
