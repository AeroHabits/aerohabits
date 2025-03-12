
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
    }
  }
};

export default config;
