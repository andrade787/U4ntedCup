import { GetServerSideProps } from 'next';
import { withUser } from '@/lib/auth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from 'next/image';
import FormCadastro from "@/components/cadastro/formCadastro";

interface User {
    url?: string;
    [key: string]: any; // Add other user properties as needed
}

interface Props {
    user: User;
}

export default function Cadastro({ user }: Props) {
    const router = useRouter();

    useEffect(() => {
        if (user && user.url) {
            router.push(`/player/${user.url}`);
        }
    }, [user, router]);

    return (
        <div className="relative pt-14 bg-gradient-to-bl from-blue-100 via-transparent dark:from-Roxo dark:via-transparent">
            <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
                <div className="grid items-center md:grid-cols-2 gap-8 lg:gap-12">
                    <div className="mt-4 md:mb-12 max-w-2xl">
                        <div className='flex justify-center'>
                            <Image
                                className='mb-5'
                                src="/assets/logo.webp"
                                width={500}
                                height={500}
                                priority
                                alt="U4nted Cup"
                                style={{ width: 'auto', height: 'auto' }}
                            />
                        </div>
                        <h1 className="mb-4 font-semibold text-center text-gray-800 text-4xl lg:text-5xl dark:text-neutral-200">
                            Elevando a Experiência do E-Sports Amador ao Profissional.
                        </h1>
                        <p className="text-gray-600 text-center dark:text-neutral-400">
                            Junte-se a nós agora mesmo e mergulhe em uma experiência verdadeiramente imersiva de um jogador de esportes profissional!
                        </p>
                    </div>

                    <div className="flex justify-end">
                        <Card className="max-w-lg">
                            <CardHeader>
                                <CardTitle className="text-center">Formulário de Inscrição</CardTitle>
                                <CardDescription className="text-center">Já possui uma conta?
                                    <Link href="/login"> <span className="text-Roxo hover:text-white">Fazer Login</span></Link>
                                </CardDescription>
                            </CardHeader>
                            <CardContent className='bg-zinc-900'>
                                <hr className="mb-5"></hr>
                                <FormCadastro />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const user = await withUser(context);

    if (user && user.url) {
        return {
            redirect: {
                destination: `/player/${user.url}`,
                permanent: false,
            },
        };
    }

    return {
        props: {
            user,
        },
    };
};
