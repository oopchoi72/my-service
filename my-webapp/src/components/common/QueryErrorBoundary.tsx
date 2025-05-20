import React from "react";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { getUserFriendlyErrorMessage } from "../../utils";
import ErrorMessage from "./ErrorMessage";

interface QueryErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * React Query 오류 처리를 위한 ErrorBoundary 컴포넌트
 */
const QueryErrorBoundary: React.FC<QueryErrorBoundaryProps> = ({
  children,
  fallback,
}) => {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }: FallbackProps) => {
            if (fallback) return <>{fallback}</>;

            return (
              <div className="p-4 rounded-md bg-red-50 border border-red-200">
                <ErrorMessage
                  message={getUserFriendlyErrorMessage(error)}
                  variant="alert"
                  onRetry={resetErrorBoundary}
                />
              </div>
            );
          }}
        >
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};

export default QueryErrorBoundary;
