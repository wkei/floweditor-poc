import { css, cx } from '@emotion/css'
import { useAtom } from 'jotai'
import React, { useCallback, useRef } from 'react'
import {
  anchorOffsetsAtom,
  connectingAtom,
  connectionsAtom,
  elementFamilyById,
  selectedAtom,
  selectedFamilyById,
} from '../context/store'
import { Connection } from '../types'
import Connecting from './connecting'
import SvgPath from './svg-path'

function Connected({ id, from, to }: Connection) {
  const ref = useRef<SVGGElement>(null)
  const [anchorOffsets] = useAtom(anchorOffsetsAtom)
  const [fromEl] = useAtom(elementFamilyById(from))
  const [toEl] = useAtom(elementFamilyById(to))
  const [selected] = useAtom(selectedFamilyById(id))
  const [, setSelected] = useAtom(selectedAtom)

  if (!anchorOffsets[from] || !anchorOffsets[to] || !fromEl || !toEl)
    return null

  const fromPosition = {
    x: fromEl.offset.x + (anchorOffsets[from]?.from?.x || 0),
    y: fromEl.offset.y + (anchorOffsets[from]?.from?.y || 0),
  }
  const toPosition = {
    x: toEl.offset.x + (anchorOffsets[to]?.to?.x || 0),
    y: toEl.offset.y + (anchorOffsets[to]?.to?.y || 0),
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSelected([{ type: 'connection', id }])
  }

  return (
    <SvgPath
      key={from + to}
      from={fromPosition}
      to={toPosition}
      active={!!selected}
      onClick={handleClick}
    />
  )
}

const svgStyle = css`
  width: 0.1px;
  height: 0.1px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 9999;
  overflow: visible;
`

export default function Connections() {
  const [connecting] = useAtom(connectingAtom)
  const [connections] = useAtom(connectionsAtom)
  const isConnecting = !!connecting.from || !!connecting.to

  return (
    <svg
      className={cx(svgStyle, {
        [css`
          pointer-events: none;
        `]: isConnecting,
      })}
    >
      {connections.map((conn) => (
        <Connected {...conn} key={conn.id} />
      ))}
      <Connecting />
    </svg>
  )
}
