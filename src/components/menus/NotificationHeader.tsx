import { Bell, Check, LoaderCircle, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Image from "next/image";
import { Notification, User } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast, useToast } from "../ui/use-toast";
import { useState } from "react";
import { Button } from "../ui/button";

interface NotificationHeaderProps {
  user: User;
  notifications: Notification[];
}

export default function NotificationHeader({ user, notifications }: NotificationHeaderProps) {
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();
  let classNotification = 'bg-zinc-600';
  if (notifications.length > 0) {
    classNotification = 'bg-Roxo';
  }
  const convertTimestampToDate = (timestamp: number): Date => {
    return new Date(timestamp);
  };

  const requestId = notifications.length > 0 ? notifications[0].additionalInfo?.[0] : null;

  const handleResponse = async (notificationId: string, requestId: string, status: 'accepted' | 'rejected') => {
    try {
      setLoading(true);
      const response = await fetch(`/api/player/requests/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, notificationId }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          variant: 'destructive',
          title: "Ocorreu um erro!",
          description: data.message || "Ocorreu um erro ao aceitar o convite. Tente Novamente Mais Tarde.",
        });
        setLoading(false);
        throw new Error('Failed to update the request');
      }

      toast({
        variant: 'success',
        title: data.message || 'Convite aceito com sucesso!',
      });
      setLoading(false);

    } catch (error) {
      toast({
        variant: 'destructive',
        title: "Ocorreu um erro!",
        description: "Ocorreu um erro ao aceitar o convite. Tente Novamente Mais Tarde.",
      });
      setLoading(false);
    }
  };
  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <div className={`relative flex justify-center items-center group rounded-full p-2 cursor-pointer ${classNotification} hover:bg-zinc-700 transition-colors`}>
            <Bell />
            <div className={`absolute top-1 left-4 ${classNotification} px-1 rounded-full group-hover:bg-zinc-700 transition-colors`}>
              <p className="text-sm">{notifications.length}</p>
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-full max-w-96">
          <div className="flex flex-col">
            <div className="flex bg-zinc-800 items-center justify-between">
              <h4 className="p-3 font-medium leading-none">Notificações</h4>
              <h4 className="p-3 text-sm text-zinc-400 font-medium leading-none cursor-pointer hover:bg-zinc-700 rounded-r transition-colors">MARCAR TUDO COMO VISTO</h4>
            </div>
            <div className="flex flex-col bg-zinc-900">
              {notifications.length == 0 && <p className="hover:bg-zinc-800/50 transition-colors text-center p-3">Nenhuma notificação no momento.</p>}
              {notifications.map((notification, index) => (
                <div key={index} className="flex hover:bg-zinc-800/50 border-b-2 transition-colors">
                  <div className="flex p-4 flex-col w-full">
                    <div className="flex items-center gap-2">
                      <Image src="/favicon.webp" width={20} height={20} alt="icon" />
                      <p className="text-zinc-100">{notification.message} <span className="font-medium">Deseja aceitar?</span></p>
                    </div>
                    <p className="text-sm text-zinc-400 ml-7"> {formatDistanceToNow(convertTimestampToDate(notification.createdAt), { addSuffix: true, locale: ptBR })}</p>
                  </div>
                  <div className="flex bg-gradient-to-l from-zinc-800 items-center gap-2 py-4 pr-2">
                    <Button
                      className="p-2 rounded-full bg-transparent text-zinc-50 hover:bg-zinc-700 transition-colors cursor-pointer"
                      disabled={loading}
                      onClick={() => requestId && handleResponse(notification.notificationId, requestId, 'accepted')}
                    >
                      {loading ? (<LoaderCircle className="animate-spin" />) : (<Check />)}

                    </Button>
                    <Button
                      className="p-2 rounded-full bg-transparent text-zinc-50 hover:bg-zinc-700 transition-colors cursor-pointer"
                      disabled={loading}
                      onClick={() => requestId && handleResponse(notification.notificationId, requestId, 'rejected')}
                    >

                      {loading ? (<LoaderCircle className="animate-spin" />) : (<X />)}

                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}
