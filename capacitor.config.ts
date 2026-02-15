import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.tucsonchocolatefactory.app",
  appName: "Tucson Chocolate Factory",
  webDir: "out",
  server: {
    androidScheme: "https",
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
    LocalNotifications: {
      smallIcon: "ic_stat_chocolate",
      iconColor: "#c8952e",
      sound: "notification.wav",
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#2c1810",
      showSpinner: false,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#2c1810",
    },
  },
};

export default config;
