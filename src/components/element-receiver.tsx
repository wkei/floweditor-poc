import { css, cx } from '@emotion/css'
import { useAtom } from 'jotai'
import { useCallback } from 'react'

import {
  addElementAtom,
  canvasOffsetAtom,
  newElementAtom,
} from '../context/store'
import DraggableReceiver from './draggable-receiver'

interface Props {
  children?: React.ReactNode
}

export default function ElementReceiver({ children }: Props) {
  const [newElement] = useAtom(newElementAtom)
  const [canvasOffset] = useAtom(canvasOffsetAtom)
  const [, addElement] = useAtom(addElementAtom)
  const isReciving = !!newElement

  const handleDrop = useCallback(
    (dropOrigin, dragOrigin) => {
      const type = newElement?.type
      if (!type) return

      addElement({
        type,
        id: `${Math.random().toString(16).substring(2, 8)}`,
        offset: {
          x: dropOrigin.x - dragOrigin.x - canvasOffset.x,
          y: dropOrigin.y - dragOrigin.y - canvasOffset.y,
        },
      })
    },
    [canvasOffset, newElement, addElement],
  )

  return (
    <div
      data-testid="element-receiver"
      className={cx(
        css`
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background: rgba(120, 213, 250, 0.2);
        `,
        {
          [css`
            display: none;
          `]: !isReciving,
        },
      )}
    >
      <DraggableReceiver onDrop={handleDrop}>{children}</DraggableReceiver>
    </div>
  )
}
