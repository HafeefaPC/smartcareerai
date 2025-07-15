'use client'
import { useState } from 'react'
import * as pdfjsLib from 'pdfjs-dist/build/pdf'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

export default function ResumeUpload({ onExtract }: { onExtract: (text: string) => void }) {
  const [text, setText] = useState('')

  const handleFile = async (e: any) => {
    const file = e.target.files[0]
    const reader = new FileReader()

    reader.onload = async () => {
      const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(reader.result as ArrayBuffer) })
      const pdf = await loadingTask.promise
      const page = await pdf.getPage(1)
      const content = await page.getTextContent()
      const extractedText = content.items.map((item: any) => item.str).join(' ')
      setText(extractedText)
      onExtract(extractedText)
    
   
    }
   

    reader.readAsArrayBuffer(file)
  }

  return <input type="file" accept="application/pdf" onChange={handleFile} />
}
