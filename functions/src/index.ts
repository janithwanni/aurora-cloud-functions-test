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
        .ref.orderByChild("occupiedBy").ref;
      console.log("found free nodes", freeNodesRefs);

      freeNodesRefs.once("value").then(snapshot => {
        console.log(snapshot.val());
        let nodeID = Object.keys(snapshot.val())[0];
        rootNode
          .child("/node/" + ringLevelToQuery + "/" + nodeID + "/occupiedBy")
          .set("team-" + teamID);
        console.log(
          "teamID occupied node",
          "/node/" + ringLevelToQuery + "/" + nodeID + "/occupiedBy)"
        );
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

export const onQuestionTimeout = functions.database
  .ref("/teamCurrentQuestion/{teamID}/timeExceeded")
  .onUpdate((snapshot, context) => {
    //ring level constants
    const ringMainScores = { 4: 1, 3: 3, 2: 6, 1: 10 };
    const ringPenalties = { 4: 0.5, 3: 1, 2: 4, 1: 9 };
    const ringTimes = { 4: 120, 3: 105, 2: 90, 1: 60 };
    //collect the variables neeed

    let totalScore: number;
    let score: number = 0;
    let time: number;
    let timeLeft: number; //get from the general timeleft node
    let ringLevel: number;
    let totalDistance: number;
    let timeExceeded: number = 1; //check this from the currentTime field in the progress

    /* //teamID from params
    let teamID: number = context.params.teamID;
    //root node to access database
    let rootNode = snapshot.after.ref.root;
    //get current ring level from the parent node
    let currentringLevel = snapshot.after.ref.parent
      .child("currentRingLevel")
      .once("value", snapshot => {
        //get current level from parent then the total score and total distance 
        //score is 0 and time is the level constant as time is exceeded
        
        ringLevel = snapshot.val();
        time = ringTimes[ringLevel-1];
        
        rootNode
      .child("/teamProgress/" + teamID + "/")
      .orderByKey()
      .limitToFirst(1)
      .ref.once("value", snapshot => {
        totalScore = snapshot.val().totalScore;
        totalDistance = snapshot.val().totalDistance;
        
      });
      }); */
  });

export const onAnswerGiven = functions.database
  .ref("teamCurrentQuestion/{teamID}/timeExceeded")
  .onUpdate((snapshot, context) => {});
