import Image from 'next/image'
import { Typography } from 'antd'
import { useActiveInput } from '@/app/utils/useEmojiPicker'
import type { AIDialog, UserDialog } from '../withDialogWrapper'
import { withDialogWrapper } from '../withDialogWrapper'
import Gpt from './gpt.svg'

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
      className='self-end max-w-[75%] rounded-2xl bg-blue-50 px-4 py-3 mb-0 shadow-sm'
    >
      {props.text}
    </Typography.Paragraph>
  )
}

const AIDialog: AIDialog = (props) => {
  const { setActiveInput } = useActiveInput()

  return (
    <div className='flex gap-3'>
      <div className='flex-shrink-0 mt-1'>
        <Image className='w-7 h-7 rounded-full' src={Gpt} alt='gpt' />
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
        className='flex-auto bg-gray-50 rounded-2xl px-4 py-3 mb-0 shadow-sm'
      >
        {props.text}
      </Typography.Paragraph>
    </div>
  )
}

const Chatgpt = withDialogWrapper(UserDialog, AIDialog)

export default Chatgpt
