interface Environment {
  VITE_API_KEY: string | undefined;
  VITE_AUTH_DOMAIN: string | undefined;
  VITE_PROJECT_ID: string | undefined;
  VITE_STORAGE_BUCKET: string | undefined;
  VITE_MESSAGING_SENDER_ID: string | undefined;
  VITE_APP_ID: string | undefined;
  VITE_MEASUREMENT_ID: string | undefined;
  VITE_DATABASE_URL: string | undefined;
}

export const getEnvironment = (): Environment => {
  if (import.meta.env) {
    return {
        VITE_API_KEY: import.meta.env.VITE_API_KEY,
        VITE_AUTH_DOMAIN: import.meta.env.VITE_AUTH_DOMAIN,
        VITE_PROJECT_ID: import.meta.env.VITE_PROJECT_ID,
        VITE_STORAGE_BUCKET: import.meta.env.VITE_STORAGE_BUCKET,
        VITE_MESSAGING_SENDER_ID: import.meta.env.VITE_MESSAGING_SENDER_ID,
        VITE_APP_ID: import.meta.env.VITE_APP_ID,
        VITE_MEASUREMENT_ID: import.meta.env.VITE_MEASUREMENT_ID,
        VITE_DATABASE_URL: import.meta.env.VITE_DATABASE_URL
    }
  } else {
    return {
        VITE_API_KEY: process.env.API_KEY,
        VITE_AUTH_DOMAIN: process.env.AUTH_DOMAIN,
        VITE_PROJECT_ID: process.env.PROJECT_ID,
        VITE_STORAGE_BUCKET: process.env.STORAGE_BUCKET,
        VITE_MESSAGING_SENDER_ID: process.env.MESSAGING_SENDER_ID,
        VITE_APP_ID: process.env.APP_ID,
        VITE_MEASUREMENT_ID: process.env.MEASUREMENT_ID,
        VITE_DATABASE_URL: process.env.DATABASE_URL
    };
  }
};

