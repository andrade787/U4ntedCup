import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import Link from "next/link";
import { Button } from "../ui/button";
import { useRouter } from "next/router";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem } from "../ui/dropdown-menu";
import { LogOut, Sparkles, User as UserIcon } from "lucide-react";
import Image from "next/image";
import NotificationHeader from "./NotificationHeader";

interface MenuLinksProps {
  onLinkClick?: () => void;
}

const MenuLinks = ({ onLinkClick }: MenuLinksProps) => {
  const router = useRouter();

  return (
    <>
      <Link href="/" onClick={onLinkClick}>
        <Button variant={router.pathname === "/" ? "roxo" : "ghost"}>Home</Button>
      </Link>
      <Link href="/campeonatos" onClick={onLinkClick}>
        <Button variant={router.pathname === "/campeonatos" ? "roxo" : "ghost"}>Campeonatos</Button>
      </Link>
      <Link href="/times" onClick={onLinkClick}>
        <Button variant={router.pathname === "/times" ? "roxo" : "ghost"}>Times</Button>
      </Link>
      <Link href="/player" onClick={onLinkClick}>
        <Button variant={router.pathname === "/player" ? "roxo" : "ghost"}>Players</Button>
      </Link>
    </>
  );
};

export default function Header() {
  const { user, logout, notifications, playerTeam, playerTeamLoading } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuAnimating, setIsMenuAnimating] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const router = useRouter();
  const toggleMenu = () => {
    if (isMenuOpen) {
      setIsMenuAnimating(true);
      setTimeout(() => {
        setIsMenuAnimating(false);
        setIsMenuOpen(false);
      }, 100); // duration of the fadeOut animation
    } else {
      setIsMenuOpen(true);
    }
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isMenuOpen]);

  useEffect(() => {
    if (user !== undefined && playerTeamLoading !== undefined) {
      setIsInitialLoading(false);
    }
  }, [user, playerTeamLoading]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const initialNick = user?.nickname?.match(/(\b\S)?/g)?.join("").match(/(^\S|\S$)?/g)?.join("").toUpperCase();

  const handleLogout = async () => {
    logout();
  };

  return (
    <header className={`z-40 w-full text-white fixed top-0 transition-all duration-300 ${isScrolled ? 'bg-zinc-800/60 backdrop-blur' : ''}`}>
      <div className="container py-2 px-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-semibold">
          <Image alt="Logo" width={176} height={176} className="max-w-36" src="/assets/logo.webp" />
        </Link>

        <div className="hidden md:flex space-x-2">
          <MenuLinks />
        </div>
        <div className="flex gap-2">
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="text-white focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>

          {isMenuOpen && (
            <div className={`fixed inset-0 bg-zinc-800 text-white flex flex-col items-center justify-center space-y-4 h-screen z-50 ${isMenuAnimating ? 'animate-out fade-out' : 'animate-in fade-in'}`}>
              <button onClick={toggleMenu} className="absolute top-4 right-4 text-white focus:outline-none">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <MenuLinks onLinkClick={toggleMenu} />
            </div>
          )}

          {!isInitialLoading && (
            <>
              {user && !playerTeamLoading && (
                <div className="flex items-center animate-in fade-in gap-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="hover:brightness-50 transition-all">
                      <Avatar>
                        <AvatarImage className="w-full object-cover" src={user.photoURL || ''} />
                        <AvatarFallback>{initialNick}</AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="p-0">
                      <DropdownMenuLabel className="p-2 bg-zinc-800">{user.name}</DropdownMenuLabel>
                      <Link href={'/player/' + user.url}>
                        <DropdownMenuItem className="cursor-pointer bg-zinc-900 border-b hover:bg-zinc-800 rounded-none px-2 py-3">
                          <UserIcon size={20} className="mr-2" /> Meu Perfil
                        </DropdownMenuItem>
                      </Link>
                      {playerTeam && (
                        <Link href={'/times/' + playerTeam.url}>
                          <DropdownMenuItem className="cursor-pointer bg-zinc-900 border-b hover:bg-zinc-800 rounded-none px-2 py-3">
                            <Sparkles size={20} className="mr-2" /> Meu Time
                          </DropdownMenuItem>
                        </Link>
                      )}
                      <DropdownMenuItem className="flex justify-center cursor-pointer bg-red-800 border-b hover:bg-zinc-800/50 rounded-none px-2 py-3" onClick={handleLogout}>
                        <LogOut size={20} className="mr-2" /> Sair
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <NotificationHeader user={user} notifications={notifications} />
                </div>
              )}

              {!user && (
                <div className="flex items-center gap-2 animate-in fade-in">
                  <Link href="/login">
                    <Button className="flex items-center gap-2" variant="roxo">Entrar</Button>
                  </Link> ou
                  <Link href="/cadastro">
                    <Button className="flex items-center gap-2" variant="default">Cadastrar</Button>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
