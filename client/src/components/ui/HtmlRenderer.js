import React, { useEffect, useRef } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";

const HtmlRenderer = ({ htmlContent }) => {
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.querySelectorAll("pre code").forEach((block) => {
        hljs.highlightElement(block);
      });
    }
  }, [htmlContent]);

  return (
    <div
      ref={contentRef}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
      className="mt-2 overflow-auto space-y-2 prose dark:text-white dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl"
      style={{ whiteSpace: "pre-wrap" }}
    />
  );
};

export default React.memo(HtmlRenderer);
