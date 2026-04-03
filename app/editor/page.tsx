import EditorClient from '@/components/EditorClient'

// This is a server component — auth is enforced by middleware.ts
export default function EditorPage() {
  return <EditorClient />
}
