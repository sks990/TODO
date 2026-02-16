import { Task } from '../core/AppState';
import { dbService } from './DBService';
import { stateManager } from '../core/StateManager';

export class TaskService {
  private static storeName = 'tasks';

  public static async getTasks(filters?: { boardColumnId?: string; query?: string }): Promise<Task[]> {
    let tasks = await dbService.getAll<Task>(this.storeName);

    if (filters?.boardColumnId) {
      tasks = tasks.filter(t => t.boardColumnId === filters.boardColumnId);
    }

    if (filters?.query) {
      const q = filters.query.toLowerCase();
      tasks = tasks.filter(t => 
        t.title.toLowerCase().includes(q) || 
        t.description.toLowerCase().includes(q)
      );
    }

    return tasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public static async addTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    const now = new Date().toISOString();
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };

    await dbService.put(this.storeName, newTask);
    
    // Update global state
    const currentTasks = stateManager.getState().tasks;
    stateManager.setState({ tasks: [newTask, ...currentTasks] });

    return newTask;
  }

  public static async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    const tasks = await dbService.getAll<Task>(this.storeName);
    const existingTask = tasks.find(t => t.id === id);

    if (!existingTask) throw new Error('Task not found');

    const updatedTask: Task = {
      ...existingTask,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await dbService.put(this.storeName, updatedTask);

    // Update global state
    const updatedTasks = stateManager.getState().tasks.map(t => t.id === id ? updatedTask : t);
    stateManager.setState({ tasks: updatedTasks });

    return updatedTask;
  }

  public static async deleteTask(id: string): Promise<void> {
    await dbService.delete(this.storeName, id);

    // Update global state
    const remainingTasks = stateManager.getState().tasks.filter(t => t.id !== id);
    stateManager.setState({ tasks: remainingTasks });
  }

  public static async moveTaskToColumn(taskId: string, columnId: string): Promise<void> {
    await this.updateTask(taskId, { boardColumnId: columnId });
  }
}