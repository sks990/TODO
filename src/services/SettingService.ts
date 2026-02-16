import { AppSettings } from '../core/AppState';
import { dbService } from './DBService';
import { stateManager } from '../core/StateManager';

export class SettingService {
  private static storeName = 'settings';
  private static settingsKey = 'app_config';

  public static async getSettings(): Promise<AppSettings> {
    const data = await dbService.getByKey<{ key: string; value: AppSettings }>(this.storeName, this.settingsKey);
    return data ? data.value : stateManager.getState().settings;
  }

  public static async updateSettings(updates: Partial<AppSettings>): Promise<void> {
    const currentSettings = await this.getSettings();
    const newSettings = { ...currentSettings, ...updates };

    await dbService.put(this.storeName, {
      key: this.settingsKey,
      value: newSettings
    });

    stateManager.setState({ settings: newSettings });
  }
}