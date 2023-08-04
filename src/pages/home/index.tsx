import {Heading, Text} from '@ignite-ui/react'
import { Container, Hero, Preview } from './styles'

import previewImage from '../../assets/app-preview.png'
import Image from 'next/image'
import { ClaimUsernameForm } from '@/src/ClaimUsernameForm'

export default function Home() {
  return (
    <Container>
      <Hero>
        <Heading size="4xl">Agendamento descomplicado</Heading>
        <Text size="xl">
        Conecte seu calendário e permita que as pessoas 
        marquem agendamentos no seu tempo livre.
        </Text>

        <ClaimUsernameForm />
      </Hero>

      <Preview>
        <Image 
          src={previewImage}
          height={400}
          quality={100}// para melhora a qualidade da imagem,se nao ela fica em 80%
          priority //para ter prioridade
          alt="Calendario simbolizando o app"

        />

      </Preview>
    </Container>
  )
    
}
