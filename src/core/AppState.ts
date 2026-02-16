export interface BoardColumn {
  id: string;
  title: string;
  order: number;
}

export interface AppSettings {
  theme: 'light' | 'dark';
  language: 'ko' | 'en';
  showCompleted: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  boardColumnId: string;
  startDate: string;
  endDate: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

export interface AppState {
  tasks: Task[];
  columns: BoardColumn[];
  settings: AppSettings;
  isLoading: boolean;
  selectedTaskId: string | null;
}

export const initialAppState: AppState = {
  tasks: [],
  columns: [],
  settings: {
    theme: 'light',
    language: 'ko',
    showCompleted: true,
  },
  isLoading: true,
  selectedTaskId: null,
};