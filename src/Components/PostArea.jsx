import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Col from "react-bootstrap/Col";
import { useAuth } from "../contexts/AuthContext";

import { Skeleton, Post, NewPost, AlertBox } from "../Components";

// import { RestrictedPostContainer } from "../Components";

export default function PostArea({
  loading,
  error,
  docs,
  hasMore,
  loadMorePosts,
  handleChangeError,
  hidePostForm,
}) {
  const { user } = useAuth();

  return (
    <Col md={{ span: 8 }} lg={{ span: 7 }} className="px-0 pt-0 pt-md-5">
      {loading && (
        <div className="container mt-4 mb-5 pt-3" id="container">
          <Skeleton />
        </div>
      )}

      {!loading && (
        <div className="container pt-4 mb-5">
          <div className="d-flex justify-content-center row">
            <div className="col-md-12 px-2">
              <div className="feed">
                {error && <AlertBox error={error} top={-50} />}
                <div className="flex-row justify-content-between align-items-center pb-2">
                  <div
                    className="feed-text px-2"
                    style={{ position: "relative" }}
                  >
                    {!hidePostForm && user !== null && (
                      <NewPost
                        error={error}
                        handleChangeError={handleChangeError}
                      />
                    )}
                  </div>
                  <div className="feed-icon px-2">
                    <i className="fa fa-long-arrow-up text-black-50"></i>
                  </div>
                </div>

                <InfiniteScroll
                  dataLength={docs.length} //This is important field to render the next data
                  next={loadMorePosts}
                  hasMore={hasMore}
                  loader={
                    <div className="loading pt-4">
                      <div className="circle"></div>
                      <div className="circle"></div>
                      <div className="circle"></div>
                    </div>
                  }
                  endMessage={<p style={{ textAlign: "center" }}></p>}
                  // below props only if you need pull down functionality
                  // refreshFunction={this.getPosts}
                  // pullDownToRefresh
                  // pullDownToRefreshThreshold={50}
                  // pullDownToRefreshContent={
                  //   <h3 style={{ textAlign: "center" }}>
                  //     &#8595; Pull down to refresh
                  //   </h3>
                  // }
                  // releaseToRefreshContent={
                  //   <h3 style={{ textAlign: "center" }}>
                  //     &#8593; Release to refresh
                  //   </h3>
                  // }
                >
                  {docs &&
                    docs.map((doc) => {
                      return (
                        <Post
                          key={doc.id}
                          text={doc.text ? doc.text : null}
                          createdAt={doc.createdAt}
                          comments={doc.comments ? doc.comments : null}
                          images={doc.images ? doc.images : null}
                          thumbnails={doc.thumbnails ? doc.thumbnails : null}
                          videos={doc.videos ? doc.videos : null}
                          files={doc.files ? doc.files : null}
                          resourceList={
                            doc.resourceList ? doc.resourceList : null
                          }
                          postId={doc.id}
                          posterId={doc.posterId}
                          posterUsername={doc.posterUsername}
                          posterPhoto={doc.posterPhoto}
                        />
                      );
                    })}
                </InfiniteScroll>

                {/* <RestrictedPostContainer /> */}
              </div>
            </div>
          </div>
        </div>
      )}
    </Col>
  );
}
