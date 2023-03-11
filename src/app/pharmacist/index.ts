

let admin = require('firebase-admin')
let ids = [
  '1j2ci9pyIRM5CDWWIc153HZgEuc2',
  '2spqsiexbdNqTcv4SGbEoyXJQjx1',
  '6WCq8ZiO5WXX7aJ1dukmX45B2YJ3',
  '99d8yJSBBYWrsWhUasM5r4Dzaea2',
  'AIoLn4FQDaOhPp9pvOsr5NgAgRW2',
  'AnQ58TjnwqQZYUYUdgUh9D2INbq2',
  'AoVpzPBXjwMecGdoZ7KMlzdvt503',
  'CKC4HZclkQd33Eo3Cft4KBjaYJu2',
  'CNG4OcFU7ISPzpBhdIPJwSmL0rd2',
  'CcRtbS6KbFR580ssyshu5GxvYk93',
  'F7QrCAUE1nerXYQOIhazNFQPld72',
  'Fs5mbQmlIedgdZhqwPWCGnuM4rx1',
  'H11SgWwz13SHRRP8Nh6ZgVCbfE02',
  'HN4Fxftdl9SBlgWBZIE4oWz2aDq1',
  'IXyxg9QhigMRMdug4J15xNhkeBF2',
  'JbpWx5wVd0cn33X5Keda7eXqhMB3',
  'KQ4Q3ftfEWWmssbM1D7Rt8ru8Xf2',
  'KS2K4UXawLfPvFzUun0WzCHCHNp2',
  'Kp3viXzrtSZGDIkYXqjpSxsCOLw2',
  'LRznDjVcjkPglpXQrmxCg8Szacw2',
  'MXUibBvhiUeuJ2iZpcYfu0DT9HQ2',
  'NHIPebd12xP9aa32borpIj03Y7I3',
  'NmBE4eNDypbRJHddKBrPakuNQpG2',
  'O1Ip4NPVF9UzWLQDDl9Pg7pyMAr1',
  'PN4Hxzb1lXNct1tuZMjgysKm6ED3',
  'SQTfZJ5aNuabZQvch3ebbqZqydr1',
  'TpHjhrcZfAacGWkEN5gtVdSn8h13',
  'U0FhwH8dK1QxcpbmrocH5tqcRfn1',
  'U2EdugKB90dSA5rTdeHLBDnE5593',
  'VSgEAXPkeZfQ9aFCSZEL7rKEgXz2',
  'WNIlNnWRFRgqHd6rxqW8Hp9YT3w2',
  'WUQ9zyNFa9bwZIBHYteYDXowrWz1',
  'dkwrGs6ZNfbILyW3eKkXnvsQYPD2',
  'dtLuNBUupsZGqeeBKtdPuuNHCdR2',
  'fDGpkJKDm7MoqvKSAzRFeRLHhI72',
  'i8DKUVCbNHc7a12BmIxn5H68TWQ2',
  'oD2HzcGVxtOsU6P9lYuPIiR0F1L2',
  'pNAIeUXDloglmiQZrxN1HeAGYoO2',
  'poPjJ8Vg0XdOW5OQoUR2GXyssUd2',
  'pyVpuPBbDlXrTzZ7IoBoI6hsf1w1',
  'vbmjA7Fn7XMFPGeAda73sJdFd8q2',
  'wxw68oL2ynXTf5Zrks28Cbx6Fxt1',
]
let adminRoot = admin.initializeApp({
    credential: admin.credential.cert(require("./service-account.json")),
   });
let authAccount = adminRoot.auth()
authAccount.deleteUsers(ids).then(()=>{
  console.log('delete successful');
})