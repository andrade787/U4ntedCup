// pages/404.js
import { useUser } from "@/context/UserContext";

export default function NotFound() {
  const { user } = useUser();

  return (
    <div>
      <span>Essa página não existe</span>
      {user && <p>Olá, {user.name}</p>}
    </div>
  );
}
