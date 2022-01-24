import styled, { css } from 'styled-components'

interface DropContainerProps {
  isDragActive: boolean;
  isDracInactive: boolean;
}
const dragActive = css`
  border-color: #78e5d5;
`

const dragReject = css`
  border-color: #e57878;
`

export const DropContainer = styled.div.attrs<DropContainerProps>({
  className: 'dropzone'
})`
  border: 1px dashed #ddd;
  border-radius: 4px;
  cursor: pointer;

  transition: height 0.2s ease;

  ${(props: any) => props.isDragActive && dragActive};
  ${(props: any) => props.isDragReject && dragReject};
`

const messageColors: any = {
  default: '#999',
  error: '#e57878',
  success: '#78e5d5'
}

export const UploadMessage = styled.p<{ type: string }>`
  display: flex;
  color: ${(props: any) => messageColors[props.type || 'default']};
  justify-content: center;
  align-items: center;
  padding: 15px 0;
`
