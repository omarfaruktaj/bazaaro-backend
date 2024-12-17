# BAZAARO - Backend

The **Bazaaro Application** is a scalable and high-performance online shopping platform designed for users, vendors, and administrators. It enables users to browse and purchase products, vendors to manage their shops and inventories, and administrators to monitor and control the platform. This backend project focuses on building a secure and robust API using **Node.js** and **Express.js**, integrating with a PostgreSQL database and cloud storage services.

---

## Live Deployment  
- **Backend API URL**: https://bazaro-backend.vercel.app/
- **Frontend URL**: https://bazaaro-three.vercel.app/


---

## Technology Stack  

### Backend  
- **Language/Framework**: Node.js with Express.js  
- **Database**: PostgreSQL (via Prisma ORM) 
- **Authentication**: JWT-based authentication  
- **Image Storage**: Cloudinary integration  
- **Payment Gateway**:  Stripe  
- **Others**:  
  - **Bcrypt**: For password hashing  
  - **Nodemailer**: For password reset 



## Features and Functionalities  
### 1. Authentication  
- Secure **JWT-based authentication**  
- User and vendor registration  
- Password management (reset and change via email)

### 2. User Roles  
#### Admin  
- Manage users (suspend/delete accounts)  
- Blacklist vendor shops  
- Manage product categories dynamically  
- Monitor transactions and user activities  

#### Vendor  
- Create and manage shop details  
- Add, edit, duplicate, and delete products  
- Manage inventory and order history  
- View and respond to customer reviews  

#### User (Customer)  
- Browse products with advanced filtering and searching  
- Add products to a cart (single-vendor cart restriction)  
- Compare up to three products within the same category  
- Purchase products and apply coupon codes  
- Leave reviews and ratings for purchased products  
- Access order history and recently viewed products  

### 3. Key Functionalities  
- **Home Page**: Product listing with infinite scroll, filtering, and flash sale redirection  
- **Product Details Page**: Product descriptions, images, shop details, and reviews  
- **Shop Page**: Vendor-specific products with shop-follow functionality  
- **Cart**: Replace or retain cart for multi-vendor restrictions  
- **Checkout**: Payment processing via Stripe/Aamarpay  
- **Comparison**: Compare products within the same category  
- **Recent Products**: Show last 10 viewed products  
- **Paginated APIs**: Scalable pagination for products, reviews, and order history  


## Getting Started

Make sure you have the following installed:

### Prerequisites
Ensure you have the following installed on your machine:  
- Node.js (v14 or later)  
- PostgreSQL (or MongoDB)  
- npm or yarn  

## Instructions

To set up and run this project locally, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/omarfaruktaj/bazaaro-backend

   cd bazaaro-backend
   ```

2. **Install dependencies:**

   ```bash
   yarn install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory and add the necessary environment variables:

   ```plaintext
    PORT=5000

    # database
    DATABASE_URL= your database uri
        
    # JWT
    ACCESS_TOKEN_SECRET= secret
    ACCESS_TOKEN_EXPIRE=1d

    REFRESH_TOKEN_SECRET=secret
    REFRESH_TOKEN_EXPIRE=7d

    NODE_ENV=production

    STRIPE_SECRET_KEY= stripe secret key

    # EMAIL (for dev)
    EMAIL_HOST=smtp.ethereal.email
    EMAIL_PORT=587
    EMAIL_USERNAME=maddison53@ethereal.email
    EMAIL_PASSWORD=jn7jnAPss4f63QBp6D
    EMAIL_FROM=gardenia@mail.com

    RESET_TOKEN_CLIENT_URL= http://localhost:3000/reset-password


    CLOUDINARY_CLOUD_NAME= cloud name
    CLOUDINARY_API_KEY=api key
    CLOUDINARY_API_SECRET= api secret

    SENDER_EMAIL= gmail
    SENDER_APP_PASSWORD= google app password

   ```

4. **5. Database Setup:**

   ```bash
   npx prisma migrate dev
   ```
5. **Start the development server:**

   ```bash
   yarn run dev
   ```

   The application should now be running at `http://localhost:5000`.

## Key Features

    JWT Authentication
    Scalable APIs with pagination
    Image Uploads using Cloudinary
    Payment Integration via Stripe/Aamarpay
    Admin Moderation
    Vendor Shop Management