import * as React from "react";
import { TabPanel, useTabs } from "./TabPanel";
import { TabSelector } from "./TabSelector";

export default function Basic({ selectors, tabContent }) {
  const [selectedTab, setSelectedTab] = useTabs(["myPosts", "engagements"]);

  return (
    <>
      <nav className="flex border-b border-gray-300">
        {tabContent.map((item) => (
          <TabSelector
            isActive={selectedTab === item.selector}
            onClick={() => setSelectedTab(item.selector)}
            key={item.selector}
          >
            {item.heading}
          </TabSelector>
        ))}
      </nav>
      <div className="py-4 px-2 mb-5">
        {tabContent.map((item) => (
          <TabPanel hidden={selectedTab !== item.selector} key={item.selector}>
            {item.body}
          </TabPanel>
        ))}
      </div>
    </>
  );
}
