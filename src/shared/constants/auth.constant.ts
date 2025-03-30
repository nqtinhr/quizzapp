export const REQUEST_USER_KEY = 'user';

export const AuthType = {
  Bearer: 'Bearer',
  None: 'None',
  APIKey: 'ApiKey'
} as const;

export type IAuthType = (typeof AuthType)[keyof typeof AuthType];

export const ConditionGuard = {
    And: 'And',
    Or: 'Or'
} as const;

export type IConditionGuard = (typeof ConditionGuard)[keyof typeof ConditionGuard];