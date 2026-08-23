import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ReactNode } from "react";

/**
 * Lazy-loaded markdown renderer used by FxAssistant.
 * Isolating this into its own chunk keeps react-markdown + remark-gfm
 * (~80KB gzipped) out of AuthShellLazy, loading them only when the
 * assistant opens and receives a reply.
 */
export default function AssistantMarkdown({
  content,
  onInternalLink,
}: {
  content: string;
  onInternalLink: (href: string) => void;
}) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        a: ({ href, children, ...props }: { href?: string; children?: ReactNode }) => {
          const isInternal = typeof href === "string" && href.startsWith("/");
          if (isInternal && href) {
            return (
              <a
                href={href}
                onClick={(e) => {
                  e.preventDefault();
                  onInternalLink(href);
                }}
                className="text-primary underline underline-offset-2 hover:text-primary/80 cursor-pointer"
              >
                {children}
              </a>
            );
          }
          return (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2 hover:text-primary/80"
              {...props}
            >
              {children}
            </a>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
