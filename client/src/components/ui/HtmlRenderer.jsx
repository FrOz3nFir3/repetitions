import React, { useEffect, useRef } from "react";
import hljs from "highlight.js/lib/common";
import "highlight.js/styles/atom-one-dark.css";

const HtmlRenderer = ({ htmlContent, className = "" }) => {
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.querySelectorAll("pre code").forEach(async (block) => {
        let language = block.parentElement.dataset.language ?? "plaintext";
        // lowlight has this in common while hightlight doesn't
        if (language === "arduino") {
          const arduino = await import(
            "highlight.js/lib/languages/arduino"
          ).then((_) => _.default);
          hljs.registerLanguage(language, arduino);
        }

        // TODO: add this functionality later to support more languages
        // const languageFunc = await import(
        //   `highlight.js/lib/languages/${language}`
        // ).then((v) => v.default);

        const result = hljs.highlight(block.innerText, {
          language,
        });
        block.innerHTML = result.value;
      });
    }
  }, [htmlContent]);

  return (
    <div
      ref={contentRef}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
      className={`custom-rich-text-editor break-word mt-2 max-h-96 max-w-full pr-2  overflow-auto space-y-2 prose dark:text-white dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl ${
        className ?? ""
      }`}
    />
  );
};

export default React.memo(HtmlRenderer);
