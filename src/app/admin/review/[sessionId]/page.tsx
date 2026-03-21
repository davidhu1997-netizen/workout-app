'use client'

import { use } from 'react'
import Link from 'next/link'
import { useSession, useTemplate } from '@/hooks/use-data'
import { SessionDetail } from '@/components/admin/session-detail'
import { Button } from '@/components/ui/button'

export default function ReviewSessionPage({
  params,
}: {
  params: Promise<{ sessionId: string }>
}) {
  const { sessionId } = use(params)
  const { data: session, loading: sl } = useSession(sessionId)
  const { data: template, loading: tl } = useTemplate(session?.templateId ?? '')

  if (sl || tl) return null

  if (!session) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-muted mb-4">Session not found.</p>
        <Link href="/admin/review">
          <Button variant="secondary">Back to Review</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-4">
        <Link href="/admin/review" className="text-sm text-brand hover:underline">
          &larr; Back to Review
        </Link>
      </div>
      <SessionDetail session={session} template={template} />
    </div>
  )
}
