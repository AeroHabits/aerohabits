import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.areohabits.app',
  appName: 'AREOHABITS',
  webDir: 'dist',
  server: {
    url: 'https://tpthvlivzxrtkexxzqli.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  ios: {
    scheme: 'AREOHABITS'
  },
  android: {
    buildOptions: {
      keystorePath: 'release-key.keystore',
      keystoreAlias: 'key0',
      keystorePassword: 'password',
      storePassword: 'password',
    }
  }
};

export default config;