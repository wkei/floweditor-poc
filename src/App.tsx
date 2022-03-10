import { css } from '@emotion/css'
import Canvas from './components/canvas'
import Header from './components/header'

import Sidebar from './components/sidebar'
import useKeyDel from './hooks/useKeyDel'

const Container = ({ children }: { children: React.ReactNode }) => (
  <div
    className={css`
      height: 100%;
      display: grid;
      grid-template-columns: 12.5rem 1fr;
      grid-template-rows: auto 1fr;
      user-select: none;
    `}
  >
    {children}
  </div>
)

function App() {
  useKeyDel()

  return (
    <Container>
      <div
        className={css`
          grid-column: 1 / span 2;
        `}
      >
        <Header />
      </div>
      <Sidebar />
      <Canvas />
    </Container>
  )
}

export default App
