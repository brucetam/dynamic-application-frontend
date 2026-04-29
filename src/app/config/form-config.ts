import { FormConfig } from '../models/dynamic-form.model';

export const DEMO_FORM_CONFIG: FormConfig = {
  id: 'demo-form',
  title: '用戶註冊表單',
  description: '請填寫以下資訊以完成註冊',
  apiEndpoint: '/api/users',
  method: 'POST',
  submitLabel: '提交註冊',
  cancelLabel: '取消',
  showCancel: true,
  fields: [
    {
      key: 'username',
      label: '用戶名',
      type: 'text',
      placeholder: '請輸入用戶名',
      width: 6,
      validation: [
        { type: 'required', message: '請輸入用戶名' },
        { type: 'minLength', value: 3, message: '用戶名至少需要3個字元' },
        { type: 'maxLength', value: 20, message: '用戶名最多20個字元' }
      ]
    },
    {
      key: 'email',
      label: '電子郵件',
      type: 'email',
      placeholder: 'example@mail.com',
      width: 6,
      validation: [
        { type: 'required', message: '請輸入電子郵件' },
        { type: 'pattern', value: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$', message: '請輸入有效的電子郵件地址' }
      ]
    },
    {
      key: 'password',
      label: '密碼',
      type: 'text',
      placeholder: '請輸入密碼',
      width: 6,
      validation: [
        { type: 'required', message: '請輸入密碼' },
        { type: 'minLength', value: 8, message: '密碼至少需要8個字元' }
      ]
    },
    {
      key: 'confirmPassword',
      label: '確認密碼',
      type: 'text',
      placeholder: '請再次輸入密碼',
      width: 6,
      validation: [
        { type: 'required', message: '請確認密碼' }
      ]
    },
    {
      key: 'fullName',
      label: '姓名',
      type: 'text',
      placeholder: '請輸入姓名',
      width: 12,
      validation: [
        { type: 'required', message: '請輸入姓名' }
      ]
    },
    {
      key: 'phone',
      label: '電話',
      type: 'text',
      placeholder: '+886-912345678',
      width: 6,
      validation: [
        { type: 'pattern', value: '^\+?[\d\s\-()]+$', message: '請輸入有效的電話號碼' }
      ]
    },
    {
      key: 'gender',
      label: '性別',
      type: 'radio',
      width: 6,
      options: [
        { label: '男性', value: 'male' },
        { label: '女性', value: 'female' },
        { label: '其他', value: 'other' }
      ],
      validation: [
        { type: 'required', message: '請選擇性別' }
      ]
    },
    {
      key: 'country',
      label: '國家',
      type: 'select',
      width: 6,
      placeholder: '請選擇國家',
      options: [
        { label: '台灣', value: 'tw' },
        { label: '香港', value: 'hk' },
        { label: '中國', value: 'cn' },
        { label: '日本', value: 'jp' },
        { label: '美國', value: 'us' }
      ],
      validation: [
        { type: 'required', message: '請選擇國家' }
      ]
    },
    {
      key: 'birthDate',
      label: '出生日期',
      type: 'date',
      width: 6,
      validation: [
        { type: 'required', message: '請選擇出生日期' }
      ]
    },
    {
      key: 'bio',
      label: '個人簡介',
      type: 'textarea',
      placeholder: '請簡單介紹自己...',
      width: 12,
      validation: [
        { type: 'maxLength', value: 500, message: '簡介最多500個字元' }
      ]
    },
    {
      key: 'avatar',
      label: '頭像上传',
      type: 'upload',
      width: 12,
      placeholder: '點擊或拖曳頭像圖片至此處',
      uploadConfig: {
        accept: 'image/jpeg,image/png,image/gif',
        maxSize: 2 * 1024 * 1024,
        maxFiles: 1
      }
    },
    {
      key: 'attachments',
      label: '附件上傳',
      type: 'upload',
      width: 12,
      placeholder: '點擊或拖曳檔案至此處（最多5個）',
      uploadConfig: {
        accept: '.pdf,.doc,.docx,.xls,.xlsx',
        maxSize: 10 * 1024 * 1024,
        maxFiles: 5
      }
    }
  ]
};

export const DEMO_MATRIX_CONFIG: FormConfig = {
  id: 'matrix-demo',
  title: '矩陣表單範例',
  fields: [
    {
      key: 'familyMembers',
      label: '家庭成員',
      type: 'matrix',
      width: 12,
      hint: '可新增或刪除家庭成員',
      matrixConfig: [
        {
          key: 'family',
          label: '家庭成員',
          columns: [
            {
              key: 'name',
              label: '姓名',
              type: 'text',
              width: 4,
              validation: [
                { type: 'required', message: '請輸入姓名' }
              ]
            },
            {
              key: 'relationship',
              label: '關係',
              type: 'select',
              width: 3,
              options: [
                { label: '父親', value: 'father' },
                { label: '母親', value: 'mother' },
                { label: '子女', value: 'child' },
                { label: '兄弟', value: 'sibling' },
                { label: '其他', value: 'other' }
              ],
              validation: [
                { type: 'required', message: '請選擇關係' }
              ]
            },
            {
              key: 'age',
              label: '年齡',
              type: 'number',
              width: 2,
              validation: [
                { type: 'required', message: '請輸入年齡' },
                { type: 'min', value: 0, message: '年齡必須大於0' },
                { type: 'max', value: 150, message: '年齡必須小於150' }
              ]
            },
            {
              key: 'occupation',
              label: '職業',
              type: 'text',
              width: 3
            }
          ],
          repeatable: true,
          minRows: 1,
          maxRows: 10
        }
      ]
    }
  ]
};

export const DEMO_NESTED_CONFIG: FormConfig = {
  id: 'nested-demo',
  title: '嵌套表單範例',
  fields: [
    {
      key: 'company',
      label: '公司資訊',
      type: 'text',
      width: 12,
      nestedFields: [
        {
          key: 'companyName',
          label: '公司名稱',
          type: 'text',
          width: 12,
          validation: [
            { type: 'required', message: '請輸入公司名稱' }
          ]
        },
        {
          key: 'companyAddress',
          label: '公司地址',
          type: 'textarea',
          width: 12,
          validation: [
            { type: 'required', message: '請輸入公司地址' }
          ]
        },
        {
          key: 'companyPhone',
          label: '公司電話',
          type: 'text',
          width: 6,
          validation: [
            { type: 'required', message: '請輸入公司電話' }
          ]
        },
        {
          key: 'companyEmail',
          label: '公司郵箱',
          type: 'email',
          width: 6,
          validation: [
            { type: 'required', message: '請輸入公司郵箱' }
          ]
        }
      ]
    }
  ]
};

export const COMPLEX_FORM_CONFIG: FormConfig = {
  id: 'complex-form',
  title: '綜合表單範例',
  description: '展示所有支援的欄位類型',
  submitLabel: '儲存',
  apiEndpoint: '/api/complete',
  fields: [
    {
      key: 'basicInfo',
      label: '基本資訊',
      type: 'text',
      width: 12,
      nestedFields: [
        {
          key: 'title',
          label: '標題',
          type: 'select',
          width: 12,
          options: [
            { label: '先生', value: 'Mr' },
            { label: '女士', value: 'Mrs' },
            { label: '小姐', value: 'Ms' }
          ],
          validation: [
            { type: 'required', message: '請選擇稱謂' }
          ]
        },
        {
          key: 'name',
          label: '姓名',
          type: 'text',
          width: 6,
          validation: [
            { type: 'required', message: '請輸入姓名' }
          ]
        },
        {
          key: 'idCard',
          label: '身份證字號',
          type: 'text',
          width: 6,
          validation: [
            { type: 'required', message: '請輸入身份證字號' },
            { type: 'pattern', value: '^[A-Z]{1}[0-9]{9}$', message: '身份證格式不正確' }
          ]
        }
      ]
    },
    {
      key: 'contactInfo',
      label: '聯絡資訊',
      type: 'text',
      width: 12,
      nestedFields: [
        {
          key: 'mobile',
          label: '手機',
          type: 'text',
          width: 6,
          validation: [
            { type: 'required', message: '請輸入手機號碼' },
            { type: 'pattern', value: '^09[0-9]{8}$', message: '手機格式不正確' }
          ]
        },
        {
          key: 'telephone',
          label: '市話',
          type: 'text',
          width: 6
        },
        {
          key: 'address',
          label: '通訊地址',
          type: 'textarea',
          width: 12,
          validation: [
            { type: 'required', message: '請輸入通訊地址' }
          ]
        },
        {
          key: 'receiveNewsletter',
          label: '訂閱電子報',
          type: 'checkbox',
          width: 12
        }
      ]
    },
    {
      key: 'workExperience',
      label: '工作經歷',
      type: 'matrix',
      width: 12,
      hint: '請依序填寫工作經歷',
      matrixConfig: [
        {
          key: 'work',
          label: '工作經歷',
          columns: [
            {
              key: 'company',
              label: '公司',
              type: 'text',
              width: 3,
              validation: [
                { type: 'required', message: '請輸入公司名稱' }
              ]
            },
            {
              key: 'position',
              label: '職位',
              type: 'text',
              width: 3,
              validation: [
                { type: 'required', message: '請輸入職位' }
              ]
            },
            {
              key: 'startDate',
              label: '開始日期',
              type: 'date',
              width: 2,
              validation: [
                { type: 'required', message: '請選擇開始日期' }
              ]
            },
            {
              key: 'endDate',
              label: '結束日期',
              type: 'date',
              width: 2
            },
            {
              key: 'currently',
              label: '目前在職',
              type: 'checkbox',
              width: 2
            }
          ],
          repeatable: true,
          minRows: 1,
          maxRows: 5
        }
      ]
    },
    {
      key: 'resume',
      label: '履歷表',
      type: 'upload',
      width: 12,
      uploadConfig: {
        accept: '.pdf,.doc,.docx',
        maxSize: 5 * 1024 * 1024,
        maxFiles: 1
      }
    },
    {
      key: 'certificates',
      label: '證照檔案',
      type: 'upload',
      width: 12,
      uploadConfig: {
        accept: 'image/*,.pdf',
        maxSize: 3 * 1024 * 1024,
        maxFiles: 10
      }
    }
  ]
};