import { projectFirestore, projectStorage, timestamp } from "./config";

export async function deletePost(collection, doc) {
  return projectFirestore.collection(collection).doc(doc).delete();
}

export function deleteFiles(postFiles) {
  let promises = [];

  postFiles.forEach((file) => {
    let deleteTask;
    deleteTask = projectStorage.ref(file).delete();
    promises.push(deleteTask);
  });

  return promises;
}

export function checkHasLiked(collection, docID, likerID) {
  return projectFirestore.doc(`${collection}/${docID}/likes/${likerID}`).get();
}

export async function addLike(collection, docID, likerID) {
  // Add one new document in the likes subcollection with
  // id as `likerID`.

  let collectionRef = projectFirestore.collection(collection);
  let docRef = collectionRef.doc(docID);
  let newLikeDocument = docRef.collection("likes").doc(likerID);

  return newLikeDocument.set({});

  // return projectFirestore.runTransaction((transaction) => {
  //   return transaction.get(docRef).then((doc) => {
  //     let data = doc.data();

  //     transaction.update(docRef, { numLikes: data.numLikes + 1 });
  //     return transaction.set(newLikeDocument, {});
  //   });
  // });
}

export function removeLike(collection, docID, likerID) {
  // Add the document in the likes subcollection with
  // id as `likerID`.

  let collectionRef = projectFirestore.collection(collection);
  let docRef = collectionRef.doc(docID);
  let newLikeDocument = docRef.collection("likes").doc(likerID);

  return newLikeDocument.delete();

  // return projectFirestore.runTransaction((transaction) => {
  //   return transaction.get(docRef).then((doc) => {
  //     let data = doc.data();

  //     transaction.update(docRef, { numLikes: data.numLikes - 1 });
  //     return transaction.delete(newLikeDocument);
  //   });
  // });
}

export function addComment(collection, docID, comment) {
  // Adds a document in the comments subcollection.

  let commentObj = { ...comment, createdAt: timestamp() };

  let collectionRef = projectFirestore.collection(collection);
  let docRef = collectionRef.doc(docID);
  let newCommentDocument = docRef.collection("comments").doc();

  return projectFirestore.runTransaction((transaction) => {
    return transaction.get(docRef).then((doc) => {
      let data = doc.data();

      transaction.update(docRef, { numComments: data.numComments + 1 });
      return transaction.set(newCommentDocument, commentObj);
    });
  });
}

export function getComments(collection, docID) {
  return projectFirestore
    .collection(collection)
    .doc(docID)
    .collection("comments")
    .orderBy("createdAt", "desc")
    .limit(3);
}

export function addCommentReply(collection, docID, reply) {
  // Adds a document in the replies sub-subcollection.

  let replyObj = { ...reply, createdAt: timestamp() };

  let collectionRef = projectFirestore.collection(collection);
  let docRef = collectionRef.doc(docID);
  let newReplyDocument = docRef.collection("replies").doc();

  return projectFirestore.runTransaction((transaction) => {
    return transaction.get(docRef).then((doc) => {
      let data = doc.data();

      transaction.update(docRef, { numReplies: data.numReplies + 1 });
      return transaction.set(newReplyDocument, replyObj);
    });
  });
}
