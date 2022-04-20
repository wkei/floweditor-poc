import { css, cx } from '@emotion/css'
import { useGesture } from '@use-gesture/react'
import { useAtom } from 'jotai'
import { useEffect, useRef } from 'react'
import {
  anchorOffsetsAtom,
  canvasOffsetAtom,
  canvasRectAtom,
  canvasScaleAtom,
  connectingAtom,
} from '../context/store'
import { Direction, Element } from '../types'

const styles = {
  anchor: css`
    width: 1rem;
    height: 1rem;
    position: absolute;
    top: 50%;
    margin-top: -0.5rem;
    border: 2px solid rgba(54, 156, 252, 0.8);
    background: rgba(255, 255, 255, 0.8);
    border-radius: 100%;
    touch-action: none;
  `,
  from: css`
    right: calc(-0.5rem + 1px);
  `,
  to: css`
    left: calc(-0.5rem + 1px);
  `,
  hidden: css`
    visibility: hidden;
  `,
}

type ConnectAnchorProps = {
  element: Element
  direction: Direction
  active?: boolean
}

export default function ConnectAnchor({
  element,
  direction,
  active,
}: ConnectAnchorProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [canvasRect] = useAtom(canvasRectAtom)
  const [canvasScale] = useAtom(canvasScaleAtom)
  const [canvasOffset] = useAtom(canvasOffsetAtom)
  const [, setConnecting] = useAtom(connectingAtom)
  const [anchorOffset, setAnchorOffset] = useAtom(anchorOffsetsAtom)
  const { id } = element

  const getAnchorOffset = () => {
    if (!ref.current) return null
    const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = ref.current
    return {
      x: offsetLeft + offsetWidth / 2 + (direction === 'to' ? -1 : 0),
      y: offsetTop + offsetHeight / 2,
    }
  }

  useEffect(() => {
    if (!ref.current) return

    setAnchorOffset((prev) => {
      return {
        ...prev,
        [id]: {
          ...prev[id],
          [direction]: getAnchorOffset(),
        },
      }
    })
  }, [ref.current])

  useGesture(
    {
      onMouseDown(state) {
        console.log(state)
        if (direction === 'to') return
        state.event.stopPropagation()
        setConnecting((prev) => ({
          ...prev,
          from: { id },
          to: {
            x: element.offset.x + (anchorOffset[id]?.from?.x ?? 0),
            y: element.offset.y + (anchorOffset[id]?.from?.y ?? 0),
          },
        }))

        const moveListener = (e: MouseEvent) => {
          const canvasRectLeft = canvasRect?.left ?? 0
          const canvasRectTop = canvasRect?.top ?? 0
          const to = {
            x: (e.clientX - canvasRectLeft) / canvasScale - canvasOffset.x,
            y: (e.clientY - canvasRectTop) / canvasScale - canvasOffset.y,
          }
          setConnecting((prev) => ({ ...prev, to: { ...prev.to, ...to } }))
        }
        const rmListener = () => {
          setConnecting({})
          document.removeEventListener('mousemove', moveListener)
          document.addEventListener('mouseup', rmListener)
        }
        document.addEventListener('mousemove', moveListener)
        document.addEventListener('mouseup', rmListener)
      },
    },
    {
      target: ref,
      eventOptions: { passive: false },
      drag: { preventDefault: true },
    },
  )

  return (
    <div
      ref={ref}
      data-testid="connect-anchor"
      className={cx(
        styles.anchor,
        direction === 'from' ? styles.from : styles.to,
        { [styles.hidden]: !active },
      )}
    />
  )
}
