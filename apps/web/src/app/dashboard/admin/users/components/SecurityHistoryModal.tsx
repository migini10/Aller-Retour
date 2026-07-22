import React, { useEffect, useState } from 'react';
import { Clock, X, ShieldAlert, ShieldCheck, UserX } from 'lucide-react';
import { UsersService } from '../../services/users.service';

interface SecurityHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export function SecurityHistoryModal({ isOpen, onClose, userId }: SecurityHistoryModalProps) {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && userId) {
      loadEvents();
    }
  }, [isOpen, userId]);

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      const data = await UsersService.getSecurityEvents(userId);
      setEvents(data);
    } catch (error) {
      console.error('Failed to load security events', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const renderEventIcon = (action: string) => {
    switch (action) {
      case 'LOGIN_TEMP_BLOCKED':
        return <ShieldAlert className="w-5 h-5 text-orange-500" />;
      case 'ACCOUNT_BANNED':
        return <UserX className="w-5 h-5 text-rose-500" />;
      case 'ACCOUNT_REACTIVATED':
        return <ShieldCheck className="w-5 h-5 text-emerald-500" />;
      case 'LOGIN_TEMP_UNBLOCKED':
        return <ShieldCheck className="w-5 h-5 text-blue-500" />;
      default:
        return <Clock className="w-5 h-5 text-slate-400" />;
    }
  };

  const renderEventTitle = (action: string) => {
    switch (action) {
      case 'LOGIN_TEMP_BLOCKED':
        return 'Blocage temporaire (anti-bruteforce)';
      case 'ACCOUNT_BANNED':
        return 'Bannissement définitif';
      case 'ACCOUNT_REACTIVATED':
        return 'Réactivation du compte';
      case 'LOGIN_TEMP_UNBLOCKED':
        return 'Déblocage manuel du compte';
      default:
        return action;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#1C1C1C] rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800/50 shrink-0">
          <div className="flex items-center gap-3 text-slate-800 dark:text-white">
            <Clock className="w-5 h-5 text-slate-400" />
            <h3 className="font-bold text-lg">Historique de sécurité</h3>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center text-slate-500 py-8">
              Aucun événement de sécurité pour cet utilisateur.
            </div>
          ) : (
            <div className="relative border-l border-slate-200 dark:border-slate-800 ml-4 space-y-6">
              {events.map((event) => (
                <div key={event.id} className="relative pl-6">
                  <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-slate-50 dark:bg-[#141414] border border-slate-200 dark:border-slate-800 flex items-center justify-center">
                    {renderEventIcon(event.action)}
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-semibold text-sm text-slate-900 dark:text-white">
                        {renderEventTitle(event.action)}
                      </span>
                      <span className="text-xs text-slate-500 shrink-0">
                        {new Date(event.createdAt).toLocaleString('fr-FR')}
                      </span>
                    </div>
                    {event.reason && (
                      <div className="text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl mt-1 border border-slate-100 dark:border-slate-800">
                        <strong>Raison :</strong> {event.reason}
                      </div>
                    )}
                    {event.adminId && (
                      <div className="text-xs text-slate-400 mt-1">
                        Action effectuée par : {event.adminId}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
