import { FC, useCallback, useRef, useState } from 'react'
import {
  DeleteOutlined,
  PlusCircleOutlined,
  SmileOutlined,
} from '@ant-design/icons'
import { useLocalStorageState } from 'ahooks'
import { Button, Popover, Tooltip, Tour } from 'antd'
import classNames from 'classnames'
import { useEmojiPicker } from '@/app/utils/useEmojiPicker'
import { AIComponent } from '..'
import styles from './styles.module.css'

type DialogProps = {
  hiddenEditIcon?: Boolean
  text: string
  onChange: (newVal: string) => void
  extra?: string
  onChangeExtra: (newVal: string) => void
  dialogIndex?: number // 添加对话索引属性
}

export type UserDialog = FC<DialogProps>
export type AIDialog = FC<DialogProps>

export function withDialogWrapper(
  UserDialog: UserDialog,
  AIDialog: AIDialog,
): AIComponent {
  return function Comp(props) {
    const { dialog, dispatch, hiddenEditIcon } = props
    const [openEmojiPicker] = useEmojiPicker()
    const [tourOpen, startTour, closeTour, tourDOMRef] = useTour()
    return (
      <>
        <div className='bg-white text-base rounded-lg overflow-hidden'>
          {dialog.map((item, index) => (
            <div
              ref={(el) => {
                if (el && index === 0) {
                  startTour(el)
                }
              }}
              key={item.key}
              className={classNames(
                { [styles.tour]: tourOpen && index === 0 },
                styles.dialog,
                'flex flex-col py-5 gap-4 px-4 relative border-b last:border-b-0',
              )}
            >
              <UserDialog
                hiddenEditIcon={hiddenEditIcon}
                text={item.user}
                onChange={(val) => dispatch.change(index, 'user', val)}
                extra={item.extra}
                onChangeExtra={(val) => dispatch.change(index, 'extra', val)}
                dialogIndex={index}
              ></UserDialog>
              <AIDialog
                hiddenEditIcon={hiddenEditIcon}
                text={item.ai}
                onChange={(val) => dispatch.change(index, 'ai', val)}
                extra={item.extra}
                onChangeExtra={(val) => dispatch.change(index, 'extra', val)}
                dialogIndex={index}
              ></AIDialog>
              <div className='absolute top-2 right-2 flex gap-1.5'>
                <Tooltip title='在上方添加对话'>
                  <Button
                    type='text'
                    size='small'
                    icon={
                      <PlusCircleOutlined
                        className={classNames(styles.icon, 'text-blue-500')}
                      />
                    }
                    onClick={() => dispatch.insert(index)}
                  />
                </Tooltip>
                {dialog.length > 1 && (
                  <Tooltip title='删除此对话'>
                    <Button
                      type='text'
                      size='small'
                      danger
                      icon={<DeleteOutlined className={styles.icon} />}
                      onClick={() => dispatch.delete(index)}
                    />
                  </Tooltip>
                )}
              </div>
              <div className='absolute bottom-2 right-2 flex gap-1.5'>
                <Tooltip title='在下方添加对话'>
                  <Button
                    type='text'
                    size='small'
                    icon={
                      <PlusCircleOutlined
                        className={classNames(styles.icon, 'text-blue-500')}
                      />
                    }
                    onClick={() => dispatch.insert(index + 1)}
                  />
                </Tooltip>
                <Tooltip title='添加表情'>
                  <Button
                    type='text'
                    size='small'
                    icon={<SmileOutlined className={styles.icon} />}
                    onClick={openEmojiPicker}
                  />
                </Tooltip>
              </div>
            </div>
          ))}
        </div>
        <Tour
          open={tourOpen}
          closable={false}
          steps={[
            {
              title: (
                <span className='whitespace-nowrap'>在这里编辑对话！</span>
              ),
              target: tourDOMRef.current,

              nextButtonProps: { children: '懂了！', onClick: closeTour },
            },
          ]}
        ></Tour>
      </>
    )
  }
}

const useTour = () => {
  const [showTour, setShowTour] = useLocalStorageState('ai-dialog-showtour', {
    defaultValue: true,
  })
  const [tourOpen, setTourOpen] = useState(false)
  const tourDOMRef = useRef<HTMLDivElement>()
  const startTour = useCallback(
    (el?: HTMLDivElement) => {
      if (el && showTour) {
        tourDOMRef.current = el
        setTourOpen(true)
      }
    },
    [showTour],
  )
  const closeTour = useCallback(() => {
    setShowTour(false)
    setTourOpen(false)
  }, [setShowTour])
  return [tourOpen, startTour, closeTour, tourDOMRef] as const
}
