// pages/_error.tsx

import { withUser } from '@/lib/auth'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { User } from '@/lib/types'
import { useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { Frown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface ErrorProps {
  statusCode: number;
  user: User;
}

const errorMessages: { [key: number]: string } = {
  400: 'Solicitação inválida. Por favor, verifique sua entrada e tente novamente.',
  401: 'Não autorizado. Por favor, faça login para acessar esta página.',
  403: 'Você não tem permissão para acessar esta página.',
  404: 'A página que você está procurando não foi encontrada.',
  408: 'Tempo de solicitação esgotado. Por favor, tente novamente mais tarde.',
  429: 'Muitas solicitações. Por favor, tente novamente mais tarde.',
  500: 'Ocorreu um erro interno no servidor. Por favor, tente novamente mais tarde.',
  502: 'Bad Gateway. O servidor recebeu uma resposta inválida.',
  503: 'Serviço indisponível. Por favor, tente novamente mais tarde.',
  504: 'Gateway Timeout. O servidor não conseguiu responder a tempo.',
}

const Error = ({ statusCode, user }: ErrorProps) => {
  const { setUser } = useUser();
  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user, setUser]);

  const errorMessage = errorMessages[statusCode];

  return (
    <>
      {statusCode && errorMessage ? (
        <div className='min-h-screen flex flex-col justify-center items-center bg-gradient-to-br via-transparent from-Roxo p-3'>
          <Frown size={180} />
          <h1 className='font-semibold text-7xl text-center'>ERRO {statusCode}</h1>
          <p className='mb-2 text-center'>{errorMessage}</p>
          <Link href='/'><Button>Página Inicial</Button></Link>
        </div>
      ) : (
        'Ocorreu um erro no cliente. Atualize a página ou tente novamente mais tarde!'
      )}
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const { res } = context
  const user = await withUser(context);

  const statusCode = res ? res.statusCode : 404
  return { props: { statusCode, user } }
}

export default Error
