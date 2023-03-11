/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
// import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp({
  credential: admin.credential.cert(require("./service-account.json")),
  storageBucket: "gs://pharm-work.appspot.com",
});
const db = admin.firestore();
const bucket = admin.storage().bucket();

// // The Firebase Admin SDK to access Firestore.
// exports.removeDataResidue = functions.firestore
//     .document("job-post/{userId}")
//     .onDelete((change: any, context: any) => {
//       db.collection("bookmark").where("jobUID", "==", context.params.userId).get().then(async (doc: any)=>{
//         const batch = db.batch();
//         doc.forEach((bookmark: any)=>{
//           batch.delete(db.collection("bookmark").doc(bookmark.id));
//         });
//         await batch.commit().then(()=>{
//           db.collection("job-request").where("jobUID", "==", context.params.userId).get().then(async (doc: any)=>{
//             const batch = db.batch();
//             doc.forEach((jobRequest: any)=>{
//               batch.delete(db.collection("job-request").doc(jobRequest.id));
//             });
//             await batch.commit().then(()=>{
//               console.log("delete successful");
//             });
//           });
//         });
//       });
//     });

// const auth = admin.auth();
// // The Firebase Admin SDK to access Firestore.
// // Take the text parameter passed to this HTTP endpoint and insert it into
// // Firestore under the path /messages/:documentId/original
// exports.addDummyUsers = functions.https.onRequest(async (req, res) => {
//   const preferredSalary = [
//     "20,000",
//     "30,000",
//     "40,000",
//     "50,000",
//     "60,000",
//     "70,000",
//     "80,000",
//     "90,000",
//     "100,000+",
//   ];
//   const preferredStartTime = [
//     "ทันที",
//     "ภายใน 1 สัปดาห์",
//     "ภายใน 2 สัปดาห์",
//     "ภายใน 3 สัปดาห์",
//     "ภายใน 1 เดือน",
//   ];
//   const index = Math.floor(Math.random() * 100);
//   await auth.createUser({
//     email: `newUsers${index}@gmail.com`,
//     emailVerified: false,
//     password: "asdfjkl;asdfjkl;",
//   }).then((userCredential)=>{
//     console.log();
//     console.log(`create user ${index} successfull`);
//     const payload = {
//       email: `newUsers${index}@gmail.com`,
//       license: `0000${index}`,
//       name: `newUser${index}`,
//       surname: "something",
//       preferredJobType: {
//         AA: Math.random() > 0.5? true:false,
//         AB: Math.random() > 0.5? true:false,
//         AC: Math.random() > 0.5? true:false,
//         BA: Math.random() > 0.5? true:false,
//         BB: Math.random() > 0.5? true:false,
//         BC: Math.random() > 0.5? true:false,
//         CA: Math.random() > 0.5? true:false,
//         CB: Math.random() > 0.5? true:false,
//       },
//       Location: {
//         District: "สามเงา",
//         Section: "ยกกระบัตร",
//         Province: "ตาก",
//       },
//       preferredLocation: {
//         District: "สามเงา",
//         Section: "ยกกระบัตร",
//         Province: "ตาก",
//       },
//       preferredSalary: preferredSalary[Math.floor(Math.random() * preferredSalary.length)],
//       preferredStartTime: preferredStartTime[Math.floor(Math.random() * preferredStartTime.length)],
//       preferredTimeFrame: Math.random() > 0.5? "Full-time":"Part-time",
//       role: "เภสัชกร",
//       showProfileFlag: true,
//       AmountCompleted: Math.floor((Math.random() * 100)),
//     };
//     db.collection("users").doc(userCredential.uid).set(payload).then(()=>{
//       console.log(`user ${index} added`);
//       res.json({result: `user ${index} added`});
//     });
//   });
// });
