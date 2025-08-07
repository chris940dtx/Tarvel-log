const admin = require("firebase-admin");

let serviceAccount;
try {
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!serviceAccountKey) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set"
    );
  }

  serviceAccount = JSON.parse(serviceAccountKey);
  console.log("'Firebase Admin SDK initialized successfully");
  console.log("Project ID:", serviceAccount.project_id);
} catch (error) {
  console.error("Error parsing Firebase service account key:', error");
  throw error;
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = admin;
