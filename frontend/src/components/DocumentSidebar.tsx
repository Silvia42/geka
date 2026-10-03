import { useState } from 'react'
import DocumentItem from './DocumentItem'
import DocumentPickerModal from './DocumentPickerModal'
import UploadButton from './UploadButton'

export default function DocumentSidebar() {
  const [picker, setPicker] = useState<'documents' | 'folder' | null>(null)

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="px-4 pt-5 pb-3">
          <h2 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground"
              style={{ fontFamily: 'DM Mono, monospace', letterSpacing: '0.1em' }}>
            Documents
          </h2>
        </div>

        <div className="px-2 flex-1 overflow-y-auto scroll-area">
          <DocumentItem
            filename="experian-credit-guide.pdf"
            pages={42}
            status="indexed"
            active
          />
        </div>

        <div className="px-3 pb-4 pt-3 border-t border-border">
          <div className="space-y-2">
            <UploadButton onClick={() => setPicker('documents')} />
            <UploadButton variant="folder" onClick={() => setPicker('folder')} />
          </div>
          <p className="mt-3 text-[11px] text-subtle-foreground leading-relaxed px-1"
             style={{ fontFamily: 'Inter, sans-serif' }}>
            Your answers are grounded in the documents you upload.
          </p>
        </div>
      </div>

      {picker && <DocumentPickerModal mode={picker} onClose={() => setPicker(null)} />}
    </>
  )
}
