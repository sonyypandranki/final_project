import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.vitap.lostandfound',
  appName: 'Lost and Found VITAP',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    // Firebase configuration for mobile
    Firebase: {
      // These will be overridden by environment variables in the web app
      apiKey: 'your-api-key',
      authDomain: 'your-project-id.firebaseapp.com',
      projectId: 'your-project-id',
      storageBucket: 'your-project-id.appspot.com',
      messagingSenderId: 'your-messaging-sender-id',
      appId: 'your-app-id'
    }
  }
};

export default config;
