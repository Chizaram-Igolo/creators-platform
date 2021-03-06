import React, { Component, useState, useEffect } from "react";
import { useParams } from "react-router";

import { projectDatabase, projectFirestore } from "../firebase/config";
import { NewPost, PostArea, ProfileHeader, Toast } from "../Components";

import "./styles/Feed.css";
import { useAuth } from "../contexts/AuthContext";

class Wall extends Component {
  constructor(props) {
    super(props);

    this.state = {
      docs: [],
      latestDoc: null,
      hasMore: true,
      loading: true,
      error: null,
      userId: this.props.userId,
    };

    this.getPosts = this.getPosts.bind(this);
    this.loadMorePosts = this.loadMorePosts.bind(this);
    this.refreshPosts = this.refreshPosts.bind(this);
    this.handleChangeError = this.handleChangeError.bind(this);
  }

  handleChangeError(error) {
    this.setState({ error });
  }

  getPosts() {
    let set = this;

    this.unsubscribe = projectFirestore
      .collection("posts")
      .where("posterUsername", "==", this.state.userId)
      .orderBy("createdAt", "desc")
      .limit(5)
      .onSnapshot(
        function (snap) {
          const docs = [];
          var latestDoc = snap.docs[snap.docs.length - 1];

          snap.forEach(function (doc) {
            docs.push({ ...doc.data(), id: doc.id });
          });

          set.setState({
            docs,
            latestDoc,
            loading: false,
            hasMore: snap.docs.length === 0 ? false : true,
          });
        },
        (err) => {
          // Send email with error to developer.
        }
      );
  }

  refreshPosts() {
    this.unsubscribe();
    this.setState({ docs: [], loading: true });
    this.getPosts();
  }

  componentDidMount() {
    this.getPosts();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  loadMorePosts() {
    let set = this;
    let latestDoc = this.state.latestDoc;

    if (latestDoc.data()["createdAt"] == null) {
      return;
    }

    this.unsubscribe = projectFirestore
      .collection("posts")
      .orderBy("createdAt", "desc")
      .startAfter(latestDoc)
      .limit(3)
      .onSnapshot(
        (snap) => {
          const docs = [];
          var latestDoc = snap.docs[snap.docs.length - 1];

          snap.forEach((doc) => {
            docs.push({ ...doc.data(), id: doc.id });
          });

          let updatedDocs = set.state.docs.concat(docs);

          set.setState({
            docs: updatedDocs,
            latestDoc,
            loading: false,
            hasMore: snap.docs.length === 0 ? false : true,
          });
        },
        (err) => {
          // Send email with error to developer
          this.props.addToast(
            <Toast heading="We're sorry" body={err.message} />,
            {
              appearance: "error",
              autoDismiss: false,
            }
          );
        }
      );
  }

  render() {
    const { loading, docs, hasMore, error } = this.state;
    const { refreshPosts, loadMorePosts, handleChangeError } = this;

    return (
      <PostArea
        loading={loading}
        docs={docs}
        hasMore={hasMore}
        error={error}
        refreshPosts={refreshPosts}
        loadMorePosts={loadMorePosts}
        handleChangeError={handleChangeError}
      />
    );
  }
}

export default function UserFeed() {
  const { id } = useParams();
  const { user, userProfile } = useAuth();
  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    if (id !== null) {
      // Don't do an unneccessary query.

      if ((user !== null && id === user?.displayName) || id === "profile") {
        setUserDetails({
          username: user?.displayName,
          photoURL: user?.photoURL,
          ...userProfile,
        });
      } else {
        projectDatabase
          .ref("users")
          .orderByChild("username")
          .equalTo(id)
          .once("value", (snap) => {
            for (let x in snap.val()) {
              setUserDetails(snap.val()[x]);
            }
          })
          .catch((err) => {
            // Send email with error to developer.
          });
      }
    }

    // if (user !== null && user.displayName !== null && id === user.displayName) {
    // } else {
    // }
  }, [user, id, userProfile]);

  let postsElem;

  if (user !== null && user?.displayName !== null && id === user?.displayName) {
    postsElem = (
      <>
        <NewPost />
        <Wall userId={id} />
      </>
    );
  } else {
    postsElem = (
      <>
        <Wall userId={id} />
      </>
    );
  }

  // const tabContent = [
  //   { selector: "myPosts", heading: "My Posts", body: postsElem },
  //   { selector: "engagements", heading: "Engagements", body: "Engagements" },
  // ];

  // const selectors = [tabContent.map((item) => item.selector)];

  return (
    <div style={{ minHeight: "800px" }}>
      <div className="mb-4" style={{ marginTop: "-40px" }}>
        <ProfileHeader userDetails={userDetails} />
      </div>

      {postsElem}

      {/* <IconTabs tabContent={tabContent} /> */}

      {/* <div className="pt-2 pl-0 pr-1 pb-3 mb-0">
        <Tab selectors={selectors} tabContent={tabContent} />
      </div> */}
    </div>
  );
}
