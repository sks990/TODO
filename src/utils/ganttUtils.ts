[code]import { Task } from '../core/AppState';

export interface GanttItem {
  id: string;
  name: string;
  start: Date;
  end: Date;
  progress: number;
  dependencies?: string[];
  type: 'task' | 'milestone';
}

/**
 * Task 목록을 간트 차트 라이브러리 포맷으로 변환합니다.
 */
export function calculateGanttData(tasks: Task[]): GanttItem[] {
  return tasks
    .filter(task => task.startDate && task.endDate)
    .map(task => {
      const start = new Date(task.startDate);
      const end = new Date(task.endDate);
      
      // 진행도(progress)는 비즈니스 로직상 boardColumnId에 따라 가상으로 계산할 수 있음
      // 예: '완료' 상태 컬럼 ID일 경우 100
      let progress = 0;
      // 실구현에서는 ColumnID 정보를 바탕으로 판단
      
      return {
        id: task.id,
        name: task.title,
        start,
        end,
        progress,
        type: 'task'
      };
    });
}

/**
 * 두 날짜 사이의 일수 계산
 */
export function getDurationDays(start: string, end: string): number {
  const s = new Date(start);
  const e = new Date(end);
  const diffTime = Math.abs(e.getTime() - s.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}