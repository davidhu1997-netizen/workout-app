'use client'

import Link from 'next/link'
import { useTemplates } from '@/hooks/use-data'
import { Button } from '@/components/ui/button'
import { TemplateList } from '@/components/admin/template-list'

export default function TemplatesPage() {
  const { data: templates, loading, refetch } = useTemplates()

  if (loading) return null

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold font-heading">Workout Templates</h2>
        <Link href="/admin/templates/new">
          <Button size="sm">+ New Template</Button>
        </Link>
      </div>
      <TemplateList templates={templates} onRefresh={refetch} />
    </div>
  )
}
