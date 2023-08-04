import { Button, Text, TextInput } from "@ignite-ui/react";
import { Form, FormAnnotation } from "./styles";
import { ArrowRight } from "phosphor-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";

const preCadastroFormularioSchema = z.object({ //z.object para definir a estrutura do camos do formulario
    username: z.string()
    .min(3, {message: 'Digite um nome valido "3 letras"'})
    .regex(/^([a-z\\\\-]+)$/i,{
        message: 'Só pode ter apenas letras'
    })
    .transform(username => username.toLowerCase()),
})

type preCadastroFormularioData = z.infer<typeof preCadastroFormularioSchema> // para converte a estrura do z.object em uma estrutura de typescript

export function ClaimUsernameForm(){
    const { register, handleSubmit, formState: {errors, isSubmitting} } = useForm<preCadastroFormularioData>({
        resolver: zodResolver(preCadastroFormularioSchema) // para saber comod eve validar o usuario
    }) 

    const router = useRouter()

    async function manuseioPreCadastro(data: preCadastroFormularioData) {
        const {username} = data

        await router.push(`/register?username=${username}`)// para transferir o nome de reserva
    }

    return (
        <>
        <Form as="form" onSubmit={handleSubmit(manuseioPreCadastro)}>
            <TextInput 
                size="sm"
                prefix="ignite.com/"
                placeholder="seu-usuario"
                {...register('username')}
            />
            <Button size='sm' type="submit" disabled={isSubmitting}>
                Reserva
                <ArrowRight />
             </Button>
        </Form>

        <FormAnnotation>
            <Text size="sm">
                {errors.username 
                ? errors.username.message 
                : 'Digite o nome do usuario desejado'}

            </Text>
        </FormAnnotation>
        </>
    )
}