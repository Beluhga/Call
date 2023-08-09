import { Button, Heading, MultiStep, Text, TextInput } from "@ignite-ui/react";
import { Container, Form, FormError, Header } from "./styles";
import { ArrowRight } from "phosphor-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { api } from "@/src/LB/axios";
import { AxiosError } from "axios";

const registerFormSchema = z.object({
    username: z.string()
    .min(3, {message: 'Digite um nome valido "3 letras"'})
    .regex(/^([a-z\\\\-]+)$/i,{
        message: 'Só pode ter apenas letras'
    })
    .transform(username => username.toLowerCase()),
    name: z.string().min(3, {message: 'O nome precisa ter pelo menos 3 letras'})
})

type RegisterFormData = z.infer<typeof registerFormSchema>

export default function Register(){
    const {register,
         handleSubmit,
         setValue, // serve para setar o valor de algum campo do formulario de uma forma programatica
         formState: {errors, isSubmitting}
        } = useForm<RegisterFormData>({
        resolver: zodResolver(registerFormSchema),
        defaultValues: {
            username: ''
        },
    })

    const router = useRouter()
        
    useEffect(() => {
        if(router.query.username){
            setValue('username', String(router.query.username)) // query serve pra pegar o nome na URL que esta o "username"
        }
    },[router.query?.username, setValue])

    async function handleRegister(data: RegisterFormData) {
       try {
        await api.post('/users', { // post para criat um usuario
            name: data.name,
            username: data.username
            
        })

        await router.push('/register/connect-calendar') // para conectar ao calendario
        
       } catch (error){
            if (error instanceof AxiosError && error?.response?.data?.message){ //se o erro for uma instancia do AxioError
                alert(error.response.data.message)
                return;
            }

            console.error(error)
       }
    }
    return(
        <Container>
            <Header>
                <Heading as="strong">
                Bem-vindo ao Ignite Call!
                </Heading>
                <Text>
                Precisamos de algumas informações para criar seu perfil! Ah, você pode editar essas informações depois.
                </Text>

                <MultiStep size={4} currentStep={1} />
            </Header>

            <Form as="form" onSubmit={handleSubmit(handleRegister)}>
                <label>
                    <Text size="sm">Nome de usúario</Text>
                    <TextInput prefix="ignite.com" placeholder="seu-usuario" {...register('username')} />

                    {errors.username && (
                        <FormError size="sm">{errors.username.message}</FormError>
                    )}
                </label>

                <label>
                    <Text size="sm">Nome Completo</Text>
                    <TextInput placeholder="Seu nome" {...register('name')}/> 

                    {errors.name && (
                        <FormError size="sm">{errors.name.message}</FormError>
                    )}
                </label>

                <Button type="submit" disabled={isSubmitting}>
                    Proximo passo
                    <ArrowRight />
                </Button>

            </Form>
        </Container>
    )
}