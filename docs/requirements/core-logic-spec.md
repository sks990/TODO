# 핵심 비즈니스 로직 및 상태 관리 명세서

## 1. 개요
본 문서는 애플리케이션의 핵심 비즈니스 로직 처리와 전역 상태 관리를 위한 모듈 설계 및 구현 세부 사항을 정의합니다. 

## 2. 주요 기능 요구사항

### 2.1 StateManager (전역 상태 관리)
- 애플리케이션의 상태(`AppState`)를 중앙 집중식으로 관리합니다.
- 구독자 패턴(Pub/Sub)을 사용하여 상태 변경 시 UI 컴포넌트가 자동으로 업데이트될 수 있도록 알림을 제공합니다.
- `getState()`, `setState()`, `subscribe()` 인터페이스를 제공합니다.

### 2.2 서비스 레이어 (Service Layer)
- **DBService**: IndexedDB와의 직접적인 통신을 담당하는 저수준 레이어입니다.
- **TaskService**: 할 일(Task)에 대한 비즈니스 로직을 처리합니다.
    - CRUD 작업 시 ID 생성, 생성일/수정일 자동 관리.
    - 칸반 보드 내 상태 이동(`moveTaskToColumn`).
    - 필터링 및 정렬 조건에 따른 데이터 조회.
- **BoardColumnService**: 칸반 보드의 컬럼(Column) 정보를 관리하며 `order` 필드에 따른 정렬을 보장합니다.
- **SettingService**: 테마, 언어 등 애플리케이션 설정을 영구 저장하고 로드합니다.

### 2.3 비즈니스 로직 및 유틸리티
- **Gantt Data Calculation**: Task의 시작일, 종료일, 기간 정보를 기반으로 간트 차트 렌더링에 적합한 데이터 구조를 생성합니다.
- **App Initialization**: 앱 구동 시 DB에서 데이터를 로드하고 초기 상태를 설정합니다.

## 3. 데이터 모델 (Schema)

### AppState