[code]import { stateManager } from './core/StateManager';
import { dbService } from './services/DBService';
import { TaskService } from './services/TaskService';
import { BoardColumnService } from './services/BoardColumnService';
import { SettingService } from './services/SettingService';

/**
 * 애플리케이션 초기화 로직
 */
export async function initApp() {
  try {
    stateManager.setState({ isLoading: true });

    // 1. DB 초기화
    await dbService.init();

    // 2. 기본 컬럼 설정 (최초 실행 시)
    await BoardColumnService.initializeDefaultColumns();

    // 3. 데이터 병렬 로드
    const [tasks, columns, settings] = await Promise.all([
      TaskService.getTasks(),
      BoardColumnService.getColumns(),
      SettingService.getSettings()
    ]);

    // 4. 상태 반영
    stateManager.setState({
      tasks,
      columns,
      settings,
      isLoading: false
    });

    console.log('App initialized successfully');
  } catch (error) {
    console.error('Failed to initialize app:', error);
    stateManager.setState({ isLoading: false });
  }
}

// 브라우저 환경에서 실행
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    initApp();
  });
}