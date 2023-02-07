const fs = require('fs')
srt = [
"รังสิต",
"หลักหก (มหาวิทยาลัยรังสิต)",
"ดอนเมือง",
"การเคหะ",
"หลักสี่",
"ทุ่งสองห้อง",
"บางเขน",
"วัดเสมียนนารี",
"จตุจักร",
"กรุงเทพอภิวัฒน์",
"ตลิ่งชัน",
"บางบำหร",
"บางซ่อน"]
arl = ["แอร์พอร์ตลิ้งค์",
"สุวรรณภูมิ",
"ลาดกระบัง",
"บ้านทับช้าง",
"หัวหมาก",
"รามคำแหง",
"มักกะสัน",
"ราชปรารภ",
"พญาไท"]

fs.writeFile('./arl.json', JSON.stringify(arl), 'utf8', function (err) {
    if (err) {
      console.log('error')
      console.log(err)
      return
    }
})
fs.writeFile('./srt.json', JSON.stringify(srt), 'utf8', function (err) {
    if (err) {
      console.log('error')
      console.log(err)
      return
    }
})