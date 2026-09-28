import AsyncStorage from '@react-native-async-storage/async-storage';
import {DraftData} from '../types/form';

const STORAGE_KEY = '@site_commissioning_draft';
let saveTimer: ReturnType<typeof setTimeout> | null = null;

export async function saveDraft(data: DraftData): Promise<void> {
  if (saveTimer) {
    clearTimeout(saveTimer);
  }

  return new Promise(resolve => {
    saveTimer = setTimeout(async () => {
      const payload = {
        ...data,
        updatedAt: new Date().toISOString(),
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      resolve();
    }, 500);
  });
}

export async function saveDraftImmediate(data: DraftData): Promise<void> {
  if (saveTimer) {
    clearTimeout(saveTimer);
    saveTimer = null;
  }

  const payload = {
    ...data,
    updatedAt: new Date().toISOString(),
  };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export async function loadDraft(): Promise<DraftData | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as DraftData;
  } catch {
    return null;
  }
}

export async function clearDraft(): Promise<void> {
  if (saveTimer) {
    clearTimeout(saveTimer);
    saveTimer = null;
  }
  await AsyncStorage.removeItem(STORAGE_KEY);
}
