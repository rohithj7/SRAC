import {Response} from "express";
import {db} from "./config/firebase";
/* eslint linebreak-style: ["error", "windows"]*/

type UserType = {
    date: string,
    hr1: string,
    hr2: string,
    hr3: string,
    hr4: string,
    hr5: string,
    hr6: string,
    hr7: string,
    hr8: string,
    hr9: string,
    hr10: string,
}

type Request = {
    body: UserType,
    params: { userId: string }
}

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

const addUser = async (req: Request, res: Response) => {
  const {date, hr1, hr2, hr3, hr4, hr5, hr6, hr7, hr8, hr9, hr10} = req.body;
  try {
    const user = db.collection("days").doc(date);
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
  } catch (error:any) {
    res.status(500).json(error.message);
  }
};

const getUser = async (req: Request, res: Response) => {
  try {
    const allEntries: UserType[] = []
    const querySnapshot = await db.collection("days").get()
    querySnapshot.forEach((doc: any) => allEntries.push(doc.data()))
    return res.status(200).json(allEntries)
  } catch(error:any) { return res.status(500).json(error.message) }
};

export {addUser,getUser};
