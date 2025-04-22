
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.9f1d5b2d925b4ae797242e7d5f1c2dbc',
  appName: 'boa-noite-comecar-projeto',
  webDir: 'dist',
  server: {
    url: 'https://9f1d5b2d-925b-4ae7-9724-2e7d5f1c2dbc.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  ios: {
    contentInset: 'always'
  },
  android: {
    contentInset: 'always'
  }
};

export default config;
