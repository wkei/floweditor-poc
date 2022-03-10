import { css } from '@emotion/css'
import { XY } from '../types'

interface DraggableReceiverProps {
  children: React.ReactNode
  onDrop: (dropOrigin: XY, dragOrigin: XY) => void
}

export default function DraggableReceiver({
  children,
  onDrop,
}: DraggableReceiverProps) {
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.persist()
    if (typeof onDrop === 'function') {
      const dropOrigin = {
        x: event.nativeEvent.offsetX,
        y: event.nativeEvent.offsetY,
      }
      let dragOrigin
      try {
        dragOrigin = JSON.parse(event.dataTransfer?.getData('origin'))
      } catch (e) {
        dragOrigin = {
          x: 0,
          y: 0,
        }
      }
      onDrop(dropOrigin, dragOrigin)
    }
  }

  return (
    <div
      data-testid="receiver"
      className={css`
        width: 100%;
        height: 100%;
      `}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {children}
    </div>
  )
}
