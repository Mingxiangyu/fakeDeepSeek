'use client'

import { FC, PropsWithChildren, ReactNode } from 'react'
import classNames from 'classnames'

interface CardProps extends PropsWithChildren {
  title?: ReactNode
  className?: string
  bodyClassName?: string
  titleClassName?: string
  fullWidth?: boolean
}

export const Card: FC<CardProps> = ({
  children,
  title,
  className,
  bodyClassName,
  titleClassName,
  fullWidth = false,
}) => {
  return (
    <div
      className={classNames(
        'bg-white rounded-lg border border-gray-100',
        'shadow-sm overflow-hidden',
        fullWidth ? 'w-full' : '',
        className,
      )}
    >
      {title && (
        <div
          className={classNames(
            'px-4 py-3 border-b border-gray-100 bg-gray-50',
            'text-gray-700 font-medium',
            titleClassName,
          )}
        >
          {title}
        </div>
      )}
      <div className={classNames('p-4', bodyClassName)}>{children}</div>
    </div>
  )
}
