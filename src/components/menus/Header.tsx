import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import Link from "next/link";
import { Button } from "../ui/button";
import { useRouter } from "next/router";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "../ui/dropdown-menu";
import { Bell, Check, LogIn, LogOut, PlusCircle, User, X } from "lucide-react";
import Image from "next/image";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"



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
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger className="hover:brightness-50 transition-all">
                  <Avatar>
                    <AvatarImage src={user.photoURL || ''} />
                    <AvatarFallback>{initialNick}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="p-0">
                  <DropdownMenuLabel className="p-2 bg-zinc-800">{user.name}</DropdownMenuLabel>
                  <Link href={'/player/' + user.url}>
                    <DropdownMenuItem className="cursor-pointer bg-zinc-900 hover:bg-zinc-800 rounded-none px-2 py-3"><User size={20} className="mr-2" /> Meu Perfil</DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem className="cursor-pointer bg-zinc-900 hover:bg-zinc-800 rounded-none px-2 py-3" onClick={handleLogout}>
                    <LogOut size={20} className="mr-2" /> Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Popover>
                <PopoverTrigger asChild>
                  <div className="relative flex justify-center items-center group bg-Roxo rounded-full p-2 cursor-pointer hover:bg-zinc-700 transition-colors">
                    <Bell />
                    <div className="absolute top-1 left-4 bg-Roxo px-1 rounded-full group-hover:bg-zinc-700 transition-colors">
                      <p className="text-sm">2</p>
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
                      <div className="flex hover:bg-zinc-800/50  border-b-2 transition-colors">
                        <div className="flex p-4 flex-col w-full">
                          <div className="flex items-center gap-2">
                            <Image className="" src="/assets/favicon.png" width={20} height={20} alt="icon" />
                            <p className="text-zinc-100">QRZera quer fazer parte do seu time! <span className="font-medium">Deseja aceitar ?</span></p>
                          </div>
                          <p className="text-sm text-zinc-400 ml-7">Há 3 min</p>
                        </div>
                        <div className="flex bg-gradient-to-l from-zinc-800 items-center gap-2 py-4 pr-2">
                          <div className="p-2 rounded-full hover:bg-zinc-700 transition-colors cursor-pointer">
                            <Check />
                          </div>
                          <div className="p-2 rounded-full hover:bg-zinc-700 transition-colors cursor-pointer">
                            <X />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button className="flex items-center gap-2" variant='roxo'><LogIn size={18} /> Entrar</Button>
              </Link> ou
              <Link href="/cadastro">
                <Button className="flex items-center gap-2" variant='default'><PlusCircle size={18} />Cadastrar</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header >
  );
}
