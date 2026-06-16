// File: src/Features/product/components/PageHeader.tsx
import React from "react";
import type { PageHeaderProps } from "../types/headerTypes";

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="text-center mb-10">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        {title}
      </h1>
      <p className="text-gray-600">
        {subtitle}
      </p>
    </div>
  );
};

export default PageHeader;