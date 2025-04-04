'use client'

import { FC, Suspense, useCallback, useMemo, useState } from 'react'
import { Button, InputNumber, Radio, Skeleton, Slider, Space } from 'antd'
import classNames from 'classnames'
import { useImmer } from 'use-immer'
import { Card } from '@/app/components/Card'
import { Layout } from '@/app/components/Layout'
import { PreviewImageButton } from '@/app/components/PreviewImageButton'
import styles from '@/styles/common.module.css'
import { AINames, AIView } from './AIViews'
import { useEmojiPicker, ActiveInputProvider } from './utils/useEmojiPicker'

const App: FC = () => {
  const [aiName, setAIName] = useAIName()
  const [width, compWidthProps] = useAIDialogWidth()
  const [dialog, dispatch] = useAIDialog()
  const [openEmojiPicker] = useEmojiPicker()

  return (
    <ActiveInputProvider dispatch={dispatch}>
      <Layout>
        <Card fullWidth title='对话设置' className='mb-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <div className='font-medium mb-2'>AI 类型</div>
              <Radio.Group
                value={aiName}
                onChange={(e) => setAIName(e.target.value)}
                className='flex flex-wrap gap-2'
              >
                {AINames.map((name) => (
                  <Radio key={name} value={name}>
                    {name}
                  </Radio>
                ))}
              </Radio.Group>
            </div>

            <div>
              <div className='font-medium mb-2'>图片宽度</div>
              <div className='flex items-center gap-3'>
                <InputNumber
                  {...compWidthProps}
                  suffix='px'
                  controls={false}
                  className='w-24'
                />
                <Slider {...compWidthProps} className='flex-1' />
              </div>
            </div>
          </div>
        </Card>

        <Card
          fullWidth
          title='预览区域'
          bodyClassName={classNames(styles.scrollbar, 'min-h-[200px]')}
        >
          <Suspense fallback={<Skeleton className='w-full h-full' active />}>
            <div className='mx-auto' style={{ width }}>
              <AIView dialog={dialog} dispatch={dispatch} name={aiName} />
            </div>
          </Suspense>
        </Card>

        <Space className='mt-6' size='middle'>
          <PreviewImageButton
            dialog={dialog}
            dispatch={dispatch}
            name={aiName}
            width={width}
          />
          <Button onClick={openEmojiPicker} type='default'>
            添加表情
          </Button>
        </Space>
      </Layout>
    </ActiveInputProvider>
  )
}

export default App

const useAIName = () => {
  const [aiName, oriSetAIName] = useState(AINames[0])
  const setAIName = useCallback((newName: string) => {
    if (AINames.indexOf(newName) !== -1) {
      oriSetAIName(newName)
    }
  }, [])
  return [aiName, setAIName] as const
}

const useAIDialogWidth = () => {
  const [width, setWidth] = useState(360) // 默认宽度调整为更合适的尺寸
  const compWidthProps = {
    min: 280,
    max: 720,
    value: width,
    onChange: (val: number | null) => val && setWidth(val),
  }
  return [width, compWidthProps] as const
}

const getDialog = (user?: string, ai?: string, extra?: string) => ({
  user: user || '你好',
  ai: ai || '你好！😊',
  extra,
  key: Date.now(),
})

export type AIDialog = ReturnType<typeof getDialog>[]
export type AIDialogDispatch = ReturnType<typeof useAIDialog>[1]

const useAIDialog = () => {
  const [dialog, setDialog] = useImmer(() => [getDialog()])
  const dispatch = useMemo(() => {
    return {
      insert(index: number, user?: string, ai?: string) {
        setDialog((draft) => {
          draft.splice(index, 0, getDialog(user, ai))
        })
      },
      delete(index: number) {
        setDialog((draft) => {
          draft.splice(index, 1)
        })
      },
      change(index: number, type: 'user' | 'ai' | 'extra', newVal: string) {
        setDialog((draft) => {
          draft[index][type] = newVal
        })
      },
    }
  }, [setDialog])
  return [dialog, dispatch] as const
}
