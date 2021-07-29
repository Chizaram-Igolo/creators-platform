import React from "react";
import ContentLoader from "react-content-loader";

export default function SideBarSkeleton(props) {
  return (
    <>
      <ContentLoader
        speed={2}
        width={"100%"}
        height={175}
        viewBox="0 0 100% 147"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
        {...props}
        // style={{ width: "100%" }}
      >
        <rect x="0" y="12" rx="3" ry="3" width="75%" height="6" />
        <rect x="16" y="60" rx="3" ry="3" width="70%" height="6" />
        <rect x="16" y="100" rx="3" ry="3" width="85%" height="6" />
        <rect x="16" y="140" rx="3" ry="3" width="70%" height="6" />
        {/* <rect x="14" y="180" rx="3" ry="3" width="50%" height="7" />
        <rect x="14" y="220" rx="3" ry="3" width="50%" height="7" /> */}

        {/* <circle cx="22.5" cy="22.5" r="22.5" /> */}
      </ContentLoader>

      <ContentLoader
        speed={2}
        width={"100%"}
        height={175}
        viewBox="0 0 100% 264"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
        {...props}
      >
        <rect x="0" y="12" rx="3" ry="3" width="75%" height="6" />
        <rect x="16" y="60" rx="3" ry="3" width="70%" height="6" />
        <rect x="16" y="100" rx="3" ry="3" width="70%" height="6" />
        {/* <rect x="16" y="140" rx="3" ry="3" width="70%" height="6" /> */}
        {/* <rect x="14" y="180" rx="3" ry="3" width="50%" height="7" />
        <rect x="14" y="220" rx="3" ry="3" width="50%" height="7" /> */}

        {/* <circle cx="22.5" cy="22.5" r="22.5" /> */}
      </ContentLoader>
    </>
  );
}
