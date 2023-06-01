

let admin = require('firebase-admin')

let adminRoot = admin.initializeApp({
  credential: admin.credential.cert(require("./service-account.json")),
});
const db = adminRoot.firestore();
let authAccount = adminRoot.auth()
db.collection('job-post', ref=> ref.where('OperatorUID', '!=', 'wIeCawwtkogiKSNza8KC6kQmf2c2')).get().then((jobs)=>{
  let j = process.argv[2]
  let job = jobs.docs[j]
    authAccount.createUser({email:`operatorAccount${j}@gmail.com`,password:'asdfjkl;asdfjkl;'}).then((user)=>{
      const operatorData = {
        email: `operatorAccount${j}@gmail.com`,
        companyName: job.data().Establishment,
        jobType: job.data().JobType,
        companyID: "123456",
        nameOfPerson: `dude ${j}`,
        phoneNumber: "0813216549",
        uid: user.uid,
        role: 'ผู้ประกอบการ'
      }
      db.collection("users").doc(operatorData.uid).set(operatorData).then((value)=>{
        console.log('user registered Successfully ' + operatorData.companyName)
        throw new Error('This is not an error. This is just to abort javascript');
      })
    })
  
  })
  