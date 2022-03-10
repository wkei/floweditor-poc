import { css } from '@emotion/css'
import { useGesture } from '@use-gesture/react'
import { PrimitiveAtom, useAtom } from 'jotai'
import { useCallback, useRef, useState } from 'react'

import {
  bringElementFrontAtom,
  canvasScaleAtom,
  connectingAtom,
  connectionsAtom,
  selectedAtom,
  selectedFamilyById,
} from '../context/store'
import { Element, XY } from '../types'
import Box from './box'
import ConnectAnchor from './connect-anchor'

interface ElementProps {
  elementAtom: PrimitiveAtom<Element>
}

export default function CanvasElement({ elementAtom }: ElementProps) {
  const [element, setElement] = useAtom(elementAtom)
  const [canvasScale] = useAtom(canvasScaleAtom)
  const [, setConnections] = useAtom(connectionsAtom)
  const [connecting, setConnecting] = useAtom(connectingAtom)
  const [, bringElementFront] = useAtom(bringElementFrontAtom)
  const [hovered, setHovered] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { id, offset, zIndex = 0 } = element
  const [selected] = useAtom(selectedFamilyById(id))
  const [, setSelected] = useAtom(selectedAtom)
  const active = hovered || connecting.from?.id === id || !!selected

  const handleMove = useCallback(
    (movement: XY) => {
      setElement((prev) => ({
        ...prev,
        offset: {
          x: prev.offset.x + movement.x / canvasScale,
          y: prev.offset.y + movement.y / canvasScale,
        },
      }))
    },
    [canvasScale, setElement],
  )

  useGesture(
    {
      onMouseDown({ event }) {
        event.stopPropagation()
        bringElementFront(id)
        const moveListener = (e: MouseEvent) => {
          handleMove({ x: e.movementX, y: e.movementY })
        }
        const upListener = () => {
          document.removeEventListener('mousemove', moveListener)
          document.addEventListener('mouseup', upListener)
        }
        document.addEventListener('mousemove', moveListener)
        document.addEventListener('mouseup', upListener)
      },
      onMouseEnter() {
        setHovered(true)
        if (connecting.from && connecting.from.id !== id) {
          console.log('lock connecting to', id)
          setConnecting((prev) => ({
            ...prev,
            to: { id },
          }))
        }
      },
      onMouseLeave({ event }) {
        setHovered(false)
        if (connecting.to?.id === id) {
          setConnecting((prev) => {
            delete prev.to?.id
            return prev
          })
        }
      },
      onMouseUp() {
        if (connecting.from?.id && connecting?.to?.id) {
          const from = connecting.from?.id
          const to = connecting.to?.id
          setConnections((prev) => [...prev, { id: `${from}-${to}`, from, to }])
          setConnecting({})
        }
      },
      onClick({ event }) {
        event.stopPropagation()
        setSelected([{ type: 'element', id }])
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
      data-testid="element"
      className={css`
        position: absolute;
        transform: translate(${offset.x}px, ${offset.y}px);
        touch-action: none;
        z-index: ${zIndex};
        pre {
          overflow: hidden;
          text-overflow: ellipsis;
        }
      `}
    >
      <Box type={element.type} active={active}>
        <pre>id: {id}</pre>
        <pre>x: {offset.x}</pre>
        <pre>y: {offset.y}</pre>
      </Box>
      <ConnectAnchor element={element} direction="from" active={active} />
      <ConnectAnchor element={element} direction="to" active={active} />
    </div>
  )
}
