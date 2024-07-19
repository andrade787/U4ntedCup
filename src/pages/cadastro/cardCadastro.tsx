import * as React from "react"
import FormCadastro from "./formCadastro";
import Link from 'next/link';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export default function CardCadastro() {
    return (

        <Card className="max-w-lg">
            <CardHeader>
                <CardTitle className="text-center">Formulário de Inscrição</CardTitle>
                <CardDescription className="text-center">Já possui uma conta ?
                    <Link href="/player/login"> <span className="text-Roxo hover:text-white">Fazer Login</span></Link>
                </CardDescription>
            </CardHeader>
            <CardContent>

                <hr className="mb-5"></hr>

                <FormCadastro />

            </CardContent>

        </Card>

    );

}