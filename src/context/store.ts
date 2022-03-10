import { atom } from 'jotai'
import { focusAtom } from 'jotai/optics'
import { atomFamily, atomWithStorage, splitAtom } from 'jotai/utils'

import { Element, XY, Store, Connecting, Selected } from '../types'

const INITIAL_STORE: Store = {
  canvasOffset: { x: 0, y: 0 },
  canvasScale: 1,
  elements: [],
  newElement: null,
  connections: [],
}
const STORE_KEY = 'flow-editor'
export const storeAtom = atomWithStorage<Store>(STORE_KEY, INITIAL_STORE)

export const canvasOffsetAtom = focusAtom(storeAtom, (o) =>
  o.prop('canvasOffset'),
)
export const canvasScaleAtom = focusAtom(storeAtom, (o) =>
  o.prop('canvasScale'),
)
export const elementsAtom = focusAtom(storeAtom, (o) => o.prop('elements'))
export const elementAtomsAtom = splitAtom(elementsAtom)
export const newElementAtom = focusAtom(storeAtom, (o) => o.prop('newElement'))
export const connectionsAtom = focusAtom(storeAtom, (o) =>
  o.prop('connections'),
)
export const connectingAtom = atom<Connecting>({})
export const canvasRectAtom = atom<DOMRect | null>(null)
export const selectedAtom = atom<Selected[]>([])

type AnchorsOffsets = {
  [id: Element['id']]: {
    from?: XY
    to?: XY
  }
}
export const anchorOffsetsAtom = atom<AnchorsOffsets>({})

// helpers

export const elementFamilyById = atomFamily((id: Element['id'] | undefined) =>
  atom((get) => get(elementsAtom).find((e) => e.id === id)),
)

export const selectedFamilyById = atomFamily((id: string | undefined) =>
  atom((get) => get(selectedAtom).find((e) => e.id === id)),
)

export const addElementAtom = atom(null, (get, set, newE: Element) => {
  const frontZIndex = get(frontElementZIndexAtom)
  set(elementsAtom, [
    ...get(elementsAtom),
    { ...newE, zIndex: frontZIndex + 1 },
  ])
})

export const frontElementZIndexAtom = atom((get) => {
  const elements = get(elementsAtom)
  return elements.length ? Math.max(...elements.map((e) => e.zIndex || 0)) : 0
})

export const bringElementFrontAtom = atom(
  null,
  (get, set, id: Element['id']) => {
    const frontZIndex = get(frontElementZIndexAtom)
    set(elementsAtom, (elements) =>
      elements.map((e) => ({
        ...e,
        zIndex:
          e.id === id
            ? e.zIndex === frontZIndex
              ? e.zIndex
              : frontZIndex + 1
            : e.zIndex,
      })),
    )
  },
)

export const delSelectedAtom = atom(null, (get, set) => {
  const selected = get(selectedAtom)
  if (!selected.length) return
  set(elementsAtom, (elements) =>
    elements.filter(
      (e) =>
        !selected
          .filter((s) => s.type === 'element')
          .find((s) => s.id === e.id),
    ),
  )
  set(connectionsAtom, (connections) =>
    connections.filter(
      (c) =>
        !selected.find(
          (s) => s.id === c.id || s.id === c.from || s.id === c.to,
        ),
    ),
  )
  set(selectedAtom, [])
})
