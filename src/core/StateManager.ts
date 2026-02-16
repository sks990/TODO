import { AppState, initialAppState } from './AppState';

type Listener = (state: AppState) => void;

export class StateManager {
  private static instance: StateManager;
  private state: AppState;
  private listeners: Set<Listener> = new Set();

  private constructor() {
    this.state = initialAppState;
  }

  public static getInstance(): StateManager {
    if (!StateManager.instance) {
      StateManager.instance = new StateManager();
    }
    return StateManager.instance;
  }

  public getState(): AppState {
    return { ...this.state };
  }

  public setState(newState: Partial<AppState>): void {
    this.state = { ...this.state, ...newState };
    this.notify();
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener(this.state));
  }
}

export const stateManager = StateManager.getInstance();