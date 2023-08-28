import { Button, Heading, MultiStep, Text } from "@ignite-ui/react";
import { Container, Header } from "../styles";
import { ArrowRight, Check } from "phosphor-react";
import { AuthError, ConnectBox, ConnectItem } from "./styles";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";


export default function connectCalendar(){
    const session = useSession()
    const router = useRouter()

    console.log(session)

    const temErrorDeAutenticacao = !!router.query.error //error de permissions
    const temUsuarioLogado = session.status === 'authenticated'
    async function handleConnectCalendar() {
        await signIn('google')
      }


    return(
        <Container>
            <Header>
                <Heading as="strong">
                Conecte sua agenda!
                </Heading>
                <Text>
                Conecte o seu calendário para verificar automaticamente as horas ocupadas e os novos eventos à medida em que são agendados.                </Text>

                <MultiStep size={4} currentStep={2} />
            </Header>

            <ConnectBox>
                <ConnectItem>
                  <Text>Google Agenda</Text>
                    {temUsuarioLogado ? (

                        <Button size="sm" disabled >
                            Conectado
                            <Check />
                        </Button>

                    ) : (
                       
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleConnectCalendar}>
                            Conectar
                        <ArrowRight />
                        </Button>
                )
                }
                </ConnectItem>

                {temErrorDeAutenticacao && (
                    <AuthError size="sm">
                        Falha ao se conectar ao Google, verifique se você habilitou as
                        permissões de acesso ao Google Calendar.
                    </AuthError>
                )}

            <Button type="submit" disabled={!temUsuarioLogado}>
                Proximo passo
                <ArrowRight />
            </Button>
            </ConnectBox>
        </Container>
    )
}