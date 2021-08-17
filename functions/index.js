const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

exports.createUserRecord = functions.auth.user().onCreate(async (user) => {
  await admin
      .database()
      .ref("users/" + user.uid)
      .set({
        username: user.displayName,
        photoURL: user.photoURL,
        subscriptions: [],
      }).then;

  return null;
});

// Listens for new messages added to /messages/:documentId/original and
// creates an uppercase version of the message to
// /messages/:documentId/uppercase

exports.countLikeChange = functions
    .runWith({memory: "128MB"})
    .firestore.document("/posts/{postId}/likes/{likeId}")
    .onWrite(async (change, context) => {
      const collectionRef = admin.firestore().collection("posts");
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
        numLikes: admin.firestore.FieldValue.increment(increment),
      });

      functions.logger.log("Counter updated.");
      return null;
    });

exports.makeUppercase = functions.firestore
    .document("/messages/{documentId}")
    .onCreate((snap, context) => {
    // Grab the current value of what was written to Firestore.
      const original = snap.data().original;

      // Access the parameter `{documentId}` with `context.params`
      functions.logger.log("Uppercasing", context.params.documentId, original);

      const uppercase = original.toUpperCase();
      const lowercase = original.toLowerCase();

      return snap.ref.set(
          {uppercase: uppercase, lowercase: lowercase},
          {merge: true},
      );
    });

exports.makeLowercase = functions.firestore
    .document("/posts/{documentId}")
    .onCreate((snap, context) => {
      const {text} = snap.data();

      functions.logger.log("Lowercasing", context.params.documentId, text);

      const lowercase = text.toLowerCase();

      return snap.ref.set({text: lowercase}, {merge: true});
    });
