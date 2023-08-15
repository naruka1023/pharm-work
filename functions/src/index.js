"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint linebreak-style: ["error", "windows"]*/
/* eslint-disable max-len */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp({
  credential: admin.credential.cert(require("./service-account.json")),
});
const db = admin.firestore();
// The Firebase Admin SDK to access Firestore.
exports.removeDataResidue = functions.firestore
    .document("job-post/{userId}")
    .onDelete((change, context) => {
      db.collection("bookmark").where("jobUID", "==", context.params.userId).get().then(async (doc) => {
        const batch = db.batch();
        doc.forEach((bookmark) => {
          batch.delete(db.collection("bookmark").doc(bookmark.id));
        });
        await batch.commit().then(() => {
          db.collection("job-request").where("jobUID", "==", context.params.userId).get().then(async (doc) => {
            const batch = db.batch();
            doc.forEach((jobRequest) => {
              batch.delete(db.collection("job-request").doc(jobRequest.id));
            });
            await batch.commit().then(() => {
              console.log("delete successful");
            });
          });
        });
      });
    });
const auth = admin.auth();
// The Firebase Admin SDK to access Firestore.
// Take the text parameter passed to this HTTP endpoint and insert it into
// Firestore under the path /messages/:documentId/original
