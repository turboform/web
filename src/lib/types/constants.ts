export const COOKIE_STORAGE_KEY = 'turboform-auth'
export const LOCAL_STORAGE_KEYS = {
  PREVIOUSLY_SIGNED_IN: '_tf_usr_auth_state',
}

const fieldTypes = [
  { label: 'Text', type: 'text', icon: 'text' },
  { label: 'Long Text', type: 'textarea', icon: 'textarea' },
  { label: 'Yes/No', type: 'checkbox', icon: 'checkbox' },
  { label: 'Multiple Choice', type: 'radio', icon: 'radio' },
  { label: 'Dropdown', type: 'select', icon: 'select' },
  { label: 'Multi-Select', type: 'multi_select', icon: 'multi_select' },
]

export const FIELD_TYPES = fieldTypes
