import { SiteFooter } from "@/features/auction-site/components/site-footer";
import React from "react";
import { SiteHeader } from "@/features/auction-site/components/site-header";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
};

export default layout;
