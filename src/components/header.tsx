import { css } from '@emotion/css'

const styles = {
  header: css`
    padding: 1rem;
    border-bottom: 2px solid #ddd;
  `,
  logo: css`
    font-size: 1.25rem;
    margin: 0;
  `,
}

export default function Header() {
  return (
    <div className={styles.header}>
      <h1 className={styles.logo}>{'<Test />'}</h1>
    </div>
  )
}
