const functions = require("firebase-functions");
const firebaseTools = require("firebase-tools");
const admin = require("firebase-admin");

admin.initializeApp({
  databaseURL: "https://creators-platform-b005b-default-rtdb.firebaseio.com/",
});

const firestore = admin.firestore;

// exports.addUserCreationDate = functions.database
//     .ref("users/{userId}")
//     .onCreate((snap, context) => {
//       functions.logger.log(context.params.userId);

//       return admin
//           .database()
//           .ref("users/" + context.params.userId)
//           .update({
//             creationDate: firestore.FieldValue.serverTimestamp(),
//           });
//     });

// exports.createUserRecord = functions
//     .runWith({memory: "128MB"})
//     .auth.user()
//     .onCreate((user) => {
//       const displayName = user.displayName;
//       const current = admin.firestore.FieldValue.serverTimestamp();

//       functions.logger.log(displayName);

//       return admin
//           .database()
//           .ref("users/" + user.uid)
//           .set({
//             displayName: user.displayName,
//             photoURL: user.photoURL,
//             creationDate: current,
//           });
//     });

exports.deleteUserRecord = functions
    .runWith({memory: "128MB"})
    .auth.user()
    .onDelete((user) => {
      return admin
          .database()
          .ref("users/" + user.uid)
          .remove();
    });

exports.deletePostSubCollections = functions
    .runWith({timeoutSeconds: 240, memory: "256MB"})
    .https.onCall(async (data, context) => {
      if (!context.auth) {
        return null;
      }

      const path = data.path;

      functions.logger.log(process.env.GCLOUD_PROJECT);

      await firebaseTools.firestore.delete(path, {
        project: process.env.GCLOUD_PROJECT,
        recursive: true,
        yes: true,
        token: functions.config().ci_token,
      });

      return {
        path: path,
      };
    });

exports.countLikeChange = functions
    .runWith({memory: "128MB"})
    .firestore.document("/posts/{postId}/likes/{likeId}")
    .onWrite(async (change, context) => {
      const collectionRef = firestore.collection("posts");
      const countRef = collectionRef.doc(context.params.postId);

      functions.logger.log(countRef);

      let increment;
      if (change.after.exists && !change.before.exists) {
        increment = 1;
      } else if (!change.after.exists && change.before.exists) {
        increment = -1;
      } else {
        return null;
      }

      // Return the promise from countRef.transaction() so our function
      // waits for this async event to complete before it exists.
      await countRef.update({
        numLikes: firestore.FieldValue.increment(increment),
      });

      functions.logger.log("Counter updated.");
      return null;
    });
