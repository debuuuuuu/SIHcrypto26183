'use client';

import React, { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface InvestigationMarkdownProps {
  content: string;
  className?: string;
}

/**
 * Preprocesses markdown text from LLM to fix common formatting anomalies:
 * - Unbalanced heading asterisks like `*Interpretation**` -> `**Interpretation**`
 * - Ensures markdown tables have blank lines before and after so remarkGfm detects them
 */
function preprocessMarkdown(text: string): string {
  if (!text) return '';

  let processed = text;

  // Fix single asterisk followed by text and double asterisk e.g. `*Interpretation**`
  processed = processed.replace(/(^|\n)\*([^*]+)\*\*(?=\n|$)/g, '$1**$2**');

  // Fix `**Interpretation*`
  processed = processed.replace(/(^|\n)\*\*([^*]+)\*(?=\n|$)/g, '$1**$2**');

  // Ensure tables have a newline before them if preceded by plain text
  processed = processed.replace(/([^\n])\n(\|?[^\n]+\|[^\n]+\|?\n\|?[-:\s|]+\|)/g, '$1\n\n$2');

  return processed;
}

export const InvestigationMarkdown = memo(
  ({ content, className = '' }: InvestigationMarkdownProps) => {
    const cleanContent = preprocessMarkdown(content);

    return (
      <div className={`investigation-markdown text-xs font-sans text-[#cccccc] ${className}`}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            table: ({ children }) => (
              <div className="overflow-x-auto my-3 border border-[#2a2a2a] rounded bg-[#0e0e0e] shadow-md">
                <table className="w-full text-left font-mono text-[11px] border-collapse">
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className="bg-[#181818] border-b border-[#282828] text-white">
                {children}
              </thead>
            ),
            tbody: ({ children }) => (
              <tbody className="divide-y divide-[#1e1e1e] bg-[#101010]">
                {children}
              </tbody>
            ),
            tr: ({ children }) => (
              <tr className="hover:bg-[#161616] transition-colors">{children}</tr>
            ),
            th: ({ children }) => (
              <th className="px-3 py-2 text-white font-bold uppercase tracking-wider text-[10px] select-text">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="px-3 py-2 text-[#cccccc] select-text whitespace-nowrap md:whitespace-normal">
                {children}
              </td>
            ),
            strong: ({ children }) => (
              <strong className="font-bold text-white">{children}</strong>
            ),
            em: ({ children }) => (
              <em className="italic text-[#dddddd]">{children}</em>
            ),
            p: ({ children }) => (
              <p className="leading-relaxed my-1.5 text-xs text-[#cccccc]">{children}</p>
            ),
            ul: ({ children }) => (
              <ul className="list-disc list-outside ml-4 space-y-1 my-2 text-[#cccccc]">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-outside ml-4 space-y-1 my-2 text-[#cccccc]">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="leading-relaxed pl-0.5">{children}</li>
            ),
            h1: ({ children }) => (
              <h1 className="text-sm font-bold text-white font-mono uppercase tracking-wider mt-3 mb-1.5 pb-1 border-b border-[#222222]">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-xs font-bold text-white font-mono uppercase tracking-wider mt-3 mb-1">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-xs font-bold text-[#eeeeee] font-mono tracking-wide mt-2.5 mb-1">
                {children}
              </h3>
            ),
            h4: ({ children }) => (
              <h4 className="text-[11px] font-bold text-[#cccccc] font-mono uppercase tracking-wide mt-2 mb-0.5">
                {children}
              </h4>
            ),
            code: ({ children }) => (
              <code className="bg-[#181818] border border-[#2a2a2a] px-1.5 py-0.2 rounded text-[10px] font-mono text-white">
                {children}
              </code>
            ),
            hr: () => <hr className="border-[#222222] my-2.5" />,
          }}
        >
          {cleanContent}
        </ReactMarkdown>
      </div>
    );
  }
);

InvestigationMarkdown.displayName = 'InvestigationMarkdown';
