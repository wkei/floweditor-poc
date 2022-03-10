import { css } from '@emotion/css'

interface DraggableProps {
  children: React.ReactNode
  onDragStart?: (event: React.DragEvent) => void
  onDrag?: (event: React.DragEvent) => void
  onDragEnd?: (event: React.DragEvent) => void
}

export default function Draggable({
  children,
  onDragStart = () => {},
  onDrag = () => {},
  onDragEnd = () => {},
}: DraggableProps) {
  return (
    <div
      draggable
      className={css`
        position: relative;
        display: inline-block;
        :active {
          cursor: grabbing;
        }
      `}
      onDragStart={(e) => {
        e.dataTransfer.setData(
          'origin',
          JSON.stringify({
            x: e.nativeEvent.offsetX,
            y: e.nativeEvent.offsetY,
          }),
        )
        onDragStart(e)
      }}
      onDrag={onDrag}
      onDragEnd={onDragEnd}
    >
      {children}
    </div>
  )
}
