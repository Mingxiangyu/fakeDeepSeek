import Image from 'next/image'
import { Typography } from 'antd'
import classNames from 'classnames'
import { useActiveInput } from '@/app/utils/useEmojiPicker'
import type { AIDialog, UserDialog } from '../withDialogWrapper'
import { withDialogWrapper } from '../withDialogWrapper'
import arrowdown from './arrowdown.svg'
import deepseek from './deepseek.svg'
import think from './think.svg'

const UserDialog: UserDialog = (props) => {
  const { setActiveInput } = useActiveInput()
  return (
    <Typography.Paragraph
      editable={{
        onChange: props.onChange,
        icon: props.hiddenEditIcon ? <span className='hidden'></span> : null,
        triggerType: ['icon', 'text'],
        autoSize: true,
        enterKeyHint: 'enter',
        onStart: () => {
          // 设置当前活跃的输入框为用户输入框
          setActiveInput('user', props.dialogIndex)
        },
        onPressEnter: (e) => {
          e.preventDefault()
          document.execCommand('insertText', false, '\n')
        },
      }}
      style={{ whiteSpace: 'pre-wrap' }}
      data-type='user'
      data-index={props.dialogIndex}
      className='self-end max-w-[75%] rounded-2xl bg-[#EFF6FF] px-4 py-3 mb-0 text-base shadow-sm'
    >
      {props.text}
    </Typography.Paragraph>
  )
}

function isMobile() {
  return /Mobi|Android|iPhone|iPad|iPod|Phone/i.test(navigator.userAgent)
}
const AIDialog: AIDialog = (props) => {
  const mobile = isMobile()
  const { setActiveInput } = useActiveInput()
  return (
    <div className='flex flex-col gap-3'>
      <div className='flex gap-2 items-center'>
        <div className='w-8 h-8 p-0.5 rounded-full border border-solid border-[#d5e4ff] shadow-sm flex items-center justify-center'>
          <Image className='w-full h-full' src={deepseek} alt='deepseek' />
        </div>

        <span className='bg-[#f5f5f5] rounded-xl py-1.5 px-3.5 flex items-center shadow-sm'>
          <Image className='w-3.5 h-3.5 mr-1.5' src={think} alt='think' />

          <span className='text-xs'>
            已深度思考（用时{' '}
            <Typography.Paragraph
              editable={{
                onChange: props.onChangeExtra,
                icon: props.hiddenEditIcon ? (
                  <span className='hidden'></span>
                ) : null,
                triggerType: ['icon', 'text'],
                autoSize: true,
                enterKeyHint: 'enter',
                onPressEnter: (e) => {
                  e.preventDefault()
                  document.execCommand('insertText', false, '\n')
                },
              }}
              style={{ whiteSpace: 'pre-wrap' }}
              className='inline text-xs'
            >
              {props.extra ?? '9'}
            </Typography.Paragraph>
            秒）
          </span>

          <Image className='w-2.5 h-2.5 ml-1' src={arrowdown} alt='arrordown' />
        </span>
      </div>
      <Typography.Paragraph
        editable={{
          onChange: props.onChange,
          icon: props.hiddenEditIcon ? <span className='hidden'></span> : null,
          triggerType: ['icon', 'text'],
          autoSize: true,
          enterKeyHint: 'enter',
          onStart: () => {
            // 设置当前活跃的输入框为AI输入框
            setActiveInput('ai', props.dialogIndex)
          },
          onPressEnter: (e) => {
            e.preventDefault()
            document.execCommand('insertText', false, '\n')
          },
        }}
        style={{ whiteSpace: 'pre-wrap' }}
        data-type='ai'
        data-index={props.dialogIndex}
        className='flex-auto ml-12 text-base bg-white rounded-2xl px-4 py-3 shadow-sm'
      >
        {props.text}
      </Typography.Paragraph>
    </div>
  )
}

const DeepSeek = withDialogWrapper(UserDialog, AIDialog)

export default DeepSeek
