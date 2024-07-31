import { TeamInfos, User } from "@/lib/types";
import { useEffect, useState } from "react";
import axios from "axios";
import JoinTeam from "./JoinTeam";
import StatusComein from "./StatusComein";
import { Skeleton } from "@/components/ui/skeleton";

interface ComeInProps {
  team: TeamInfos;
  user: User;
}

export default function ComeIn({ team, user }: ComeInProps) {
  const [invitationStatus, setInvitationStatus] = useState<{ status: string | null, type: string | null }>({ status: null, type: null });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkInvitation = async () => {
      try {
        setLoading(true);
        const response = await axios.post(`/api/teams/${team.id}/getrequests`);
        setInvitationStatus({
          status: response.data.status,
          type: response.data.type,
        });
        setLoading(false);
      } catch (error) {
        setInvitationStatus({ status: null, type: null });
        setLoading(false);
      }
    };

    checkInvitation();
  }, [team.id, user.uid]);

  if (loading) {
    return (
      <div>
        <Skeleton className="w-full h-9 bg-zinc-700" />
      </div>
    );
  }

  return (
    <div>
      {invitationStatus.status ? (
        <StatusComein status={invitationStatus.status} type={invitationStatus.type} />
      ) : (
        <JoinTeam />
      )}
    </div>
  );
}
