import { projectFirestore, projectStorage } from "./config";

export function deletePost(collection, doc) {
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
