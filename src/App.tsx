import React from 'react'
import { FileList } from './components/FileList'
import { Upload } from './components/Upload'
import GlobalStyle from './styles/global'
import { AppContainer, Content } from './styles/styles'
import { uniqueId } from 'lodash'
import filesize from 'filesize'
import api from './services/api'

const App = () => {
  const [uploadedFiles, setUploadedFiles] = React.useState<any[]>([])

  const updateFile = (id: string, data: any) => {
    console.log('de novo', id, data)
    if (!data.error) {
      const fileUpdated = uploadedFiles.map((uploadedFile: any) => {
        return id === uploadedFile.id
          ? { ...uploadedFile, ...data }
          : uploadedFile
      })

      setUploadedFiles(fileUpdated)
    }
  }

  const processUpload = (uploadedFile: any) => {
    const data = new FormData()

    data.append('file', uploadedFile.file, uploadedFile.name)

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

  const handleUpload = (files: any) => {
    const uploadedFiles = files.map((file: any) => ({
      file,
      id: uniqueId(),
      name: file.name,
      readableSize: filesize(file.size),
      preview: URL.createObjectURL(file),
      progress: 0,
      uploaded: false,
      error: false,
      url: null
    }))

    setUploadedFiles(uploadedFiles)

    uploadedFiles.forEach(processUpload)
  }

  const handleDelete = async (id: string) => {
    await api.delete(`posts/${id}`)
    const values = uploadedFiles.filter((file: any) => file.id !== id)
    setUploadedFiles(values)
  }

  React.useEffect(() => {
    return () => {
      uploadedFiles.forEach((file: any) => [URL.revokeObjectURL(file.preview)])
    }
  }, [])

  return (
    <AppContainer>
      <Content>
        <Upload onUpload={handleUpload} />
        {!!uploadedFiles.length && (
          <FileList files={uploadedFiles} onDelete={handleDelete} />
        )}
      </Content>
      <GlobalStyle />
    </AppContainer>
  )
}

export default App
