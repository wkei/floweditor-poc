export type ElementType = 'square' | 'rounded'

export type XY = {
  x: number
  y: number
}
export type Vector2 = [number, number]

export type Element = {
  id: string
  type: ElementType
  offset: XY
  zIndex?: number
}

export type Direction = 'from' | 'to'

export type Connection = {
  id: string
  from: Element['id']
  to: Element['id']
}

export type Connecting = {
  from?: {
    id?: Element['id']
    x?: number
    y?: number
  }
  to?: {
    id?: Element['id']
    x?: number
    y?: number
  }
}

export type Store = {
  canvasOffset: XY
  canvasScale: number
  elements: Element[]
  newElement: (Partial<Element> & Pick<Element, 'type'>) | null
  connections: Connection[]
}

export type Selected = {
  type: 'element' | 'connection'
  id: string
}
