<img width="1886" height="912" alt="ቅጽበታዊ ገጽ ዕይታ 2026-08-14 025643" src="https://github.com/user-attachments/assets/1eb3d07e-12e1-45c0-a0b4-025c61408392" /><img width="1886" height="912" alt="ቅጽበታዊ ገጽ ዕይታ 2026-08-14 025643" src="https://github.com/user-attachments/assets/978c7f9e-9e67-4beb-8cf2-39797aa3d643" /># 🛒 HabeshaMart

### Full-Stack E-Commerce Platform Built with Go & React

HabeshaMart is a production-oriented full-stack e-commerce platform built to demonstrate modern backend engineering and full-stack development practices.

The application provides customer shopping, authentication, product management, cart and order processing, payments, inventory management, notifications, caching, and an administrative workflow.

The backend is built with **Go and Gin**, while the frontend is built with **React and Vite**. PostgreSQL is used as the primary database, Redis provides caching, and Docker is used for containerized services.

---

## 🌐 Live Application

### 🛍️ Frontend

**Live Demo:**  
https://go-ecommerce-tsrh.vercel.app/

### ⚙️ Backend API

**API:**  
https://go-ecommerce-dd9m.onrender.com

### ❤️ Health Check

**API Health:**  
https://go-ecommerce-dd9m.onrender.com/health

# 📸 Screenshots

### Homepage

<img width="1886" height="912" alt="ቅጽበታዊ ገጽ ዕይታ 2026-08-14 025643" src="https://github.com/user-attachments/assets/ed524a8e-ca18-4b1b-a009-2214a27dfbaf" />


### Product Listing

<img width="1882" height="912" alt="ቅጽበታዊ ገጽ ዕይታ 2026-08-14 025732" src="https://github.com/user-attachments/assets/5267703e-c1b3-4f23-bcbc-7a667219f58f" />


### Product Details

<img width="1900" height="907" alt="ቅጽበታዊ ገጽ ዕይታ 2026-08-14 025826" src="https://github.com/user-attachments/assets/f8ce72fc-f3dc-43e7-88e0-bdfa0a6665d1" />


### Shopping Cart

<img width="1882" height="896" alt="ቅጽበታዊ ገጽ ዕይታ 2026-08-14 025756" src="https://github.com/user-attachments/assets/1989c0d3-5af1-4199-8c8f-e5824ec8e2e5" />


### Checkout

<img width="1885" height="896" alt="ቅጽበታዊ ገጽ ዕይታ 2026-08-14 030612" src="https://github.com/user-attachments/assets/486a0c3e-9756-4259-8af0-f816557570af" />


### Admin Dashboard

<img width="1877" height="901" alt="ቅጽበታዊ ገጽ ዕይታ 2026-08-14 030520" src="https://github.com/user-attachments/assets/b88cd33a-24b0-4ce2-b4a6-8b956aaed138" />

# ✨ Features

## 👤 Authentication & Authorization

- User registration
- User login
- JWT authentication
- Protected API routes
- Role-based authorization
- Customer and administrator roles
- User profile management

---

## 🛍️ Product Management

Customers can:

- Browse products
- View product details
- Search products
- Browse categories
- View product availability

Administrators can:

- Create products
- Update products
- Delete products
- Manage product information
- Manage product categories

---

## 📂 Category Management

- Create categories
- Update categories
- Delete categories
- List categories
- Retrieve individual categories

---

## 🛒 Shopping Cart

Customers can:

- Add products to cart
- Update quantities
- Remove products
- Clear their cart
- View cart totals
- Validate product availability

---

## 📦 Order Management

Customers can:

- Create orders
- View their orders
- View order details
- Track order status

Administrators can:

- View orders
- Update order status
- Manage the order lifecycle

### Order lifecycle

```text
Pending
   ↓
Confirmed
   ↓
Processing
   ↓
Shipped
   ↓
Delivered
