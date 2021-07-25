import { projectFirestore, projectStorage } from "./config";

export function deletePost(collection, doc) {
  return projectFirestore.collection(collection).doc(doc).delete();
}

export function deleteFiles() {
  // const promises = [];

  return projectStorage.ref().child("files/junk.txt").delete();

  // files.forEach((file) => {
  //   projectStorage
  //     .child(file)
  //     .delete()
  //     .then()
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // });
}
