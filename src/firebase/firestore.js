import { projectFirestore } from "./config";

export function deletePost(collection, doc) {
  return projectFirestore.collection(collection).doc(doc).delete();
}
