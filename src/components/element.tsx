import { css } from '@emotion/css'
import { useGesture } from '@use-gesture/react'
import { PrimitiveAtom, useAtom } from 'jotai'
import { useCallback, useState } from 'react'

import {
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
  const [hovered, setHovered] = useState(false)
  const { id, offset, zIndex = 0 } = element
  const [selected] = useAtom(selectedFamilyById(id))
  const [, setSelected] = useAtom(selectedAtom)
  const active = hovered || connecting.from?.id === id || !!selected

  const handleMove = useCallback(
    (movement: XY) => {
      setElement((prev) => {
        return {
          ...prev,
          offset: {
            x: prev.offset.x + movement.x, /// canvasScale,
            y: prev.offset.y + movement.y, /// canvasScale,
          },
        }
      })
    },
    [canvasScale, setElement],
  )

  const bindDrag = useGesture(
    {
      onDrag({ delta }) {
        handleMove({ x: delta[0], y: delta[1] })
      },
    },
    {
      drag: { preventDefault: true, filterTaps: true },
    },
  )

  const bindHoverState = useGesture(
    {
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
      onMouseLeave() {
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
      eventOptions: { passive: false },
    },
  )

  return (
    <div
      {...bindHoverState()}
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
      <div {...bindDrag()}>
        <Box type={element.type} active={active}>
          <pre>id: {id}</pre>
          <pre>x: {offset.x}</pre>
          <pre>y: {offset.y}</pre>
        </Box>
      </div>
      <ConnectAnchor element={element} direction="from" active={active} />
      <ConnectAnchor element={element} direction="to" active={active} />
    </div>
  )
}
