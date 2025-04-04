import {
  FC,
  forwardRef,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
  useCallback,
} from 'react'
import emojiData from '@angelofana/emoji-json'
import { useVirtualList } from 'ahooks'
import { Skeleton, Typography } from 'antd'
import classNames from 'classnames'

const emojiList = emojiData.map((item) => item.char)

const EmojiIcon = forwardRef<
  HTMLElement,
  { index: number; className?: string; onSelect?: (emoji: string) => void }
>(function EmojiIcon(props, ref) {
  const emoji = emojiList[props.index]
  const emojiIcon = <span className='text-2xl'>{emoji}</span>

  const handleClick = () => {
    if (props.onSelect) {
      props.onSelect(emoji)
    }
  }

  return (
    <Typography.Paragraph
      ref={ref}
      className={classNames(props.className, ' m-0 pb-[1em]', 'cursor-pointer')}
      onClick={handleClick}
      copyable={{
        text: emoji,
        icon: [emojiIcon, emojiIcon],
      }}
    ></Typography.Paragraph>
  )
})

type VirtualListInfo = {
  emojiHeight: number
  emojiNumber: number
}

const EmojiVirtualList: FC<
  VirtualListInfo & {
    containerTarget: HTMLElement
    wrapperTarget: HTMLElement
    className?: string
    onEmojiSelect?: (emoji: string) => void
  }
> = (props) => {
  const {
    emojiHeight,
    emojiNumber,
    containerTarget,
    wrapperTarget,
    onEmojiSelect,
  } = props
  const originList = useMemo(
    () =>
      new Array<null>(Math.floor(emojiList.length / emojiNumber)).fill(null),
    [emojiNumber],
  )
  const [list] = useVirtualList(originList, {
    containerTarget,
    wrapperTarget,
    itemHeight: emojiHeight,
  })
  return list.map((item) => (
    <div key={item.index} className='flex justify-evenly'>
      {new Array(emojiNumber).fill(null).map((_, i) => {
        const emojiIndex = item.index * emojiNumber + i
        return (
          <EmojiIcon
            key={emojiIndex}
            index={emojiIndex}
            onSelect={onEmojiSelect}
          ></EmojiIcon>
        )
      })}
    </div>
  ))
}
export const EmojiPicker: FC<{ onEmojiSelect?: (emoji: string) => void }> = ({
  onEmojiSelect,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const emojiIconRef = useRef<HTMLElement | null>(null)
  const [virtualListInfo, setVirtualListInfo] = useState<VirtualListInfo>()

  const handleEmojiSelect = useCallback(
    (emoji: string) => {
      if (onEmojiSelect) {
        // 先调用onEmojiSelect插入表情
        onEmojiSelect(emoji)
        // 关闭模态框
        const closeButton = document.querySelector(
          '.ant-modal-close',
        ) as HTMLElement
        if (closeButton) {
          closeButton.click()
        }
      }
    },
    [onEmojiSelect],
  )

  useEffect(() => {
    const containerWidth = containerRef.current!.clientWidth
    const emojiWidth = emojiIconRef.current!.clientWidth
    const emojiNumber = Math.floor(containerWidth / emojiWidth)
    const emojiHeight = emojiIconRef.current!.clientHeight
    setTimeout(() => setVirtualListInfo({ emojiNumber, emojiHeight }), 200)
  }, [])

  return (
    <div
      ref={containerRef}
      className='flex flex-wrap justify-evenly h-[50vh] relative overflow-auto'
    >
      <Skeleton
        paragraph={{ rows: 5 }}
        className={classNames('absolute', { hidden: virtualListInfo })}
        active
      ></Skeleton>
      <div
        ref={wrapperRef}
        className={classNames({
          ' opacity-0 select-none pointer-events-none': !virtualListInfo,
        })}
      >
        {!virtualListInfo ? (
          <EmojiIcon ref={emojiIconRef} index={0}></EmojiIcon>
        ) : (
          <EmojiVirtualList
            {...virtualListInfo!}
            containerTarget={containerRef.current!}
            wrapperTarget={wrapperRef.current!}
            onEmojiSelect={handleEmojiSelect}
          ></EmojiVirtualList>
        )}
      </div>
    </div>
  )
}
