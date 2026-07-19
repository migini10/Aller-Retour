import { useState, useCallback } from 'react';
import { SettingsService } from '../services/settings.service';
import { SystemSettings, UpdateSettingsPayload } from '../types/settings.types';
import { useModal } from '../../../../components/ModalContext';

export function useSettings() {
  const { showToast } = useModal();
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await SettingsService.getSettings();
      setSettings(response);
    } catch (err: any) {
      setError(err);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateSettings = useCallback(async (payload: UpdateSettingsPayload) => {
    setIsSaving(true);
    setError(null);
    try {
      const response = await SettingsService.updateSettings(payload);
      setSettings(response);
      return true;
    } catch (err: any) {
      setError(err);
      showToast(err.message || 'Erreur lors de la sauvegarde des paramètres', 'error');
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [showToast]);

  return {
    settings,
    isLoading,
    isSaving,
    error,
    fetchSettings,
    updateSettings
  };
}
