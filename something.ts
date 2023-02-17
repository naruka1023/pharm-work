/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable max-len */
/* eslint-disable linebreak-style */
const Firestore = require("@google-cloud/firestore");
const admin = require("firebase-admin");
const serviceAccount = require("./service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore()
something = ()=>{
  db.collection("bookmark").doc("FH0nEKzfOc8bgyGVGojP").get().then((doc)=>{
    console.log(doc.data());
  });

}
something()
