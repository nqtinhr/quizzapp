import quizApi from '@/api/quizApi'
import DeleteButton from '@/components/Button/DeleteButton'
import ViewLink from '@/components/Link/ConsultLink'
import EditLink from '@/components/Link/EditLink'
import PageTitle from '@/components/PageTitle/PageTitle'
import {
  ADD,
  EXPORT,
  IMPORT,
  MANAGE_QUIZZES_PAGE_TITLE,
  NO_DATA_FOUND,
  QUIZ_TAGS,
  QUIZ_TITLE
} from '@/constants/common'
import { quizListAPI, removeQuiz } from '@/redux/quizSlice'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { IQuiz } from '@/types/quiz'
import { useEffect } from 'react'
import { BiImport } from 'react-icons/bi'
import { GrAdd } from 'react-icons/gr'
import { PiExportBold } from 'react-icons/pi'
import { useNavigate } from 'react-router-dom'
import Table from 'react-table-lite'
import { Tooltip } from 'react-tooltip'
import styles from './ManageQuizzes.module.css'
import { toast } from 'react-toastify'

const ManageQuizzes = () => {
  const dispatch = useAppDispatch()
  const { quizzes, pagination } = useAppSelector((state) => state.quiz)

  const navigate = useNavigate()

  useEffect(() => {
    dispatch(quizListAPI({ params: { page: pagination.page, limit: pagination.limit } }))
  }, [dispatch, pagination.page, pagination.limit])

  const exportQuizzes = async () => {
    const result: any = await quizApi.exportQuizzes()
    if (result.statusCode === 200) {
      toast.success('Quizzes exported successfully')
    }
  }

  const deleteQuiz = async (quiz: IQuiz) => {
    const result: any = await quizApi.deleteQuiz(quiz.id as string)
    if (result.statusCode === 200) {
      dispatch(removeQuiz(quiz.id as string))
      toast.success('Quiz deleted successfully')
    }
  }

  return (
    <>
      <div className={styles.title}>
        <PageTitle value={MANAGE_QUIZZES_PAGE_TITLE} />
        <div className={styles.actions}>
          <Tooltip id='export' />
          <PiExportBold
            onClick={exportQuizzes}
            className={styles.icon}
            data-tooltip-id='export'
            data-tooltip-content={EXPORT}
          />
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
          tags: (quiz: IQuiz) => (
            <div className={styles.tags}>
              {quiz.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          )
        }}
        showActions={true}
        customRenderActions={{
          view: (quiz: IQuiz) => <ViewLink to={`/quiz/${quiz.id}`} />,
          edit: (quiz: IQuiz) => <EditLink to={`/admin/quiz/edit/${quiz.id}`} />,
          delete: (quiz: IQuiz) => <DeleteButton onDelete={() => deleteQuiz(quiz)} />
        }}
        noDataMessage={NO_DATA_FOUND}
      ></Table>
    </>
  )
}

export default ManageQuizzes
