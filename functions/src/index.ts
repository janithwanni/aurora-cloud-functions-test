import * as functions from "firebase-functions";
//import * as admin from "firebase-admin";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});


export const initQuestion = functions.database
  .ref("/leaderboardRow/{leaderboardRowID}/active")
  .onUpdate((snapshot, context) => {
    if (snapshot.after.val() == true) {
      console.log("entering function");
      //console.log(snapshot);
      let teamID: string = (context.params["leaderboardRowID"] + "").split(
        "-"
      )[2];
      teamID = +teamID < 10 ? "0" + teamID : teamID;
      console.log("getting teamid");
      //console.log(teamID);
      const rootNode = snapshot.after.ref.root;
      console.log("getting root node");
      //console.log(rootNode);
      const ringLevelToQuery = 4;
      //console.log(ringLevelToQuery);
      const freeNodesRefs = rootNode
        .child("/node/" + ringLevelToQuery + "/")
        .orderByChild("occupiedBy")
        .equalTo(false).ref;
      console.log("found free nodes");

      freeNodesRefs.ref.once("value").then(snapshot => {
        console.log(snapshot.val());
        let nodeID = Object.keys(snapshot.val())[0];
        rootNode
          .child("/node/" + ringLevelToQuery + "/" + nodeID + "/occupiedBy")
          .set("team-" + teamID);
        console.log("teamID occupied node","/node/" + ringLevelToQuery + "/" + nodeID + "/occupiedBy)";
        console.log(snapshot.val());
        const questionSet = snapshot.val()[Object.keys(snapshot.val())[0]]
          .questionSet;
        console.log("found question sets", questionSet);
        rootNode
          .child("/questionSet/" + questionSet)
          .once("value")
          .then(snapshot => {
            console.log("finding questions in set");
            let question = snapshot.val()[Object.keys(snapshot.val())[0]];
            console.log("found question", question);
            question.questionID = Object.keys(snapshot.val())[0];
            rootNode
              .child("/questionSet/" + questionSet + "/" + question.questionID)
              .update({ usedBy: "team-" + teamID });
            console.log("setting question used by team");

            console.log("question id", question.questionID);
            question.correctAnswerText =
              question.correctAnswerID == 1
                ? question.answerOne
                : question.correctAnswerID == 2
                  ? question.answerTwo
                  : question.correctAnswerID == 3
                    ? question.answerThree
                    : question.answerFour;
            console.log(question.correctAnswerText);
            question.answerGiven = false;
            question.timeExceeded = false;
            question.competitionOver = false;
            question.currentRingLevel = 4;
            question.currentNodeNumber = question.questionID.split("-")[1];
            rootNode
              .child("/teamCurrentQuestion/team-" + teamID)
              .set({
                questionID: question.questionID,
                questionText: question.questionText,
                questionImage: question.questionImage,
                answerOne: question.answerOne,
                answerTwo: question.answerTwo,
                answerThree: question.answerThree,
                answerFour: question.answerFour,
                correctAnswerID: question.correctAnswerID,
                correctAnswerText: question.correctAnswerText,
                answerGiven: question.answerGiven,
                timeExceeded: question.timeExceeded,
                competitionOver: question.competitionOver,
                currentRingLevel: question.currentRingLevel,
                currentNodeNumber: question.currentNodeNumber
              })
              .then(() => {
                console.log("its done");
              });
          });
      });
    }
    return null;
  });

  