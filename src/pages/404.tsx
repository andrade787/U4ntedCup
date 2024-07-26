"use client"

import { Button } from "@/components/ui/button";
import { Frown } from "lucide-react";
import Link from "next/link";

export default function Custom404() {
  return (
    <div className='min-h-screen flex flex-col justify-center items-center bg-gradient-to-br via-transparent from-Roxo p-3'>
      <Frown size={180} />
      <h1 className='font-semibold text-7xl text-center'>ERRO 404</h1>
      <p className='mb-2 text-center'>A página que você está procurando não foi encontrada.</p>
      <Link href='/'><Button>Página Inicial</Button></Link>
    </div>
  );

}