
# Backend Integration Notes

This document outlines the requirements for integrating this frontend application with a backend server.

## Database Requirements

### Properties Table
- id (primary key)
- title
- description
- location
- price
- currency
- type (Apartment, Villa, House, etc.)
- bedrooms
- bathrooms
- area
- features (JSON array)
- is_for_rent (boolean)
- created_at
- updated_at

### Users Table
- id (primary key)
- email (unique)
- name
- password_hash
- created_at
- updated_at

### User Preferences
- id (primary key)
- user_id (foreign key to users.id)
- language
- notification_settings (JSON)
- created_at
- updated_at

### User Favorites
- id (primary key)
- user_id (foreign key to users.id)
- property_id (foreign key to properties.id)
- created_at

### Subscriptions
- id (primary key)
- user_id (foreign key to users.id)
- plan (basic, premium, pro)
- status (active, cancelled, expired)
- start_date
- next_billing_date
- payment_method_id
- created_at
- updated_at

### Property Images
- id (primary key)
- property_id (foreign key to properties.id)
- image_url
- is_primary (boolean)
- sort_order
- created_at

## API Endpoints Required

### Authentication
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/me

### Properties
- GET /api/properties
- GET /api/properties/:id
- GET /api/properties/search (with query parameters)
- GET /api/properties/featured

### User Preferences
- GET /api/user/preferences
- PUT /api/user/preferences
- GET /api/user/favorites
- POST /api/user/favorites
- DELETE /api/user/favorites/:propertyId

### Subscriptions
- GET /api/subscriptions
- POST /api/subscriptions
- PUT /api/subscriptions/:id
- DELETE /api/subscriptions/:id
- POST /api/payments/create-payment-intent

### Email Notifications
- POST /api/notifications/subscribe
- PUT /api/notifications/preferences
- POST /api/notifications/send-test

## Email Service Integration

Requirements for email service integration:
1. Transactional emails for:
   - Account verification
   - Password reset
   - Property alerts
   - Subscription updates
2. Marketing emails for:
   - Weekly newsletters
   - Market updates
   - Promotional offers

Recommended services:
- SendGrid
- Mailchimp
- Amazon SES

## Image Storage

Requirements for property image management:
1. Image upload with resizing
2. Multiple images per property
3. Image optimization
4. Secure storage and access

Recommended services:
- Amazon S3
- Cloudinary
- Firebase Storage
