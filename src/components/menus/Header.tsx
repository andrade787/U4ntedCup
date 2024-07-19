import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import Link from "next/link";
import { Button } from "../ui/button";
import { useRouter } from "next/router";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "../ui/dropdown-menu";
import { LogOut, User } from "lucide-react";
import Image from "next/image";

export default function Header() {
  const { user, logout } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isMenuOpen]);

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
    await logout();
    router.push('/login');
  };

  const MenuLinks = () => (
    <>
      <Link href="/">
        <Button variant={router.pathname === "/" ? "roxo" : "ghost"}>Home</Button>
      </Link>
      <Link href="/campeonatos">
        <Button variant={router.pathname === "/campeonatos" ? "roxo" : "ghost"}>Campeonatos</Button>
      </Link>
      <Link href="/times">
        <Button variant={router.pathname === "/times" ? "roxo" : "ghost"}>Times</Button>
      </Link>
      <Link href="/player">
        <Button variant={router.pathname === "/player" ? "roxo" : "ghost"}>Players</Button>
      </Link>
    </>
  );

  return (
    <header className={`z-40 w-full text-white fixed top-0 transition-all duration-300 ${isScrolled ? 'bg-zinc-800/60 backdrop-blur' : ''}`}>
      <div className="container py-2 px-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-semibold">
          <Image alt="Logo" width={400} height={400} className=" max-w-44" src="/assets/logo.webp" />
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
            <div className="fixed inset-0 bg-zinc-800 text-white flex flex-col items-center justify-center space-y-4 animate-in fade-in h-screen z-50">
              <button onClick={toggleMenu} className="absolute top-4 right-4 text-white focus:outline-none">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <MenuLinks />
            </div>
          )}

          {user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger className="hover:brightness-50 transition-all">
                  <Avatar>
                    <AvatarImage src={user.photoURL || ''} />
                    <AvatarFallback>{initialNick}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link href={'/player/' + user.url}>
                    <DropdownMenuItem className="cursor-pointer"><User size={20} className="mr-2" /> Meu Perfil</DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                    <LogOut size={20} className="mr-2" /> Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link href="/login" className="mr-4">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
