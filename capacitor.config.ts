
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
    scheme: 'AEROHABITS'
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
