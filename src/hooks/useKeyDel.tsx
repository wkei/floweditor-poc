import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { delSelectedAtom } from '../context/store'

export default function useKeyDel() {
  const [, delSelected] = useAtom(delSelectedAtom)
  useEffect(() => {
    const handleDel = (e: KeyboardEvent) => {
      if (e.key !== 'Backspace') return
      delSelected()
    }
    window.addEventListener('keyup', handleDel)
    return () => {
      window.removeEventListener('keyup', handleDel)
    }
  }, [delSelected])
}
