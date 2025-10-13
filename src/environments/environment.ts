export const environment = {
  production: true,
  firebase: {
    projectId: 'pharm-work',
    appId: '1:797947649067:web:bad0f4f64244e37f249e6e',
    storageBucket: 'pharm-work.appspot.com',
    locationId: 'us-central',
    apiKey: 'AIzaSyB9LMNy74FMy1pL7fimCv5Qc2-pOYhdj5k',
    authDomain: 'pharm-work.firebaseapp.com',
    messagingSenderId: '797947649067',
    measurementId: 'G-TKMY6WTWZN',
  },
};
export const vapidKey =
  'BD_b_VCmV9UpEr7f_EVYDJI0BAUMB1iTR_nFgy9-8LLbLedGhWKKDyI2EhSYMbgFvg9tsjYe-AeaGidm0QGtOu4';
export const algoliaEnvironment = {
  app_id: 'OY4NA7JZ4M',
  api_key: '41292c1f6520cc8d83b9fbdc044fbc0d',
  user_api_key: '578b006f28d32e3f156838d8ca6f55c5',
};
export const limitBanner: { [key: string]: number } = {
  A1: 5,
  A2: 3,
  A3: 3,
  A4: 3,
  B1: 3,
  B2: 42,
};
export const url = {
  licenseAuthentication:
    'https://us-central1-pharm-work.cloudfunctions.net/authenticateLicense/start',
  addUrgentJob:
    'https://us-central1-pharm-work.cloudfunctions.net/addUrgentJob',
  sendEmail:
    'https://us-central1-pharm-work.cloudfunctions.net/sendEmail/send-email',
  jobPostNotification:
    'https://us-central1-pharm-work.cloudfunctions.net/requestPropagateFollowersNotification',
  jobRequestNotification:
    'https://us-central1-pharm-work.cloudfunctions.net/sendJobRequestToOperator',
  shareJob: 'https://public.pharm-work.com/job-post/',
  urgentJobCreation: 'yay',
};
export const apiKey = {
  google_map: 'AIzaSyA-jJ_KwDMqcS3iaX_ecv-dyJ2yLRBFz8w',
};
export const stripeTableKeys = {
  pricing_table_id: 'prctbl_1OtBngKDtmy3uupfX59GOSwY',
  publishable_key:
    'pk_test_51Oqee1KDtmy3uupfmx0sRpgbknkcuMolUlNtgI1liZ8yV0MhBsVq30DQlwNI4jDI83E9R53jD0JO89l3LHhnHZQq00C4HymXVA',
};
export const serviceAccountEnvironment = {
  type: 'service_account',
  project_id: 'pharm-work',
  private_key_id: '71bcd116c099519b3a0ac1ec7d20ecc6c30ef85b',
  private_key:
    '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC4ajBpzU92wKFN\nUxALQmK1Y11XAXfGg6deg5UeUTNA7Dy96LFFBgAv2y4SgpvDANm7jA9dSbTN93q6\nlqOqNuyGjebM0r2z/tDU5JbOTr2sKZhPgZr9PKvQKvXdUCeTxOXxmOJD8yUJhtIk\n9N/m/y+blcAN6f2DC730HBFRKIWcM5PketoJqtDrgFZdHuNVHN0px5ytiIFHBe1a\n4njyPOOQoSsR7VFw/Szg5CATKGK84vQYD/X4RJtjIrA4DtID6x27e4hHOcHFL5FP\nY9ypYZ7MJg21VeZv2RetjfJTWU9mHsUaS4Etb6sbVlU9R9vOFFy6V+k/DeRx+uF+\nqWY2K2nRAgMBAAECggEAA+t15fnQM5T6mLsoPyUFFhfrlvrYAecweojPdZqCPWII\nFH1Kr03mWR4Oh6QxDV8KQbtDZFc5uZsGB8tF5UtPkbiYbEgaciX7aFsHfZEc5Pjp\nXN9DXRiaCk2vdinK/ZAU1yLJxGn5oo80DkcKL03DREpVj7Ymhk+MlRC3qYLz/BLv\nV6CNwKBWSoBMzkleMeW0bdueL6GzYuoMvB4ZEDyeuWfIBfHfE0a0laKs3RQsoGu1\n4/5eoRWGo7uU5ksA/snM3p2ezZtxJvK6boXNeGNIJsSNJXO3sqoz68tjC21iKWPm\nlad6X2WEQp/TUkpGzx1q3p30pqj6tKc/DpZ2fuiW9QKBgQDeHm3NR6Gk3VhYbNiu\nRkB4UnGenuObg4DUUU4fC1uR9mntX/G40L001T7SQJdt+zxZaTunU30RokIRvD+m\nItrWpY9tX3s0YKimy5iVAq1qhSUnRrysd26TZEuj7YMwfmfjR9j1ByzzbEqK6AYQ\ngi7a3bSEF0XUtrTXppgVHlrkuwKBgQDUi3IOkAhEtgTVlXT7TbsSCd2cbSA1Ocqh\nL0jJNWki6ysIc1Wki1b3bngv6YgBU9/il/5HBoUP3MVN1DkoPeh2DkwkmoNrsKHc\ngHFqKoRSxmo4NjROTJqO8hezJCZSlnlSX/GIISKeqhF/VMeQmZeWzlX55pvjU0Pi\n6ftunNpI4wKBgQCBgVZd4QzzNgcjj1sKyXUfclpCtLtaWeMMZ9dXrGSYhwad21nx\neutGWasGJZjlDB3Ut9GLLtd2J5fEBXFK6XmUuvUUPR51nIHYtk5hWy1HNRhDfS/W\nktAK6ehcTMg3xwvFbYem3acsyo/vy3Z1u6GcBLYSagtSCbEJJ132ujserwKBgQDG\nvR0JQOR6Wzhp/jZERYqGc3MksWVMX5142h3VBnwoinzSigWqth+7fTAknNjvZN4T\nosvA3ffNvUFAZRCM8FZNDVFlaJU6PQ8cf32NJ/RS8fSgWw7NqBNdVkGS4Fp1Hv6S\nZ+QQxer5MUzrIvr32qZD/OunoFpjVZhEtUTFSSVSwQKBgB5004u59aB0JkszPj1X\nrOcbaZMC1YCc0w9CtAm1HoFMsYyvlKu5QZoKge+06U5UNaQ5njh/XfenzpuxKnM5\nhjh0FxlN+E92H5fXYDnwxKfR1Vl6ZWR7PBw2oE73f1mlYPxmojARS54Ar+5dy7/5\nrO9kvz7BFguUXRKWxIuS0dPV\n-----END PRIVATE KEY-----\n',
  client_email: 'firebase-adminsdk-14qni@pharm-work.iam.gserviceaccount.com',
  client_id: '114772113004906747007',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-14qni%40pharm-work.iam.gserviceaccount.com',
};
