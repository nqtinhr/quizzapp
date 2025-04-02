import { QuizQuestion } from './QuizQuestion'

export class Quiz {
  id = ''
  title = ''
  description = ''
  tags: string[] = []
  thumbnail = ''
  questions = [new QuizQuestion()]
}
