import Image from 'next/image';
import { Check, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useUser } from '@/context/UserContext';
import { Notification } from '@/lib/types';
import { useToast } from '@/components/ui/use-toast';

export default function CardPlayerInvite() {
  const { notifications } = useUser();
  const { toast } = useToast();

  const updateRequestStatus = async (notification: Notification, status: string) => {
    try {

      const Role = notification.additionalInfo?.[0];
      const playerNick = notification.additionalInfo?.[1];
      const requestId = notification.additionalInfo?.[2];
      const notificationId = notification.id;
      const receiverId = notification.receiverId;

      const response = await fetch(`/api/teams/requests/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          notificationId,
          receiverId,
          Role,
          playerId: notification.senderId,
          playerNick,
          teamId: notification.teamId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update request');
      }

      const data = await response.json();
      toast({
        title: `Você ${status === 'accepted' ? 'aceitou' : 'recusou'} o pedido!`,
        description: data.message,
        variant: `${status === 'accepted' ? 'success' : 'destructive'}`,
      });
    } catch (error) {
      let errorMessage = 'Ocorreu um erro ao atualizar o pedido.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const acceptRequest = (notification: Notification) => {
    updateRequestStatus(notification, 'accepted');
  };

  const rejectRequest = (notification: Notification) => {
    updateRequestStatus(notification, 'rejected');
  };

  const convertTimestampToDate = (timestamp: number): Date => {
    return new Date(timestamp);
  };

  const isValidNotification = (notification: Notification): boolean => {
    if (notification.type !== 'join_request') return false;
    if (!notification.message || !notification.senderId || !notification.receiverId || !notification.createdAt) return false;
    return true;
  };

  const validNotifications = notifications.filter(isValidNotification);

  return (
    <div className="flex flex-col">
      {validNotifications.map((notification, index) => (
        <div key={index} className="flex flex-col hover:bg-zinc-800/20 animate-in zoom-in-150 rounded-tl-xl rounded-tr-xl bg-gradient-to-r from-Roxo/80 to-transparent mb-4">
          <div className="flex border-b-2 transition-colors">
            <div className="flex p-4 flex-col w-full">
              <div className="flex items-center gap-2">
                <Image src="/assets/favicon.png" width={20} height={20} alt="icon" />
                <p className="text-zinc-100">
                  {notification.message} <span className="font-medium">Deseja aceitar?</span>
                </p>
              </div>
              <p className="text-sm text-zinc-200 ml-7">
                {formatDistanceToNow(convertTimestampToDate(notification.createdAt), { addSuffix: true, locale: ptBR })}
              </p>
            </div>
            <div className="flex bg-gradient-to-l from-zinc-900/20 rounded-tl-xl rounded-tr-xl items-center gap-2 py-4 pr-2">

              <div className="flex items-center gap-1 p-2 rounded-full hover:bg-zinc-700/50 transition-colors cursor-pointer" onClick={() => acceptRequest(notification)}>
                <Check size={20} /> Aceitar
              </div>

              <div className="flex items-center gap-1 p-2 rounded-full hover:border hover:border-white transition-all cursor-pointer" onClick={() => rejectRequest(notification)}>
                <X size={20} /> Recusar
              </div>

            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
