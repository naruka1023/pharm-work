/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp({
  credential: admin.credential.cert(require("./service-account.json")),
});
const db = admin.firestore();

// The Firebase Admin SDK to access Firestore.
exports.removeDataResidue = functions.firestore
    .document("job-post/{userId}")
    .onDelete((change: any, context: any) => {
      db.collection("bookmark").where("jobUID", "==", context.params.userId).get().then(async (doc: any)=>{
        const batch = db.batch();
        doc.forEach((bookmark: any)=>{
          batch.delete(db.collection("bookmark").doc(bookmark.id));
        });
        await batch.commit().then(()=>{
          db.collection("job-request").where("jobUID", "==", context.params.userId).get().then(async (doc: any)=>{
            const batch = db.batch();
            doc.forEach((jobRequest: any)=>{
              batch.delete(db.collection("job-request").doc(jobRequest.id));
            });
            await batch.commit().then(()=>{
              console.log("delete successful");
            });
          });
        });
      });
    });
