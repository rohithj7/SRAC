"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.admin = void 0;
const admin = require("firebase-admin");
exports.admin = admin;
const functions = require("firebase-functions");
/* eslint linebreak-style: ["error", "windows"]*/
admin.initializeApp({
    credential: admin.credential.cert({
        privateKey: functions.config().private.key.replace(/\\n/g, "\n"),
        projectId: functions.config().project.id,
        clientEmail: functions.config().client.email,
    }),
    databaseURL: "https://theta-tau-cd254.firebaseio.com",
});
const db = admin.firestore();
exports.db = db;
//# sourceMappingURL=firebase.js.map