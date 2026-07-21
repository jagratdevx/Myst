require('dotenv').config();

module.exports = {
  expo: {
    name: 'Myst',
    slug: 'myst',
    version: '3.1.0',
    extra: {
      eas: {
        projectId: 'cf951323-3216-4189-bd37-8cb94fd50225',
      },
      groqApiKey: process.env.GROQ_API_KEY || '',
    },
    owner: 'jagratagrawals-organization',
    icon: './src/assets/pics/logo.png',
    splash: {
      image: './src/assets/pics/splash_image.png',
      resizeMode: 'contain',
      backgroundColor: '#081120',
    },
    android: {
      package: 'com.jagrat.devx.myst',
    },
    ios: {
      bundleIdentifier: 'com.jagrat.devx.myst',
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    plugins: [
      'expo-secure-store',
    ],
  },
};
