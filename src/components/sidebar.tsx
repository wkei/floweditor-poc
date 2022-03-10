import { css } from '@emotion/css'
import { useAtom } from 'jotai'
import {
  canvasOffsetAtom,
  canvasScaleAtom,
  connectingAtom,
  elementsAtom,
  newElementAtom,
  selectedAtom,
  storeAtom,
} from '../context/store'
import { ElementType } from '../types'
import Box from './box'
import Draggable from './draggable'

const CANVAS_ELEMENT_TYPES: ElementType[] = ['square', 'rounded']

export default function Sidebar() {
  const [, setNewElement] = useAtom(newElementAtom)

  const elements = CANVAS_ELEMENT_TYPES.map((type) => (
    <Draggable
      key={type}
      onDragStart={() => setNewElement({ type })}
      onDragEnd={() => setNewElement(null)}
    >
      <Box type={type} />
    </Draggable>
  ))

  return (
    <div
      className={css`
        padding: 1rem;
        border-right: 2px solid #ddd;
        > :not(h3) {
          margin-top: 0.4rem;
        }
      `}
    >
      <h3>Elements</h3>
      {elements}
      <Debug />
    </div>
  )
}

function Debug() {
  const [store] = useAtom(storeAtom)
  const [, setElements] = useAtom(elementsAtom)
  const [, setOffset] = useAtom(canvasOffsetAtom)
  const [, setScale] = useAtom(canvasScaleAtom)
  const [connecting] = useAtom(connectingAtom)
  const [selected] = useAtom(selectedAtom)

  return (
    <>
      <h3>Tools</h3>
      <button onClick={() => setOffset({ x: 0, y: 0 })}>Reset Offset</button>
      <button onClick={() => setScale(1)}>Reset Scale</button>
      <textarea
        readOnly
        value={JSON.stringify({ connecting, selected, ...store }, null, 2)}
        className={css`
          position: fixed;
          z-index: 9999;
          right: 0;
          bottom: 0;
          width: 240px;
          height: calc(100vh - 57px);
          border: none;
          border-left: 2px solid #ddd;
          padding: 0.5rem;
          font-size: 0.75rem;
          background: rgba(255, 255, 255, 0.5);
          resize: none;
          outline: none;
        `}
      />
    </>
  )
}
