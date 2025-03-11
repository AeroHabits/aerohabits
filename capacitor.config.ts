
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aerohabits.app',
  appName: 'AEROHABITS',
  webDir: 'dist',
  server: {
    url: 'https://tpthvlivzxrtkexxzqli.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  ios: {
    scheme: 'AEROHABITS',
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
    backgroundColor: '#ffffff',
    allowsLinkPreview: true,
    // Define permissions needed by the app
    permissions: {
      camera: {
        text: "Allow AEROHABITS to access your camera for profile pictures"
      },
      notifications: {
        text: "Allow AEROHABITS to send you reminders about your habits"
      },
      location: {
        text: "Allow AEROHABITS to access your location for habit tracking"
      },
      // Add App Tracking Transparency permission (Apple requirement)
      tracking: {
        text: "This allows us to provide a personalized experience and help improve the app. We respect your privacy and you can change this at any time in settings."
      }
    },
    // Configure status bar
    statusBar: {
      style: 'dark',
      backgroundColor: '#ffffff',
      overlaysWebView: true
    },
    // Configure splash screen
    splash: {
      backgroundColor: '#ffffff',
      showSpinner: true,
      spinnerColor: '#2563eb',
      launchAutoHide: true,
      launchShowDuration: 2000
    },
    // App Store metadata
    appStoreConfig: {
      category: "Health & Fitness", // Primary category for App Store
      subcategory: "Lifestyle",     // Secondary category
      ageRating: "4+",              // Content rating
      keywords: "habit tracker, goals, challenges, productivity, self-improvement",
      releaseNotes: "Initial release of the AEROHABITS app.",
      contactEmail: "Support@AeroHabits.com",
      contactPhone: "+1234567890", // Replace with your actual contact number
      contactWebsite: "https://aerohabits.com", // Replace with your actual website
      privacyPolicyUrl: "https://aerohabits.com/privacy", // Replace with your actual privacy policy URL
      marketingUrl: "https://aerohabits.com",  // Replace with your marketing URL
      supportUrl: "https://aerohabits.com/support", // Replace with your support URL
    }
  },
  android: {
    backgroundColor: '#ffffff',
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false,
    // Configure notifications
    overrideUserAgent: false,
    // Add Google Play Store metadata
    playStoreConfig: {
      applicationId: 'com.aerohabits.app',
      versionCode: 1,
      versionName: '1.0.0',
      minSdkVersion: 22, // Android 5.1
      targetSdkVersion: 33, // Android 13
      resizeableActivity: true,
      useLegacyPackaging: false,
    }
  }
};

export default config;
