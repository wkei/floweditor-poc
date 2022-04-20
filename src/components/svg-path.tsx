import { css, cx } from '@emotion/css'
import React from 'react'
import { XY } from '../types'

type SvgPathProps = {
  from: XY
  to: XY
  active?: boolean
  onClick?: (event: React.MouseEvent) => void
}
export default function SvgPath({
  from,
  to,
  active,
  onClick = () => {},
}: SvgPathProps) {
  return (
    <g
      onClick={onClick}
      className={cx(
        css`
          stroke: #ffde71;
          fill: #ffde71;
          :hover,
          &.active {
            stroke: rgb(54, 156, 252);
            fill: rgb(54, 156, 252);
            opacity: 0.8;
          }
        `,
        { active: active },
      )}
    >
      <path
        fill="transparent"
        strokeWidth="2px"
        strokeLinecap="round"
        d={`
          M ${from.x} ${from.y}
          C ${from.x + (to.x - from.x) / 2} ${from.y}
            ${to.x - Math.max((to.x - from.x) / 2, 80)} ${to.y}
            ${to.x} ${to.y}
        `}
      />
      <circle cx={from.x} cy={from.y} r="8" stroke="transparent" />
      <path
        strokeWidth="1px"
        strokeLinecap="round"
        strokeLinejoin="round"
        d={`
          M ${to.x + 1} ${to.y} L ${to.x - 10} ${to.y + 7} L ${to.x - 10} ${
          to.y - 7
        } z
        `}
      />
    </g>
  )
}
