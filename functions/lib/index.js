"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
//import * as admin from "firebase-admin";
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
exports.helloWorld = functions.https.onRequest((request, response) => {
    response.send("Hello from Firebase!");
});
/* freeNodesRefs.on("value", snapshot => {
      const questionSet = snapshot.val()[0].questionSet;
      console.log("found question sets" + questionSet);
      rootNode.child("/questionSet/" + questionSet).on("value", snapshot => {
        console.log("finding questions in set");
        const question = snapshot.val();
        console.log(question);
      });
    }); */
/*  rootNode
        .child("/questionSet/" + questionSet)
        .once("value")
        .then(snapshot => {
          console.log("finding questions in set");
          const question = snapshot.val();
          console.log(question);
        }); */
/*
admin.initializeApp();
exports.initQuestion = functions.database
  .ref("/leaderboardRow/{leaderboardRowID}/active")
  .onUpdate((snapshot, context) => {
     let teamID: string = (context.params["leaderboardRowID"] + "").split(
      "-"
    )[2];
    //fresh team logged in
    //fetch the first node that is free in ring 4
    const rootNode = snapshot.after.ref.root;
    const ringLevelToQuery = 4;
    const freeNodesRefs = rootNode
      .child("/node/" + ringLevelToQuery + "/")
      .orderByChild("occupiedBy")
      .equalTo(false)
      .limitToFirst(1).ref;
    freeNodesRefs.on("value", snapshot => {
      console.log(snapshot);
      /* const questionSetID = snapshot.child("questionSet").val(); */
/* rootNode.child("/question");
    });
    //fetch the first question in the node since this is a fresh team
    return null;
  });
 */
//# sourceMappingURL=index.js.map