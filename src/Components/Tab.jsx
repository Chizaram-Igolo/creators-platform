import * as React from "react";
import { TabPanel, useTabs } from "./TabPanel";
import { TabSelector } from "./TabSelector";

export default function Basic({ tabName, tabHeading, children }) {
  const [selectedTab, setSelectedTab] = useTabs([
    "myPosts",
    "myComments",
    "team",
    "billing",
  ]);

  return (
    <>
      <nav className="flex border-b border-gray-300">
        <TabSelector
          isActive={selectedTab === "myPosts"}
          onClick={() => setSelectedTab("myPosts")}
        >
          My Posts
        </TabSelector>
        <TabSelector
          isActive={selectedTab === "myComments"}
          onClick={() => setSelectedTab("myComments")}
        >
          My Comments
        </TabSelector>
        <TabSelector
          isActive={selectedTab === "team"}
          onClick={() => setSelectedTab("team")}
        >
          Team Members
        </TabSelector>
        <TabSelector
          isActive={selectedTab === "billing"}
          onClick={() => setSelectedTab("billing")}
        >
          Billing
        </TabSelector>
      </nav>
      <div className="py-4 px-2 mb-5">
        <TabPanel hidden={selectedTab !== "myPosts"}>My Posts</TabPanel>
        <TabPanel hidden={selectedTab !== "myComments"}>My Comments</TabPanel>
        <TabPanel hidden={selectedTab !== "team"}>Team Members</TabPanel>
        <TabPanel hidden={selectedTab !== "billing"}>Billing</TabPanel>
      </div>
    </>
  );
}
