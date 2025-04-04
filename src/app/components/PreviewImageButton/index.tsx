'use client'

import { FC, ReactNode, useEffect, useId, useState } from 'react'
import {
  CheckCircleFilled,
  DownloadOutlined,
  PictureOutlined,
} from '@ant-design/icons'
import { App, Button } from 'antd'
import save from 'file-saver'
import html2canvas from 'html2canvas'
import { createRoot, Root } from 'react-dom/client'
import { AIView, AIViewProps } from '@/app/AIViews'
import { AntdProvider } from '@/lib/AntdProvider'

type PreviewImageButtonProps = Exclude<AIViewProps, 'hiddenEditIcon'> & {
  width: number
}
export const PreviewImageButton: FC<PreviewImageButtonProps> = (props) => {
  const containerRoot = useContainerRoot()
  const id = useId()

  const [loading, setLoading] = useState(false)
  const { modal } = App.useApp()
  const { width, dialog, dispatch, name } = props

  const onClick = async () => {
    if (!containerRoot) {
      throw new Error('未渲染画布')
    }
    setLoading(true)
    const view = (
      <AntdProvider>
        <div id={id} style={{ width }}>
          <AIView
            hiddenEditIcon
            dialog={dialog}
            dispatch={dispatch}
            name={name}
          />
        </div>
      </AntdProvider>
    )

    try {
      const url = await getImage(containerRoot, view, id)
      modal.info({
        icon: null,
        title: (
          <div className='flex items-center gap-2'>
            <CheckCircleFilled className='text-2xl text-green-500' />
            <span>预览生成成功</span>
          </div>
        ),
        closable: true,
        width: 700,
        content: (
          <div className='w-full max-h-[60vh] overflow-auto rounded-lg shadow-md'>
            <img className='w-full' src={url} alt='AI对话预览' />
          </div>
        ),
        okText: '下载图片',
        onOk: () => save(url, `ai-dialog-${props.name}-${Date.now()}.png`),
        okButtonProps: { type: 'primary', icon: <DownloadOutlined /> },
      })
    } catch (error) {
      console.error('生成预览失败:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      type='primary'
      loading={loading}
      onClick={onClick}
      icon={<PictureOutlined />}
    >
      生成预览
    </Button>
  )
}

const useContainerRoot = () => {
  const [containerRoot, setContainerRoot] = useState<Root>()
  useEffect(() => {
    const divDom = document.createElement('div')
    divDom.style.position = 'absolute'
    divDom.style.top = '0'
    divDom.style.left = '0'
    divDom.style.width = '0'
    divDom.style.height = '0'
    divDom.style.overflow = 'hidden'
    document.body.appendChild(divDom)
    setContainerRoot(createRoot(divDom))
  }, [])
  return containerRoot
}

const getImage = async (root: Root, node: ReactNode, id: string) => {
  root.render(node)
  const imageDom = await new Promise<HTMLElement>((resolve, reject) => {
    let restCount = 300
    const timer = setInterval(() => {
      const dom = document.getElementById(id)
      if (dom) {
        clearInterval(timer)
        resolve(dom)
      } else {
        --restCount
        if (restCount === 0) {
          clearInterval(timer)
          reject(new Error('对话框未渲染'))
        }
      }
    }, 100)
  })
  return html2canvas(imageDom, { scale: 10 }).then((canvas) => {
    return new Promise<string>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(URL.createObjectURL(blob))
        } else {
          reject(new Error('canvas.toBlob失败'))
        }
      })
    })
  })
}
