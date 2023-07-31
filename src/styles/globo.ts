import { globalCss } from "@ignite-ui/react";

export const globalStyles = globalCss({
    '*': {
        boxSizing: 'border-box',
        padding: 0,
        margin: 0,
    },

    body: {
        backgroundColor: '$gray900',
        color: '$gray100',
        '-webkit-font-smoothing': 'antialiase',
    }
})

/*
'-webkit-font-smoothing': 'antialiase' = para que os browsers fique mais detalhado
*/