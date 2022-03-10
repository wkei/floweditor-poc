import { useAtom } from 'jotai'
import {
  anchorOffsetsAtom,
  connectingAtom,
  elementFamilyById,
} from '../context/store'
import SvgPath from './svg-path'

export default function Connecting() {
  const [connecting] = useAtom(connectingAtom)
  const [anchorOffsets] = useAtom(anchorOffsetsAtom)
  const [fromElement] = useAtom(elementFamilyById(connecting.from?.id))
  const [toElement] = useAtom(elementFamilyById(connecting.to?.id))

  const getFromPosition = () => {
    if (fromElement) {
      const anchorOffset = anchorOffsets[fromElement.id]?.from
      if (!anchorOffset) return null
      return {
        x: fromElement.offset.x + anchorOffset.x,
        y: fromElement.offset.y + anchorOffset.y,
      }
    }
    return null
  }

  const getToPosition = () => {
    if (toElement) {
      const anchorOffset = anchorOffsets[toElement.id]?.to
      if (!anchorOffset) return null
      return {
        x: toElement.offset.x + anchorOffset.x,
        y: toElement.offset.y + anchorOffset.y,
      }
    }
    if (connecting.to?.x !== undefined && connecting.to?.y !== undefined) {
      return {
        x: connecting.to.x,
        y: connecting.to.y,
      }
    }
    return null
  }

  const fromPosition = getFromPosition()
  const toPosition = getToPosition()

  if (!fromPosition || !toPosition) return null

  return <SvgPath from={fromPosition} to={toPosition} active />
}
