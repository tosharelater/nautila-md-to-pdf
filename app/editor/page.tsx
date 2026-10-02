import AuthGate from '@/components/AuthGate'
import EditorClient from '@/components/EditorClient'

export default function EditorPage() {
  return (
    <AuthGate>
      <EditorClient />
    </AuthGate>
  )
}
