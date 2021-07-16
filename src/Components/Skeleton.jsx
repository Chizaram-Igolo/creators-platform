import React from "react";
import ContentLoader from "react-content-loader";

export default function Skeleton(props) {
  return (
    <>
      <ContentLoader
        speed={2}
        width={"100%"}
        height={564}
        viewBox="0 0 100% 564"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
        {...props}
      >
        <rect x="54" y="12" rx="3" ry="3" width="15%" height="6" />
        <rect x="54" y="30" rx="3" ry="3" width="9%" height="6" />
        <rect x="0" y="70" rx="3" ry="3" width="100%" height="8" />
        <rect x="0" y="92" rx="3" ry="3" width="100%" height="8" />
        <rect x="0" y="114" rx="3" ry="3" width="45%" height="8" />
        <rect x="0" y="160" rx="2" ry="2" width="100%" height="350" />

        <circle cx="22.5" cy="22.5" r="22.5" />
      </ContentLoader>

      <ContentLoader
        speed={2}
        width={"100%"}
        height={124}
        viewBox="0 0 100% 124"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
        {...props}
      >
        <rect x="54" y="12" rx="3" ry="3" width="15%" height="6" />
        <rect x="54" y="30" rx="3" ry="3" width="9%" height="6" />
        <rect x="0" y="70" rx="3" ry="3" width="100%" height="8" />
        <rect x="0" y="92" rx="3" ry="3" width="100%" height="8" />
        <rect x="0" y="114" rx="3" ry="3" width="45%" height="8" />

        <circle cx="22.5" cy="22.5" r="22.5" />
      </ContentLoader>
    </>
  );
}
