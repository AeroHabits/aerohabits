
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
    // Define permissions needed by the app with clear descriptions (required by Apple)
    permissions: {
      camera: {
        text: "AEROHABITS requires camera access for profile pictures and tracking visual habit progress"
      },
      notifications: {
        text: "AEROHABITS sends notifications to remind you about your habit tracking and challenge progress"
      },
      location: {
        text: "AEROHABITS uses your location to deliver location-based habit recommendations and tracking"
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
    // Add App Store specific settings
    allowsBackForwardNavigationGestures: true,
    useUserAgentString: false,
    limitsNavigationsToAppBoundDomains: true,
    // Required for App Store review
    requiresFullScreen: false,
    overrideUserInterfaceStyle: 'light'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#ffffff",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      spinnerColor: "#2563eb",
      splashFullScreen: true,
      splashImmersive: true
    }
  }
};

export default config;
