import * as functions from "firebase-functions";
import * as express from "express";
import { addUser } from "./userController";
import { db } from "./config/firebase";
require("firebase-functions/logger/compat");

const app = express();

function padTo2Digits(num: number) {
  return num.toString().padStart(2, '0');
}

function formatDate(date: Date) {
  return (
    [
      padTo2Digits(date.getMonth()),
      padTo2Digits(date.getDay()),
      padTo2Digits(date.getFullYear()),
    ].join('-')
  );
}

function formatTime(date: Date) {
  return (
    [
      padTo2Digits(date.getHours()),
      padTo2Digits(date.getMinutes()),
      padTo2Digits(date.getSeconds()),
    ].join('')
  );
}

app.get("/", (req, res) => res.status(200).send("Hey there!"));
app.post("/days", addUser);
//app.get("/days", getUser); // for all days
app.get('/days', (req, res) => {
  console.log(req.query.day)
  getDayDetails(req.query.day).then(function (result) {
    res.status(200).send({
      data: result,
    });
  }
  ).catch(function (error) {
    res.status(500).json(error.message);
  }
  )
}
)

const createNewDay = async () => {
    let date = formatDate(new Date())
    const userObject = {
      id: date,
      date: date,
      hr1: 0,
      hr2: 0,
      hr3: 0,
      hr4: 0,
      hr5: 0,
      hr6: 0,
      hr7: 0,
      hr8: 0,
      hr9: 0,
      hr10: 0,
    };

    return userObject
}

const updateHrInDay = async (count: any) => {
  const day = db.collection('days').doc(formatDate(new Date()))
  let result = (await day.get()).data() || {}

  if (result == null) {
    createNewDay().then(function (newDay) {
      console.log("a new day is created")
      result = newDay
    }
    ).catch(function (error) {
      console.error("a new day could not be created " + formatDate(new Date()))
    }
    )
  }

  if (parseInt(formatTime(new Date())) >= 600 && parseInt(formatTime(new Date())) < 700) {
    result.hr1 = count
  } else if (parseInt(formatTime(new Date())) >= 700 && parseInt(formatTime(new Date())) < 800) {
    result.hr2 = count
  } else if (parseInt(formatTime(new Date())) >= 800 && parseInt(formatTime(new Date())) < 900) {
    result.hr3 = count
  } else if (parseInt(formatTime(new Date())) >= 1000 && parseInt(formatTime(new Date())) < 1100) {
    result.hr4 = count
  } else if (parseInt(formatTime(new Date())) >= 1100 && parseInt(formatTime(new Date())) < 1200) {
    result.hr5 = count
  } else if (parseInt(formatTime(new Date())) >= 1200 && parseInt(formatTime(new Date())) < 1300) {
    result.hr6 = count
  } else if (parseInt(formatTime(new Date())) >= 1300 && parseInt(formatTime(new Date())) < 1400) {
    result.hr7 = count
  } else if (parseInt(formatTime(new Date())) >= 1400 && parseInt(formatTime(new Date())) < 1500) {
    result.hr8 = count
  } else if (parseInt(formatTime(new Date())) >= 1500 && parseInt(formatTime(new Date())) < 1600) {
    result.hr9 = count
  } else if (parseInt(formatTime(new Date())) >= 1600 && parseInt(formatTime(new Date())) < 1700) {
    result.hr10 = count
  } else if (parseInt(formatTime(new Date())) >= 1700 && parseInt(formatTime(new Date())) < 1800) {
    result.hr11 = count
  } else if (parseInt(formatTime(new Date())) >= 1800 && parseInt(formatTime(new Date())) < 1900) {
    result.hr12 = count
  } else if (parseInt(formatTime(new Date())) >= 1900 && parseInt(formatTime(new Date())) < 2000) {
    result.hr13 = count
  } else if (parseInt(formatTime(new Date())) >= 2000 && parseInt(formatTime(new Date())) < 2100) {
    result.hr14 = count
  } else if (parseInt(formatTime(new Date())) >= 2100 && parseInt(formatTime(new Date())) < 2200) {
    result.hr15 = count
  } else if (parseInt(formatTime(new Date())) >= 2200 && parseInt(formatTime(new Date())) < 2300) {
    result.hr16 = count
  }
  await day.set(result).catch(error => {
    throw (error)
  })
}

export const onCountUpdate = functions.database.ref('/value').onUpdate((change, context) => {
    const count = change.after.val();
    // const count = after.value;
    console.log("Inside the updateHrInDay functions")
    console.log("count = " + count)
    updateHrInDay(count).then(function (result) {
      console.log("updated hour successfully")
    }
    ).catch(function (error) {
      console.log(error.message)
    }
    )
  });

export const getDayDetails = async (date: any) => {
  console.log("getDayDetails: " + date)
  const daysRef = db.collection('days');
  const snapshot = await daysRef.where('id', '==', date).get();
  if (snapshot.empty) {
    console.log('No matching documents.');
    return;
  }
  let day = ''
  snapshot.forEach((doc: { id: any; data: () => any; }) => {
    day += JSON.stringify(doc.data());
  });
  return JSON.parse(day)
}

exports.app = functions.https.onRequest(app);
