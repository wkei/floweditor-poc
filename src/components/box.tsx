import { css, cx } from '@emotion/css'
import { ElementType } from '../types'

interface BoxProps {
  type: ElementType
  active?: boolean
  children?: React.ReactNode
}

const roundedStyle = css`
  border-color: #ff613a;
  border-radius: 1rem;
`
const squareStyle = css`
  border-color: rgb(63, 187, 63);
`

const activeStyle = css`
  border-color: rgba(54, 156, 252, 0.8);
`

export default function Box({ type, children, active }: BoxProps) {
  return (
    <div
      data-testid="box"
      className={cx(
        css`
          width: 10rem;
          height: 10rem;
          padding: 0.5em 1em;
          font-size: 0.75rem;
          background: #fff;
          border: 2px solid transparent;
        `,
        {
          [roundedStyle]: type === 'rounded',
          [squareStyle]: type === 'square',
          [activeStyle]: active,
        },
      )}
    >
      <pre>type: {type}</pre>
      {children}
    </div>
  )
}
