import DeleteButton from '@/components/Button/DeleteButton'
import ViewLink from '@/components/Link/ConsultLink'
import EditLink from '@/components/Link/EditLink'
import PageTitle from '@/components/PageTitle/PageTitle'
import { ADD, EXPORT, IMPORT, MANAGE_QUIZZES_PAGE_TITLE, NO_DATA_FOUND, QUIZ_TAGS, QUIZ_TITLE } from '@/constants/common'
import { Quiz } from '@/models/Quiz'
import { useState } from 'react'
import { BiImport } from 'react-icons/bi'
import { GrAdd } from 'react-icons/gr'
import { PiExportBold } from 'react-icons/pi'
import { useNavigate } from 'react-router-dom'
import Table from 'react-table-lite'
import { Tooltip } from 'react-tooltip'
import styles from './ManageQuizzes.module.css'

const ManageQuizzes = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const navigate = useNavigate()

  // useEffect(() => {
  //   HttpClient.get<Quiz[]>('/quizzes').then((res) => setQuizzes(res.data))
  // }, [])

  const exportQuizzes = () => {
    // HttpClient.export('/quizzes/export', 'quizzes.json')
    console.log('export')
  }

  const deleteQuiz = async (quiz: Quiz) => {
    // await HttpClient.delete(`/quizzes/${quiz.id}`).then(
    //   () => ToastService.success(DELETE_WITH_SUCCESS),
    //   HttpClient.handleApiError
    // )
    setQuizzes(quizzes.filter((q) => q.id !== quiz.id))
  }

  return (
    <>
      <div className={styles.title}>
        <PageTitle value={MANAGE_QUIZZES_PAGE_TITLE} />
        <div className={styles.actions}>
          <Tooltip id='export' />
          <PiExportBold onClick={exportQuizzes} className={styles.icon} data-tooltip-id='export' data-tooltip-content={EXPORT} />
          <Tooltip id='import' />
          <BiImport
            onClick={() => navigate('/admin/quiz/import')}
            className={styles.icon}
            data-tooltip-id='import'
            data-tooltip-content={IMPORT}
          />
          <Tooltip id='add' />
          <GrAdd
            onClick={() => navigate('/admin/quiz/add')}
            className={styles.icon}
            data-tooltip-id='add'
            data-tooltip-content={ADD}
          />
        </div>
      </div>
      <Table
        data={quizzes}
        headers={['title', 'tags']}
        customHeaders={{ title: QUIZ_TITLE, tags: QUIZ_TAGS }}
        searchable={true}
        searchBy={['title']}
        sortBy={['title']}
        customRenderCell={{
          tags: (quiz: Quiz) => (
            <div className={styles.tags}>
              {quiz.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          )
        }}
        showActions={true}
        customRenderActions={{
          view: (quiz: Quiz) => <ViewLink to={`/quiz/${quiz.id}`} />,
          edit: (quiz: Quiz) => <EditLink to={`/admin/quiz/edit/${quiz.id}`} />,
          delete: (quiz: Quiz) => <DeleteButton onDelete={() => deleteQuiz(quiz)} />
        }}
        noDataMessage={NO_DATA_FOUND}
      ></Table>
    </>
  )
}

export default ManageQuizzes
