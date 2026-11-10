import { ViewTransition } from "react";

/**
 * Templates re-mount on every navigation, so the page content gets a soft
 * fade-and-rise between routes while the header stays anchored.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="page" exit="page" default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}
