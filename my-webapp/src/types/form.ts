/**
 * 폼 관련 타입 정의
 */

// 폼 필드 기본 인터페이스
export interface FormField {
  name: string;
  label: string;
  type: "text" | "textarea" | "datetime-local" | "date" | "select" | "checkbox";
  placeholder?: string;
  required?: boolean;
  defaultValue?: any;
  options?: { value: string; label: string }[]; // select 필드용
  validator?: (value: any) => string | null; // 유효성 검사 함수
}

// 폼 에러 상태 타입
export type FormErrors = Record<string, string | null>;

// 폼 필드 값 타입
export type FormValues = Record<string, any>;

// 폼 상태 인터페이스
export interface FormState {
  values: FormValues;
  errors: FormErrors;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
}

// 폼 액션 인터페이스
export interface FormAction {
  type:
    | "SET_FIELD_VALUE"
    | "SET_FIELD_ERROR"
    | "TOUCH_FIELD"
    | "RESET_FORM"
    | "SET_SUBMITTING"
    | "VALIDATE_FORM";
  field?: string;
  value?: any;
  error?: string | null;
  isSubmitting?: boolean;
  initialValues?: FormValues;
}

// 폼 제출 함수 타입
export type FormSubmitHandler = (values: FormValues) => Promise<void> | void;

// 폼 변경 함수 타입
export type FormChangeHandler = (field: string, value: any) => void;
