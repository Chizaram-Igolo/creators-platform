import React, { Component } from "react";
import { useParams } from "react-router";

import { projectFirestore } from "../firebase/config";
import { NewPost, PostArea, ProfileHeader, Tab, Toast } from "../Components";

import "./styles/Feed.css";

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

  const postsElem = (
    <>
      <label class="mdc-text-field mdc-text-field--textarea">
        <span class="mdc-notched-outline">
          <span class="mdc-notched-outline__leading"></span>
          <span class="mdc-notched-outline__notch">
            <span class="mdc-floating-label" id="my-label-id">
              Textarea Label
            </span>
          </span>
          <span class="mdc-notched-outline__trailing"></span>
        </span>
        <span class="mdc-text-field__resizer">
          <textarea
            class="mdc-text-field__input"
            aria-labelledby="my-label-id"
            rows="8"
            cols="40"
            maxlength="140"
          ></textarea>
        </span>
      </label>
      <div class="mdc-text-field-helper-line">
        <div class="mdc-text-field-character-counter">0 / 140</div>
      </div>
      <TextField
        id="filled-multiline-static"
        label="Multiline"
        multiline
        rows={4}
        defaultValue="Default Value"
        variant="filled"
      />
      <NewPost />
      <Wall userId={id} />
    </>
  );

  const tabContent = [
    { selector: "myPosts", heading: "My Posts", body: postsElem },
    { selector: "engagements", heading: "Engagements", body: "Engagements" },
  ];

  const selectors = [tabContent.map((item) => item.selector)];

  return (
    <div style={{ minHeight: "800px" }}>
      <div className="px-2">
        <ProfileHeader />
      </div>
      <div className="pt-2 pl-0 pr-1 pb-3 mb-0">
        <Tab selectors={selectors} tabContent={tabContent} />
      </div>
    </div>
  );
}
