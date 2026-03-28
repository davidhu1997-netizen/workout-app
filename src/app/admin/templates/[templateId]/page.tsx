'use client'

import { use } from 'react'
import { useTemplate } from '@/hooks/use-data'
import { TemplateForm } from '@/components/admin/template-form'
import { PageSpinner } from '@/components/ui/spinner'

export default function EditTemplatePage({
  params,
}: {
  params: Promise<{ templateId: string }>
}) {
  const { templateId } = use(params)
  const { data: template, loading } = useTemplate(templateId)

  if (loading) return <PageSpinner />

  if (!template) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-muted">Template not found.</p>
      </div>
    )
  }

  return <TemplateForm template={template} />
}
