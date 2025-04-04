import { useCallback, createContext, useContext, useState } from 'react'
import { App } from 'antd'
import { EmojiPicker } from './EmojiPicker'

// 创建一个上下文来存储当前活跃的输入框信息
type ActiveInputContextType = {
  activeType: 'user' | 'ai' | null
  activeIndex: number | null
  setActiveInput: (type: 'user' | 'ai' | null, index: number | null) => void
  insertEmoji: (emoji: string) => void
}

const ActiveInputContext = createContext<ActiveInputContextType>({
  activeType: null,
  activeIndex: null,
  setActiveInput: () => {},
  insertEmoji: () => {},
})

export const ActiveInputProvider: React.FC<{
  children: React.ReactNode
  dispatch: any
}> = ({ children, dispatch }) => {
  const [activeType, setActiveType] = useState<'user' | 'ai' | null>(null)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  // 添加状态来保存最后一次活跃的输入框信息，即使在表情选择器打开后也能记住
  const [lastActiveType, setLastActiveType] = useState<'user' | 'ai' | null>(
    null,
  )
  const [lastActiveIndex, setLastActiveIndex] = useState<number | null>(null)

  const setActiveInput = useCallback(
    (type: 'user' | 'ai' | null, index: number | null) => {
      setActiveType(type)
      setActiveIndex(index)
      // 当设置活跃输入框时，同时更新最后活跃的输入框信息
      if (type !== null && index !== null) {
        setLastActiveType(type)
        setLastActiveIndex(index)
      }
    },
    [],
  )

  const insertEmoji = useCallback(
    (emoji: string) => {
      // 优先使用当前活跃的输入框，如果没有则使用最后一次活跃的输入框
      const type = activeType || lastActiveType
      const index = activeIndex !== null ? activeIndex : lastActiveIndex

      if (type && index !== null) {
        try {
          // 如果当前有活跃元素，尝试在光标位置插入表情
          if (activeType && activeIndex !== null && document.activeElement) {
            const currentText = document.activeElement.textContent || ''
            const success = document.execCommand('insertText', false, emoji)

            // 如果execCommand不起作用或返回false，则使用dispatch更新整个文本
            if (
              !success ||
              document.activeElement.textContent === currentText
            ) {
              dispatch.change(index, type, currentText + emoji)
            }
          } else {
            // 如果没有活跃元素，直接使用dispatch更新文本
            // 获取对应输入框的当前文本
            const selector = `[data-type="${type}"][data-index="${index}"]`
            const inputElement = document.querySelector(selector)
            const currentText = inputElement?.textContent || ''
            dispatch.change(index, type, currentText + emoji)
          }
        } catch (error) {
          // 如果出现任何错误，回退到使用dispatch更新整个文本
          console.error('Error inserting emoji:', error)
          // 尝试获取对应输入框的当前文本
          const selector = `[data-type="${type}"][data-index="${index}"]`
          const inputElement = document.querySelector(selector)
          const currentText = inputElement?.textContent || ''
          dispatch.change(index, type, currentText + emoji)
        }
      }
    },
    [activeType, activeIndex, lastActiveType, lastActiveIndex, dispatch],
  )

  return (
    <ActiveInputContext.Provider
      value={{ activeType, activeIndex, setActiveInput, insertEmoji }}
    >
      {children}
    </ActiveInputContext.Provider>
  )
}

export const useActiveInput = () => useContext(ActiveInputContext)

export const useEmojiPicker = () => {
  const { modal } = App.useApp()
  const { insertEmoji } = useActiveInput()

  const openEmojiPicker = useCallback(() => {
    modal.info({
      maskClosable: true,
      closable: true,
      footer: null,
      icon: null,
      title: '挑一个，点一下！',
      content: <EmojiPicker onEmojiSelect={insertEmoji} />,
    })
  }, [modal, insertEmoji])

  return [openEmojiPicker] as const
}
