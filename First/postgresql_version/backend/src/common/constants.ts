// src/common/constants.ts
export const ROLES = {
  ADMIN: 'ADMIN',
  HOD: 'HOD',
  FACULTY: 'FACULTY',
} as const;

export const SCHEME_STATUS = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  APPROVED: 'APPROVED',
  RETURNED_FOR_CORRECTION: 'RETURNED_FOR_CORRECTION',
  DELETED: 'DELETED',
} as const;

export const ERROR_CODES = {
  INVALID_TRANSITION: 'INVALID_TRANSITION',
  SCHEME_LOCKED: 'SCHEME_LOCKED',
  VALIDATION_FAILED: 'VALIDATION_FAILED',
} as const;

export const FILE_LIMITS = {
  MAX_SIZE_BYTES: 10 * 1024 * 1024, // 10 MB
  ALLOWED_MIME: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
};
