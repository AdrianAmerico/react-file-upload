/* eslint-disable no-unused-vars */
import React from 'react'
import { FileList } from './components/FileList'
import { Upload } from './components/Upload'
import GlobalStyle from './styles/global'
import { AppContainer, Content } from './styles/styles'
import { uniqueId } from 'lodash'
import filesize from 'filesize'
import api from './services/api'
import { FileData, FullFileData, IFile } from './types/types'

const App = () => {
  const [uploadedFiles, setUploadedFiles] = React.useState<FullFileData[]>([])

  const updateFile = (id: string, data: any) => {
    if (!data.error) {
      const fileUpdated = uploadedFiles.map((uploadedFile) => {
        return id === uploadedFile.id
          ? { ...uploadedFile, ...data }
          : uploadedFile
      })

      setUploadedFiles(fileUpdated)
    }
  }

  const processUpload = (uploadedFile: FileData) => {
    const data = new FormData()

    data.append('file', (uploadedFile.file) as any, uploadedFile.name)

    api
      .post('posts', data, {
        onUploadProgress: e => {
          const progress = parseInt(String(Math.round((e.loaded * 100) / e.total)))
          updateFile(uploadedFile.id, {
            progress
          })
        }
      })
      .then(response => {
        updateFile(uploadedFile.id, {
          uploaded: true,
          id: response.data._id,
          url: response.data.url
        })
      })
      .catch(() => {
        updateFile(uploadedFile.id, {
          error: true
        })
      })
  }

  const handleUpload = (files: IFile[]) => {
    const uploadedFiles = files.map((file) => ({
      file,
      id: uniqueId(),
      name: file.name,
      readableSize: filesize(file.size),
      progress: 0,
      uploaded: false,
      error: false,
      url: ''
    }))

    setUploadedFiles(uploadedFiles)
  }

  const handleDelete = async (id: string) => {
    await api.delete(`posts/${id}`)
    const values = uploadedFiles.filter((file) => file.id !== id)
    setUploadedFiles(values)
  }

  const onSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    uploadedFiles.forEach(processUpload)
  }

  React.useEffect(() => {
    return () => {
      uploadedFiles.forEach((file) => [URL.revokeObjectURL(file.name)])
    }
  }, [])

  return (
    <AppContainer>
      <Content>
        <form onSubmit={onSubmitForm}>
          <Upload onUpload={handleUpload} />
          {!!uploadedFiles.length && (
            <FileList files={uploadedFiles} onDelete={handleDelete} />
          )}
          <button type="submit">subir</button>
        </form>
      </Content>
      <GlobalStyle />
    </AppContainer>
  )
}

export default App
