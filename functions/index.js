"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint linebreak-style: ["error", "windows"]*/
/* eslint-disable max-len */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const templateBody = require("./template2");
const express = require("express");
const cors = require("cors");
const path = require("path");
const puppeteer = require("./puppeteer");
const pt = require("puppeteer");


admin.initializeApp({
  credential: admin.credential.cert(require("./service-account.json")),
});
const db = admin.firestore();
// The Firebase Admin SDK to access Firestore.
const corsOptions = {
  origin: true, // replace this with your frontend domain
  optionsSuccessStatus: 200,
};


const app = express();
app.use(cors(corsOptions));
app.get("/index", function(req, res) {
  res.sendFile(path.join(__dirname, "/index.html"));
});
app.get("/og-image", puppeteer.generateImage);
app.get("/start", async (request, response) => {
  const {licenseID, name, surname} = request.query;
  const browser = await pt.launch({headless: "new", args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
  ]});
  const p = await browser.newPage();
  // set viewpoint of browser page
  await p.setViewport({width: 1000, height: 500});
  await p.goto("https://www.pharmacycouncil.org/index.php?option=com_pharmacist_list");
  await p.type("#txtfind_id", licenseID);
  const f = await p.$("[name='cmdFindPH']");
  await Promise.all([
    f.click(),
    p.waitForNavigation(),
  ]);
  const g = await p.$(".contentright > table");
  // obtain text
  const texted = (await g.getProperty("textContent")).toString();
  const flag = texted.includes(name) && texted.includes(surname);
  await p.close();
  await browser.close();
  response.statusCode = 200;
  response.setHeader("Content-Type", "application/json");
  response.send({
    result: flag,
  });
});
exports.imageGeneration = functions.https.onRequest(app);
// exports.propagateFollowersNotification = functions.firestore
//     .document("job-post/{userId}")
//     .onCreate(async (change, context) => {

//       db.collection("notification-token").where("jobUID", "==", context.params.userId).get().then(async (doc) => {
//         const batch = db.batch();
//         doc.forEach((bookmark) => {
//           batch.delete(db.collection("bookmark").doc(bookmark.id));
//         });
//         await batch.commit().then(() => {
//           db.collection("job-request").where("jobUID", "==", context.params.userId).get().then(async (doc) => {
//             const batch = db.batch();
//             doc.forEach((jobRequest) => {
//               batch.delete(db.collection("job-request").doc(jobRequest.id));
//             });
//             await batch.commit().then(() => {
//               console.log("delete successful");
//             });
//           });
//         });
//       });
//     });

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


// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//

const template = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">

  <!-- insert meta tags here -->
  ___META_TAGS___
  
  <!-- Rest of head content -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css">
  </head>
  
<body style="background: #f2f2f2">
<nav class="navbar navbar-expand-lg navbar-light sticky-top" style="background:#f2f2f2; border-bottom:1px solid #cccccc">
    <div class="container-fluid">
      <div class="d-flex flex-row align-items-center">
        <div class="fs-3">
          <a class="navbar-brand" href="https://www.pharm-work.com">
          <i class="bi bi-house-fill"></i>
          </a>
        </div>
      </div>
    </div>
  </nav>
  ___BODY_TAGS___
</body>
<style>___CSS_TAGS___</style>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.min.js" integrity="sha384-Rx+T1VzGupg4BHQYs2gCW9It+akI2MM/mndMCy36UVfodzcJcF0GGLxZIzObiEfa" crossorigin="anonymous"></script>
</html>`;

function createTags(jobPost) {
  let newValue = "";
  if (jobPost.Salary.Suffix !== "SalaryNumbers") {
    switch (jobPost.Salary.Suffix) {
      case "Negotiable":
        newValue = "ตามตกลง";
        break;
      case "CorporateStructure":
        newValue = "ตามโครงสร้างองค์กร";
        break;
    }
  }
  let imageURL = `https://us-central1-pharm-work.cloudfunctions.net/imageGeneration/og-image?establishment=${jobPost.Establishment}&jobName=${jobPost.JobName}&urgency=${jobPost.Urgency}&timeFrame=${jobPost.TimeFrame}&dateOfJob=${jobPost.DateOfJob == undefined?"":jobPost.DateOfJob}&salary=${jobPost.Salary.Amount == undefined? "N/A" : jobPost.Salary.Amount}&cap=${jobPost.Salary.Cap}&province=${jobPost.Location.Province}&district=${jobPost.Location.District}&profileImage=${jobPost.cropProfilePictureUrl !== undefined? jobPost.cropProfilePictureUrl : jobPost.profilePictureUrl}&negotiable=${jobPost.Salary.Suffix == "SalaryNumbers"?"": newValue}`;
  imageURL = encodeURI(imageURL);
  const description = `${jobPost.Establishment} รับสมัคร ${jobPost.JobName} ชนิดพนักงาน ${jobPost.TimeFrame} รายได้รวม ${jobPost.Salary.Amount} - ${jobPost.Salary.Amount + jobPost.Salary.Cap} ${jobPost.Urgency?"บาท/ชม":"บาท/เดือน"} พื้นที่ทำงาน (${jobPost.Location.District}, ${jobPost.Location.Province})`;
  return `
  <meta name="title" content="รับสมัคร ${jobPost.JobName}">
  <meta name="description" content="${description}">

  <meta property="og:type" content="website">
  <meta property="og:title" content="รับสมัคร ${jobPost.JobName}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${imageURL}">
  <meta property="og:url" content="public.pharm-work.com/job-post/${jobPost.custom_doc_id}">

  <meta itemprop="name" content="รับสมัคร ${jobPost.JobName}">
  <meta itemprop="description" content="${description}">
  <meta itemprop="image" content="${imageURL}">

  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:url" content="public.pharm-work.com/job-post/${jobPost.custom_doc_id}">
  <meta property="twitter:title" content="รับสมัคร ${jobPost.JobName}">
  <meta property="twitter:description" content="${description}">
  <meta property="twitter:image" content="${imageURL}">
`;
}

exports.dynamicShareButton = functions.https.onRequest(async (request, response) => {
  const jobID = request.path.split("/")[2];
  const job = await db.doc("job-post/" + jobID).get();
  const newjob = job.data();
  const metaTags = createTags(newjob);
  let html = template.replace("___META_TAGS___", metaTags);
  // functions.logger.info(templateBody.getHtml(newjob).css)
  html = html.replace("___BODY_TAGS___", templateBody.getHtml(newjob).body);
  html = html.replace("___CSS_TAGS___", templateBody.getHtml(newjob).style);
  response.send(html);
});

exports.testData = functions.https.onRequest(async (request, response) =>{
  console.log(request.userId);
  const job = await db.collection("job-post").doc(request.userId).get();
  const uid = job.data().OperatorUID;
  const followers = await db.collection("followers").where("operatorUID", "==", uid).get();
  const countPromises = [];
  followers.docs.forEach((follower)=>{
    const followerData = follower.data();
    countPromises.push(db.collection("notification-token").where("userUID", "==", followerData.userUID).get());
  });
  let registerTokens = await Promise.all(countPromises);
  registerTokens = registerTokens.map((token)=>{
    return token.docs.map((doc)=> {
      return doc.data();
    });
  });
  response.send(registerTokens);
});
exports.authenticateLicense = functions.https.onRequest(app);

// The Firebase Admin SDK to access Firestore.
// Take the text parameter passed to this HTTP endpoint and insert it into
// Firestore under the path /messages/:documentId/original
