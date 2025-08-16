export interface ProgressData {
  quizFile: string;
  currentQuestionIndex: number;
  userAnswers: Map<number, string[]>;
  markedForReview: Set<number>;
  incorrectUnvalidatedQuestions: Set<number>;
  timestamp: number;
}

export class ProgressStorage {
  private static readonly STORAGE_KEY = 'fmpa-quiz-progress';

  static saveProgress(
    quizFile: string,
    currentQuestionIndex: number,
    userAnswers: Map<number, string[]>,
    markedForReview: Set<number>,
    incorrectUnvalidatedQuestions: Set<number>
  ): void {
    const progress: ProgressData = {
      quizFile,
      currentQuestionIndex,
      userAnswers: this.mapToObject(userAnswers),
      markedForReview: this.setToObject(markedForReview),
      incorrectUnvalidatedQuestions: this.setToObject(incorrectUnvalidatedQuestions),
      timestamp: Date.now()
    };

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
  }

  static loadProgress(): ProgressData | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return null;

      const progress: ProgressData = JSON.parse(stored);
      
      // Convert back to Map and Set
      progress.userAnswers = this.objectToMap(progress.userAnswers);
      progress.markedForReview = this.objectToSet(progress.markedForReview);
      progress.incorrectUnvalidatedQuestions = this.objectToSet(progress.incorrectUnvalidatedQuestions);

      return progress;
    } catch (error) {
      console.error('Error loading progress:', error);
      return null;
    }
  }

  static clearProgress(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  private static mapToObject(map: Map<number, string[]>): Record<number, string[]> {
    const obj: Record<number, string[]> = {};
    map.forEach((value, key) => {
      obj[key] = value;
    });
    return obj;
  }

  private static objectToMap(obj: Record<number, string[]>): Map<number, string[]> {
    const map = new Map<number, string[]>();
    Object.entries(obj).forEach(([key, value]) => {
      map.set(parseInt(key), value);
    });
    return map;
  }

  private static setToObject(set: Set<number>): number[] {
    return Array.from(set);
  }

  private static objectToSet(arr: number[]): Set<number> {
    return new Set(arr);
  }
}