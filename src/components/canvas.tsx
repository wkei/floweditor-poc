import { useCallback, useEffect, useRef, useState } from 'react'
import { useAtom } from 'jotai'
import { css } from '@emotion/css'
import { useGesture, FullGestureState } from '@use-gesture/react'

import dotSvg from '../assets/dot.svg'
import {
  canvasOffsetAtom,
  canvasRectAtom,
  canvasScaleAtom,
  selectedAtom,
} from '../context/store'
import ElementReceiver from './element-receiver'
import Elements from './elements'
import Connections from './connections'

type ZoomState = FullGestureState<'pinch'> | FullGestureState<'wheel'>
type MoveState = FullGestureState<'wheel'> | FullGestureState<'drag'>

const SCALE_MIN = 0.5

export default function Canvas() {
  const ref = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useAtom(canvasOffsetAtom)
  const [scale, setScale] = useAtom(canvasScaleAtom)
  const [, setSelected] = useAtom(selectedAtom)
  const [, setCanvasRect] = useAtom(canvasRectAtom)
  const [spaceKey, setSpaceKey] = useState(false)
  const [dragging, setDragging] = useState(false)
  const tmp = useRef<any>({})

  useEffect(() => {
    if (ref.current) {
      setCanvasRect(ref.current.getBoundingClientRect())
    }
  }, [ref.current])

  const handleScale = useCallback(
    ({ delta, type }: ZoomState) => {
      if (!ref.current) return

      // scale
      const scaleDelta = type === 'wheel' ? delta[1] * 0.01 : -delta[0]
      const newScale = Math.max(SCALE_MIN, scale - scaleDelta)
      // translate during scale
      const { _origin, _offset, _scale } = tmp.current
      const newOffset = {
        x: ((_offset.x - _origin.x / _scale) * newScale + _origin.x) / newScale,
        y: ((_offset.y - _origin.y / _scale) * newScale + _origin.y) / newScale,
      }

      setScale(newScale)
      setOffset(newOffset)
    },
    [scale, setScale, setOffset],
  )

  // listen to space key
  useEffect(() => {
    const spaceKeyListener = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        const { nodeName } = e.target as HTMLElement
        if (nodeName === 'INPUT' || nodeName === 'TEXTAREA') return
        setSpaceKey(true)
      }
    }
    const resetSpaceKey = () => {
      spaceKey && setSpaceKey(false)
    }
    window.addEventListener('keydown', spaceKeyListener)
    window.addEventListener('keyup', resetSpaceKey)
    return () => {
      window.removeEventListener('keydown', spaceKeyListener)
      window.removeEventListener('keyup', resetSpaceKey)
    }
  }, [spaceKey, setSpaceKey])

  useGesture(
    {
      onWheelStart(state) {
        if (state.event.ctrlKey || state.event.metaKey) {
          const { left, top } = ref.current!.getBoundingClientRect()
          tmp.current._origin = {
            x: (state.event as WheelEvent).clientX - left,
            y: (state.event as WheelEvent).clientY - top,
          }
          tmp.current._offset = { ...offset }
          tmp.current._scale = scale
        }
      },
      onWheel(state) {
        // scale by wheel
        if (state.event.ctrlKey || state.event.metaKey) {
          return handleScale(state)
        }

        // move by wheel
        setOffset((prev) => ({
          x: prev.x - state.delta[0] / scale,
          y: prev.y - state.delta[1] / scale,
        }))
      },
      onPinchStart(state) {
        const { left, top } = ref.current!.getBoundingClientRect()
        tmp.current._origin = {
          x: (state as FullGestureState<'pinch'>).origin[0] - left,
          y: (state as FullGestureState<'pinch'>).origin[1] - top,
        }
        tmp.current._offset = { ...offset }
        tmp.current._scale = scale
      },
      // scale by touchpad
      onPinch(state) {
        handleScale(state)
      },
      // move by mouse+spacekey
      onMouseDown() {
        if (!spaceKey) return
        const handleMove = (e: MouseEvent) => {
          setOffset((prev) => ({
            x: prev.x + e.movementX / scale,
            y: prev.y + e.movementY / scale,
          }))
        }
        const rmListener = () => {
          document.removeEventListener('mousemove', handleMove)
          document.addEventListener('mouseup', rmListener)
        }
        document.addEventListener('mousemove', handleMove)
        document.addEventListener('mouseup', rmListener)
      },
      onClick(e) {
        setSelected([])
      },
    },
    {
      target: ref,
      eventOptions: { passive: false },
      pinch: { scaleBounds: { min: SCALE_MIN }, preventDefault: true },
      wheel: { preventDefault: true },
    },
  )

  return (
    <div
      ref={ref}
      data-testid="canvas-container"
      className={css`
        position: relative;
        overflow: hidden;
        background: #fcfcfc;
        touch-action: none;
        cursor: ${spaceKey ? (dragging ? 'grabbing' : 'grab') : 'default'};
      `}
    >
      <div
        data-testid="scale"
        className={css`
          width: ${100 / SCALE_MIN}vw;
          height: ${100 / SCALE_MIN}vh;
          background: ${offset.x}px ${offset.y}px / 16px 16px url(${dotSvg});
          transform: scale(${scale});
          transform-origin: 0 0;
          pointer-events: ${spaceKey ? 'none' : 'auto'};
        `}
      >
        <div
          data-testid="translate"
          className={css`
            height: 100%;
            width: 100%;
            transform: translate(${offset.x}px, ${offset.y}px);
            transform-origin: 0 0;
          `}
        >
          <Elements />
          <Connections />
        </div>
        <ElementReceiver />
      </div>
    </div>
  )
}
