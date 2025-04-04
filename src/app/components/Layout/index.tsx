'use client'

import { FC, PropsWithChildren } from 'react'
import { Typography } from 'antd'
import classNames from 'classnames'

interface LayoutProps extends PropsWithChildren {
  title?: string
  className?: string
}

export const Layout: FC<LayoutProps> = ({
  children,
  title = 'AI对话框截图生成器',
  className,
}) => {
  return (
    <div
      className={classNames(
        'min-h-full w-full bg-gradient-to-b from-blue-50 to-indigo-50',
        'overflow-auto py-6 px-4',
        className,
      )}
    >
      <div
        className={classNames(
          'max-w-[800px] mx-auto',
          'flex flex-col gap-6 items-center',
          'bg-white rounded-xl shadow-md',
          'p-6',
        )}
      >
        <Typography.Title level={2} className='m-0 text-center'>
          {title}
        </Typography.Title>
        {children}
      </div>
    </div>
  )
}
