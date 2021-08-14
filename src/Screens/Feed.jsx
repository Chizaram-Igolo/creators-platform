import React, { Component } from "react";
import { projectFirestore } from "../firebase/config";

import { PostArea, Toast } from "../Components";
import "./styles/Feed.css";

export default class Feed extends Component {
  constructor(props) {
    super(props);

    this.state = {
      docs: [],
      latestDoc: null,
      hasMore: true,
      loading: true,
      error: null,
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
