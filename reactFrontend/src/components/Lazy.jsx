import React, { lazy, Suspense } from "react";

export default function Lazy(loader) {
  return props => {
    let Comp = lazy(loader);
    return (
      <Suspense fallback={<h1>Loading</h1>}>
        <Comp {...props}></Comp>
      </Suspense>
    );
  };
}
