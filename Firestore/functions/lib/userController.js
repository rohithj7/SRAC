"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = exports.addUser = void 0;
const firebase_1 = require("./config/firebase");
// /**
//  * Add two numbers.
//  * @param {number} num The first number.
//  * @return {string} The sum of the two numbers.
//  */
// function padTo2Digits(num: number) {
//   return num.toString().padStart(2, "0");
// }
// /**
//  * Add two numbers.
//  * @param {number} date The first number.
//  * @return {string} The sum of the two numbers.
//  */
// function formatDate(date: Date) {
//   return (
//     [
//       date.getFullYear(),
//       padTo2Digits(date.getMonth() + 1),
//       padTo2Digits(date.getDate()),
//     ].join("-")
//   );
// }
const addUser = async (req, res) => {
    const { date, hr1, hr2, hr3, hr4, hr5, hr6, hr7, hr8, hr9, hr10 } = req.body;
    try {
        const user = firebase_1.db.collection("days").doc(date);
        const userObject = {
            id: date,
            date,
            hr1,
            hr2,
            hr3,
            hr4,
            hr5,
            hr6,
            hr7,
            hr8,
            hr9,
            hr10,
        };
        user.set(userObject);
        res.status(200).send({
            status: "success",
            message: "user added successfully",
            data: userObject,
        });
    }
    catch (error) {
        res.status(500).json(error.message);
    }
};
exports.addUser = addUser;
const getUser = async (req, res) => {
    try {
        const allEntries = [];
        const querySnapshot = await firebase_1.db.collection("days").get();
        querySnapshot.forEach((doc) => allEntries.push(doc.data()));
        return res.status(200).json(allEntries);
    }
    catch (error) {
        return res.status(500).json(error.message);
    }
};
exports.getUser = getUser;
//# sourceMappingURL=userController.js.map