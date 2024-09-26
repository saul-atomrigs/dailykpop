module.exports = {
  parser: '@typescript-eslint/parser', // ESLint 파서 지정
  extends: [
    'eslint:recommended', // ESLint의 권장 규칙 사용
    'plugin:@typescript-eslint/recommended', // @typescript-eslint/eslint-plugin의 권장 규칙 사용
    'plugin:react/recommended', // React 모범 사례 적용
    'plugin:react-native/all', // React Native 모범 사례 적용
  ],
  plugins: [
    'react',
    'react-native',
    '@typescript-eslint',
    'import',
    'jsx-a11y', // 접근성 규칙을 위한 플러그인
    'unused-imports', // 사용되지 않는 import 자동 제거
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true, // React를 사용하므로 JSX 활성화
    },
    ecmaVersion: 2020, // 최신 ECMAScript 기능 파싱 허용
    sourceType: 'module', // import 사용 허용
  },
  env: {
    'react-native/react-native': true,
    es6: true,
    node: true,
  },
  rules: {
    // TypeScript 규칙
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }], // _로 시작하는 사용되지 않는 변수 무시
    '@typescript-eslint/explicit-module-boundary-types': 'off', // 함수의 명시적 반환 타입 비활성화

    // React 규칙
    'react/react-in-jsx-scope': 'off', // React 17+에서는 필요 없음
    'react/prop-types': 'off', // TypeScript를 사용하므로 prop-types 필요 없음
    'react/jsx-filename-extension': ['warn', { extensions: ['.tsx'] }], // .tsx 파일만 JSX를 가질 수 있음

    // React Native 규칙
    'react-native/no-unused-styles': 'warn', // 사용되지 않는 스타일 경고
    'react-native/no-inline-styles': 'warn', // 인라인 스타일 경고 (StyleSheet 사용 권장)
    'react-native/no-color-literals': 'off', // 색상 리터럴 허용
    'react-native/split-platform-components': 'warn', // 플랫폼별 파일 분할 보장

    // Import 규칙
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', ['parent', 'sibling'], 'index'],
        'newlines-between': 'always',
      },
    ],
    'import/no-unresolved': 'off', // React Native의 모듈 해상도에 대한 미해결 import 오류 비활성화

    // 사용되지 않는 import
    'unused-imports/no-unused-imports': 'error',

    // 일반 규칙
    'no-console': 'warn', // console 로그 경고
    'no-use-before-define': 'off', // TypeScript의 자체 처리로 인해 비활성화
    'prefer-const': 'error', // 재할당되지 않는 변수에 대해 const 사용 권장
    'no-var': 'error', // var 사용 금지
    'prefer-arrow-callback': 'error', // 콜백에 화살표 함수 사용 권장

    // async/await 강제
    'require-await': 'error',
    'no-return-await': 'error',

    // 접근성
    'jsx-a11y/accessible-emoji': 'warn',
    'jsx-a11y/alt-text': 'warn',
    'jsx-a11y/no-autofocus': 'warn',
  },
  settings: {
    react: {
      version: 'detect', // React 버전 자동 감지
    },
  },
};
