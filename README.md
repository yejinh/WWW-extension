# WWW

## Introduction

WWW은 개인 혹은 협업 프로젝트시 웹 사용 내역을 도메인과 시간 단위로 트래킹한 데이터를 차트화하는 프로그램입니다.

1. 로그인 - 메인 - 프로젝트 생성 - 크롬 확장 프로그램 연결 - 로그아웃 등의 모든 페이지![1](https://yejinh-gifs.s3.ap-northeast-2.amazonaws.com/www1.gif)



2. 사용자 검색하여 프로젝트 생성 (사용자 중복 추가 제거)![2](https://yejinh-gifs.s3.ap-northeast-2.amazonaws.com/www2.gif)



3. 프로젝트 데이터 시각화 및 차트 변경

   ![3](https://yejinh-gifs.s3.ap-northeast-2.amazonaws.com/www3.gif)



## Contents

[Requirements](https://github.com/yejinh/WWW-server/new/yejinh?readme=1#requirements)

[Installation](https://github.com/yejinh/WWW-server/new/yejinh?readme=1#installation)

[Setting](https://github.com/yejinh/WWW-server/new/yejinh?readme=1#settings)

[Features](https://github.com/yejinh/WWW-server/new/yejinh?readme=1#features)

[Skills](https://github.com/yejinh/WWW-server/new/yejinh?readme=1#skills)

[Challenges](https://github.com/yejinh/WWW-server/new/yejinh?readme=1#challenges)

[Things to Do](https://github.com/yejinh/WWW-server/new/yejinh?readme=1#things-to-do)



## Requirements

- chrome web browser에서 사용 가능합니다.

- Facebook 계정으로 가입합니다.

- WWW chrome extension 설치가 선행되어야 합니다.

  

## Installation

### Client

[WWW client](https://www.wewillwork.in/) 배포버전 불안정 추후 수정 예정

```
git clone https://github.com/yejinh/WWW-client.git
cd www-client
npm install
npm start
```

### Server

[WWW server](http://api.wewillwork.in/) 배포버전 불안정 추후 수정 예정

```
git clone https://github.com/yejinh/WWW-server.git
cd www-server
npm install
npm start
```

### Extension

[WWW chrome extension](https://chrome.google.com/webstore/detail/dfpkfpanbiknimieidehmiaghgagldho)



## Setting

### Environment Variable - Client

루트 디렉토리에 `.env.local` 파일 생성후 하단의 키 값 추가

```
REACT_APP_HOST_URL=https://api.wewillwork.in
REACT_APP_API_KEY=
REACT_APP_AUTH_DOMAIN=
REACT_APP_DB_URL=
REACT_APP_PROJECT_ID=
REACT_APP_STORAGE_BUCKET=
REACT_APP_SENDER_ID=
```

- REACT_APP_HOST_URL: 서버 배포 버전 불안정시 http://localhost:8080 입력
- [firebase authentication](https://firebase.google.com/docs/auth/web/facebook-login) & [facebook developer](FACEBOOK_APP_ID) (REACT_APP_HOST_URL을 제외한 나머지): 첨부된 페이지를 참고하여 앱 생성 후 해당 값들을 입력 

### Environment Variable - Server

루트 디렉토리에서 `.env` 파일 생성 후 하단의 키 값 추가

```
DATABASE_URL=mongodb://localhost:27017/www
SECRET_KEY=www
```

- DATABASE_URL: 위의 로컬 주소 혹은 mongoDB Atlas collection 생성하여 입력

- SECRET_KEY:  위의 시크릿 키 혹은 임의로 설정 가능

  

## Features

- Firebase Authentication/ Facebook 을 이용한 로그인 기능
- JSON Web Token Authentication
- Facebook 계정으로 사용자 추가하여 새로운 프로젝트 생성
- 크롬 확장 프로그램에서 마감기한을 넘기지 않은 프로젝트들 목록 확인 가능
- 확장 프로그램에서 진행 중인 프로젝트 선택하여 도메인, 시간 단위로 웹 사용 트래킹
- 웹에서 트레킹된 데이터 차트화하여 프로젝트 기여 퍼센트를 차트로 확인 기능



## Skills

### Client

- React
- Redux
- React-Router
- Chart.js
- Jest / Enzyme for unit-test

### Server

- Node.js
- Express
- JSON Web Token Authentication
- MongoDB
- Mongoose
- Atlas

### Extension

- chrome.extension API
- JQuery



## Deployment

### Client

- Netlify
- Amazon Certificate Manager (ACM)

### Server

- Circle CI (continuous integration)
- AWS Elastic Beanstalk (EB)

### Extension 

- Developer Extension 



## Project Control

- Git 기반 진행

- Notion Todo를 이용한 Task Management

  

## Version Control

Client, Server, Extension을 독립적으로 구분하여 Git repository 관리



## Challenges

- 웹이나 앱과는 다르게 구동되는 크롬 확장 프로그램을 초기에 파악하는 것이 쉽지 않았습니다.
  완성 기간을 2주로 잡고 시작하였는데 프로젝트 특성상 트래킹 데이터를 모으는 것을 핵심 기능을 초반에 크롬 확장 프로그램을 먼저 구현해야 했는데 chrome.extension API을 기반으로 하는 익스텐션  구현이 처음이라 확장 프로그램의 코드 흐름, Manifest.json, background.js, popup.js 등 필수적인 파일들의 역할을 파악하는 것이 쉽지 않았습니다.
  확장 프로그램 구현이 불가한 경우 프로젝트 변경이 시급한 상황이었기에 불안한 마음도 있었지만 새로 접했기 때문에 더욱 호기심을 가지고 파악하여 기획 스케줄에 차질없이 진행할 수 있었습니다.

- 개발 환경에서는 문제 없던 이슈가 배포 과정시에 잦게 발생하는 것을 알게되고 이슈를 해결하며 새롭게 경험한 것이 많았습니다.

  서버의 경우 AWS EB와 Circle CI를 연결하여 배포하는 과정에서 서버의 구동 흐름에 대해 조금 더 알게 되었습니다. 나아가  CI 특성상 여러 번 commit - push를 해야 했는데 배포를 완료한 이후 이전의 git 내역을 삭제 및 수정하는 방법에 대해서도 알게 되었습니다.

  클라이언트의 경우 Netlify를 통해 배포한 클라이언트 사이트는 보안 설정이 되지 않은 서버로 연동이 불가하다 하여 직접 구매한 도메인을 ACM을 통해 인증 받아 https 보안 설정을 하였습니다.

  크롬 확장 프로그램의 경우 배포 전 후의 이슈에 차이가 가장 크고 예기치 못한 문제들이 가장 많이 발생하였습니다. 개발 환경에서는 문제 되지 않았던 로그인시 화면 전환 불가, 트래킹 데이터가 원활하게 쌓이지 않는 문제점 등을 



## Things to Do

1. End to End(E2E) 테스트
   개발 시에는 정해진 기획대로 진행하기 때문에 실제 사용자가 프로그램을 사용할 때의 환경이나 상황에 따라 발생하는 주요 이슈들을 미처 확인하지 못하고 넘어가는 경우들이 있습니다. 유닛 테스트와 함께 E2E 테스트도 진행하여 다양한 실험 환경을 통해 좀 더 견고한 프로그램을 만들고 싶습니다. 

2. 서버 테스트

3. 프로젝트 삭제 기능
   현재는 프로젝트 생성 기능만 

4. 대쉬보드에서 사용자 프로젝트 데이터 모아보기
   현재는 각 프로젝트 별로 데이터 차트화를 하여 사용자가 본인 데이터를 확인하려면 각각의 프로젝트를 모두 확인해야 하는데 메인 페이지 대쉬보드에서 로그인 사용자의 데이터만을 시각화하는 부분을 추가하고 싶습니다.

5. 확장 프로그램 웹 트래킹 시 마우스 이벤트을 감지하여 서버 요청
   현재는 탭이 꺼지거나 도메인 변경 이벤트가 발생하는 경우 시간 제한을 두고 서버에 요청을 보내는 로직이라 브라우저만 켜놓고 실제 웹 사용이 없어도 트래킹이 됩니다. 좀 더 명확한 웹 사용 확인을 위해 마우스 스크롤, 클릭 이벤트를 감지하여 서버 요청을 보내도록 수정하고자 합니다. 

6. 확장 프로그램 팝업 내에서 트래킹 데이터 시각화
   현재는 참여 중인 프로젝트 목록과 트래킹 중임을 표시하는 화면만 띄우고 있는데 수정하게 된다면 웹 화면에서의 차트와 비슷하게 확장 프로그램 팝업 내에서도 데이터를 시각적으로 확인할 수 있도록 수정하고 싶습니다. 

7. 확장 프로그램 배포 이후 발생한 문제점 수정

   [비슷한 이슈](https://stackoverflow.com/questions/52949355/chrome-extension-only-works-with-console-open)

8. 코드 리팩토링

   ​    
