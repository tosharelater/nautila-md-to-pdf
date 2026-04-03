'use client'

import { useRef, KeyboardEvent } from 'react'

interface MarkdownEditorProps {
  value: string
  onChange: (val: string) => void
}

export default function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Handle Tab key — insert 2 spaces instead of losing focus
  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Tab') {
      e.preventDefault()
      const el = e.currentTarget
      const start = el.selectionStart
      const end = el.selectionEnd
      const newVal = value.substring(0, start) + '  ' + value.substring(end)
      onChange(newVal)
      // Restore cursor after React re-renders
      requestAnimationFrame(() => {
        el.selectionStart = start + 2
        el.selectionEnd = start + 2
      })
    }
  }

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
      spellCheck={false}
      placeholder="Start typing your Markdown here…

# Heading 1
## Heading 2

Paragraph text with **bold** and *italic*.

- Bullet item
- Another item

| Col A | Col B |
|-------|-------|
| Data  | Data  |

\`\`\`
code block
\`\`\`"
      className="flex-1 w-full resize-none outline-none p-5 font-mono text-sm text-gray-800
        leading-relaxed bg-white placeholder-gray-300
        focus:ring-0 border-0"
      style={{ minHeight: 0 }}
      aria-label="Markdown input"
    />
  )
}
