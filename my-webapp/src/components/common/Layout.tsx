import React from "react";
import { BaseProps } from "../../types";

interface LayoutProps extends BaseProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

/**
 * 애플리케이션 기본 레이아웃 컴포넌트
 */
const Layout: React.FC<LayoutProps> = ({
  children,
  header,
  footer,
  className = "",
  ...props
}) => {
  return (
    <div className={`min-h-screen flex flex-col ${className}`} {...props}>
      {header && (
        <header className="bg-white shadow py-4 px-6">{header}</header>
      )}

      <main className="flex-grow p-6">{children}</main>

      {footer && (
        <footer className="bg-gray-100 py-4 px-6 mt-auto">{footer}</footer>
      )}
    </div>
  );
};

export default Layout;
