import styles from './PageTitle.module.css'

const PageTitle = ({ value }: { value: string }) => {
  return <h1 className={styles.title}>{value}</h1>
}

export default PageTitle
