import { SetMetadata } from '@nestjs/common'
import { IAuthType, IConditionGuard } from '../constants/auth.constant'

export const AUTH_TYPE_KEY = 'authType'
export type AuthTypeDecoratorPayload = { authTypes: IAuthType[]; options: { condition: IConditionGuard } }

export const Auth = (authTypes: IAuthType[], options: { condition: IConditionGuard }) => {
  return SetMetadata(AUTH_TYPE_KEY, { authTypes, options })
}
