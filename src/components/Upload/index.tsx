import React from 'react'
import Dropzone from 'react-dropzone'
import { IFile } from '../../types/types'
import { DropContainer, UploadMessage } from './styles'

interface UploadProps {
  onUpload: (files: IFile[]) => void
}
export const Upload = ({ onUpload }: UploadProps) => {
  const renderDragMessage = (isDragActive: boolean, isDragReject: boolean) => {
    if (!isDragActive) {
      return <UploadMessage type="default">Arraste arquivos aqui...</UploadMessage>
    }

    if (isDragReject) {
      return <UploadMessage type="error">Arquivo não suportado</UploadMessage>
    }

    return <UploadMessage type="success">Solte os arquivos aqui</UploadMessage>
  }

  return (
    <div>
      <Dropzone accept="text/csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onDrop={(acceptedFiles: any) => onUpload(acceptedFiles)}>
        {({ getRootProps, getInputProps, isDragActive, isDragReject }) => (
          <DropContainer
            {...getRootProps()}
            isDragActive={isDragActive}
            isDragReject={isDragReject}
            className="dropzone"
          >
            <input {...getInputProps()} />
            {renderDragMessage(isDragActive, isDragReject)}
          </DropContainer>
        )}
      </Dropzone>
    </div>
  )
}
