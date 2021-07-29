import React, { useState } from "react";
import { useParams } from "react-router";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";

import { projectFirestore } from "../firebase/config";
import { SideBar, PostArea, LeftSideBar } from "../Components";
import useGetPostsByUser from "../hooks/useGetPostsByUser";

import "./styles/Feed.css";
import { useEffect } from "react";

export default function UserFeed() {
  const { id } = useParams();
  let { docs, loading, error, latestDoc } = useGetPostsByUser(id);
  const [hasMore, setHasMore] = useState(true);
  const [posts, setPosts] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [unsubscribe, setUnsubscribe] = useState(null);

  useEffect(() => {
    setPosts(docs);
    setLastDoc(latestDoc);
  }, [docs, latestDoc]);

  useEffect(() => {
    if (unsubscribe) {
      return unsubscribe;
    }
  }, [unsubscribe]);

  function loadMorePosts() {
    let unsub = projectFirestore
      .collection("posts")
      .where("posterUsername", "==", id)
      .orderBy("createdAt", "desc")
      .startAfter(lastDoc)
      .limit(3)
      .get()
      .then((querySnapshot) => {
        let lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

        setLastDoc(lastVisible);

        let foundDocs = [...posts];

        querySnapshot.forEach((doc) => {
          foundDocs.push({ ...doc.data(), id: doc.id });
        });

        setPosts(foundDocs);

        setHasMore(querySnapshot.docs.length === 0 ? false : true);
      })
      .catch((err) => {
        // Send email with error to developer.
      });

    setUnsubscribe(unsub);

    // console.log("here");
  }

  return (
    <Container>
      <Row>
        <Col md={{ span: 3 }}>
          <LeftSideBar />
        </Col>

        <PostArea
          loading={loading}
          docs={posts}
          hasMore={hasMore}
          error={error}
          loadMorePosts={loadMorePosts}
          hidePostForm
        />

        <Col>
          <SideBar>
            <Nav
              defaultActiveKey="/"
              className="flex-column fixed-position d-none d-md-block"
            ></Nav>
          </SideBar>
        </Col>
      </Row>
    </Container>
  );
}
