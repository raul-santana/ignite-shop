import { styled } from "..";

export const ProductContainer = styled('main', {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    alignItems: 'stretch',
    gap: '4rem',

    maxWidth: 1180,
    margin: '0 auto',

    '@bp1': {
        display: 'flex',
        'flex-direction': 'column',
        alignItems: 'center',
    },

})

export const Imagecontainer = styled('div', {
    widht: '100%',
    maxWidth: 576,
    height: 656,
    background: 'linear-gradient(100deg, #1ea483 0%, #7465d4 100%)',
    borderRadius: 8,
    padding: '0.25rem',

    display:'flex',
    alignItems: 'center',
    justifyContent: 'center',

    img: {
        objectFit: 'cover',
    }
})

export const ProductDetail = styled('div', {
    display: 'flex',
    flexDirection: 'column',

    h1:{
        fontsize: '$2xl',
        color: '$gray300'
    },

    span: {
        marginTop: '1rem',
        display: 'block',
        fontSize: '$2xl',
        color: '$green300',
    },

    p:{
        marginTop: '2.5rem',
        fontSize: '$md',
        lineHeight: 1.6,
        color: '$gray300',
    },

    button:{
        marginTop: 'auto',
        backgroundColor: '$green500',
        border: 0,
        color: '$white',
        borderRadius: 8,
        padding: '1.25rem',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '$md',

        '&:disabled':{
            opacity: 0.6,
            cursor: 'not-allowed',
        },

        '&:not(:disabled):hover': {
            backgroundColor: '$green300',
        }

    },

    '@bp1': {
        padding: '1.2rem',

        p:{
            marginTop: '2rem',
        },

        button:{
            marginTop: '3rem',
            marginBottom: '2.5rem',
        }
    }
})