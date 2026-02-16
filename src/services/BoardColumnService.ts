[code]import { BoardColumn } from '../core/AppState';
import { dbService } from './DBService';
import { stateManager } from '../core/StateManager';

export class BoardColumnService {
  private static storeName = 'columns';

  public static async getColumns(): Promise<BoardColumn[]> {
    const columns = await dbService.getAll<BoardColumn>(this.storeName);
    return columns.sort((a, b) => a.order - b.order);
  }

  public static async addColumn(title: string, order: number): Promise<BoardColumn> {
    const newColumn: BoardColumn = {
      id: crypto.randomUUID(),
      title,
      order,
    };

    await dbService.put(this.storeName, newColumn);
    
    const currentColumns = stateManager.getState().columns;
    stateManager.setState({ 
      columns: [...currentColumns, newColumn].sort((a, b) => a.order - b.order) 
    });

    return newColumn;
  }

  public static async initializeDefaultColumns(): Promise<void> {
    const existing = await this.getColumns();
    if (existing.length === 0) {
      const defaults = [
        { title: '할 일', order: 1 },
        { title: '진행 중', order: 2 },
        { title: '완료', order: 3 }
      ];
      
      for (const col of defaults) {
        await this.addColumn(col.title, col.order);
      }
    }
  }
}