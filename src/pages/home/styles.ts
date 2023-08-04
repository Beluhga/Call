import {styled, Heading, Text} from '@ignite-ui/react';

export const Container = styled('div', {
    maxWidth: 'calc(100vw - (100vw - 1160px) /2)',
    marginLeft: 'auto', // joga tudo para direita
    height: '100vh', // assim centraliza
    display: 'flex',
    alignItems: 'center',
    gap: '$20',
})

export const Hero = styled('div', {
    maxWidth: 480,
    padding: '0 $10',

    [`> ${Heading}`]: { // " > " para aplicar somente que estao dentro do componente Hero no primeiro nivel
        '@media(max-width: 600px)': {
            fontSize: '$6xl'
        }

    },

    [`> ${Text}`]: {
        marginTop: '$2',
        color: '$gray200',

    }


})

export const Preview = styled('div', {
    paddingRight: '$8',
    overflow: 'hidden',

    '@media(max-width: 600px)': {
        display: 'none'
    }
})