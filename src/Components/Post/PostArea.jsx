import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import Post from "./Post";
import { Skeleton, Loader } from "../";
// import RestrictedPostContainer from "./RestrictedPostContainer";

export default function PostArea({
  loading,
  docs,
  hasMore,
  refreshPosts,
  loadMorePosts,
}) {
  return (
    <>
      {loading && (
        <div className="mt-4 mb-5 px-2 px-md-2">
          <Skeleton />
        </div>
      )}

      {!loading && (
        <div className="pt-4 mb-5">
          <InfiniteScroll
            dataLength={docs.length}
            next={loadMorePosts}
            hasMore={hasMore}
            loader={<Loader />}
            endMessage={<p style={{ textAlign: "center" }}></p>}
            // Pull down functionality
            refreshFunction={refreshPosts}
            pullDownToRefresh
            pullDownToRefreshThreshold={50}
            releaseToRefreshContent={<Loader />}
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
                    resourceList={doc.resourceList ? doc.resourceList : null}
                    postId={doc.id}
                    posterId={doc.posterId}
                    posterUsername={doc.posterUsername}
                    posterPhoto={doc.posterPhoto}
                    numLikes={doc.numLikes ? doc.numLikes : 0}
                    numComments={doc.numComments ? doc.numComments : 0}
                  />
                );
              })}
          </InfiniteScroll>

          <div className="px-1">{/* <RestrictedPostContainer /> */}</div>
        </div>
      )}
    </>
  );
}
