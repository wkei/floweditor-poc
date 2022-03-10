import { useAtom } from 'jotai'
import { elementAtomsAtom } from '../context/store'
import Element from './element'

export default function Elements() {
  const [elementAtoms] = useAtom(elementAtomsAtom)

  return (
    <>
      {elementAtoms.map((elementAtom, idx) => (
        <Element elementAtom={elementAtom} key={idx} />
      ))}
    </>
  )
}
