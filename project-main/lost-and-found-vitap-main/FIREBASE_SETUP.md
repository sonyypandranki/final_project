# Firebase Setup Guide for Lost and Found Application

This guide will help you set up Firebase for your lost and found application.

## Prerequisites
- A Google account
- Node.js and npm installed
- Firebase CLI installed (`npm install -g firebase-tools`)

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "lost-and-found-vitap")
4. Choose whether to enable Google Analytics (recommended)
5. Click "Create project"

## Step 2: Enable Firebase Services

### Authentication
1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" authentication
5. Click "Save"

### Firestore Database
1. Go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" for development (you can secure it later)
4. Select a location closest to your users
5. Click "Done"

### Storage
1. Go to "Storage" in the left sidebar
2. Click "Get started"
3. Choose "Start in test mode" for development
4. Select a location closest to your users
5. Click "Done"

## Step 3: Get Firebase Configuration

1. In your Firebase project, click the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (</>)
5. Register your app with a nickname (e.g., "lost-and-found-web")
6. Copy the configuration object

## Step 4: Configure Environment Variables

1. Copy the `env.example` file to `.env.local`:
   ```bash
   cp env.example .env.local
   ```

2. Replace the placeholder values in `.env.local` with your actual Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your-actual-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-actual-sender-id
   VITE_FIREBASE_APP_ID=your-actual-app-id
   ```

## Step 5: Deploy Security Rules

1. Initialize Firebase in your project:
   ```bash
   firebase login
   firebase init
   ```

2. When prompted:
   - Select "Firestore" and "Storage"
   - Choose your project
   - Use the default file names for rules

3. Deploy the security rules:
   ```bash
   firebase deploy --only firestore:rules
   firebase deploy --only storage
   ```

## Step 6: Create Firestore Indexes

1. Deploy the indexes configuration:
   ```bash
   firebase deploy --only firestore:indexes
   ```

## Step 7: Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Try to create a user account
3. Try to add a lost/found item
4. Verify that data is being stored in Firestore

## Database Structure

### Collections

#### `users`
- `uid`: User ID (from Firebase Auth)
- `email`: User's email address
- `displayName`: User's display name
- `phone`: User's phone number
- `regNo`: User's registration number
- `role`: User role ('user' or 'admin')
- `createdAt`: Account creation timestamp
- `updatedAt`: Last update timestamp

#### `items`
- `id`: Unique item ID
- `title`: Item title
- `description`: Item description
- `category`: Item category
- `location`: Item location
- `date`: Date when item was lost/found
- `status`: 'lost' or 'found'
- `image`: Optional image URL
- `phone`: Contact phone number
- `regNo`: Optional registration number
- `userId`: ID of the user who created the item
- `createdAt`: Item creation timestamp
- `updatedAt`: Last update timestamp

### Storage Structure

- `items-images/`: Folder for item images
- `user-avatars/`: Folder for user profile pictures

## Security Rules

### Firestore Rules
- Users can read their own profile and all items
- Users can create, update, and delete their own items
- Admins have full access to all data
- Items are publicly readable

### Storage Rules
- Item images are publicly readable
- Users can only upload images to their own avatar folder
- File size limits: 5MB for items, 2MB for avatars
- Only image files are allowed

## Troubleshooting

### Common Issues

1. **Authentication errors**: Check if Email/Password auth is enabled
2. **Permission denied**: Verify security rules are deployed correctly
3. **Storage upload fails**: Check file size and type restrictions
4. **Queries fail**: Ensure Firestore indexes are created

### Development vs Production

- Use test mode for development
- Deploy proper security rules before going to production
- Set up proper authentication methods for production
- Monitor usage and costs

## Next Steps

1. Set up Firebase Analytics for user behavior tracking
2. Configure Firebase Performance Monitoring
3. Set up Firebase Cloud Functions for advanced features
4. Implement push notifications using Firebase Cloud Messaging
5. Set up automated backups and data export

## Support

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Community](https://firebase.google.com/community)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/firebase)
