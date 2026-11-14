# 1호선톤 15조 — frontend

경계선지능 청소년을 위한 AI 생활 판단 연습 서비스의 웹 프론트엔드입니다.

## 기술 스택

- React + Vite
- Tailwind CSS v4
- React Router

## 시작하기

```bash
npm install
npm run dev
```

백엔드 API는 `/api/v1/...` 경로로 호출합니다. 로컬에서는 `vite.config.js`의 프록시가 `/api` 요청을 `http://localhost:8080`으로 넘기고, 배포(Vercel)에서는 `vercel.json`의 리라이트가 백엔드로 넘깁니다.

`VITE_API_URL`은 **비워 둡니다.** (`.env`를 만들지 않아도 됩니다)
서버 주소를 `http://localhost:8080`처럼 절대 주소로 넣으면 요청이 다른 출처가 되어 쿠키가 전송되지 않고, 로그인이 유지되지 않습니다.

## 폴더 구조

```
src/
├── api/          백엔드 API 호출 함수
├── components/   공통 컴포넌트 (버튼, 헤더, 말풍선 등)
├── pages/        화면 단위 컴포넌트 (피그마 프레임 1개 = 파일 1개)
├── App.jsx       라우팅
└── index.css     Tailwind, 디자인 토큰
```

## 컴포넌트 규칙

- **공통 컴포넌트**는 피그마 `Components`에 있는 이름 그대로 `src/components/`에 만듭니다.
  - 예: `Button.jsx`, `Bubble.jsx`, `Choice.jsx`, `Header.jsx`
  - 화면마다 버튼·말풍선을 새로 만들지 말고, 여기 있는 컴포넌트를 가져다 씁니다.
  - 공통 컴포넌트를 고치면 다른 화면에도 영향이 가므로 PR 본문에 꼭 적어주세요.
- **화면**은 피그마 프레임 1개당 파일 1개로 `src/pages/`에 만듭니다.
  - 파일 이름은 영어로, 맨 위 주석에 피그마 프레임 번호를 적습니다.
  - 예: `GrowthRecord.jsx` → 첫 줄에 `// Y8 성장 기록`
- **색상·폰트**는 피그마 값을 `src/index.css`의 `@theme`에 등록해서 씁니다. 화면 파일에 색상 코드를 직접 적지 않습니다.

## 협업 규칙

브랜치·PR·커밋 규칙은 [`docs` 레포](https://github.com/line1thon-15/docs/blob/main/conventions/브랜치-PR-커밋.md)를 따릅니다.
작업은 `dev`에서 `feature/화면명` 브랜치를 따서 진행하고, `dev`로 PR을 올려주세요.
