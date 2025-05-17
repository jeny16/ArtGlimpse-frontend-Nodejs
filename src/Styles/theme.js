import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#fdf6e9',
            light: '#fdf6eb',
            dark: '#c6bfb3',
            highlight: '#814d0b'
        },
        secondary: {
            main: '#928b80',
            light: '#dbd4c7',
            dark: '#686358',
        },
        neutral: {
            main: '#605b50',
            light: '#332f25',
            dark: '#181305',
        },
        shades: {
            light: '#e3ddd1',
            medium: '#cac4ba',
            dark: '#97938b',
        },
        tints: {
            tint1: '#fdf7ed',
            tint2: '#fdf9f1',
            tint3: '#fefaf4',
        },
        custom: {
            highlight: '#c17912',
            accent: '#a66910',
            main: '#ff9800',
            light: '#f57c00',
        },
    },
    typography: {
        fontFamily: [
            'Raleway',
            'Open Sans',
            'Arial',
            'sans-serif',
        ].join(','),
        h1: {
            fontFamily: 'Raleway, Merriweather, Georgia, serif',
            fontWeight: 700,
        },
        h2: {
            fontFamily: 'Raleway, Merriweather, Georgia, serif',
            fontWeight: 600,
        },
        h3: {
            fontFamily: 'Raleway, Merriweather, Georgia, serif',
            fontWeight: 500,
        },
        body1: {
            fontFamily: 'Raleway, Open Sans, Arial, sans-serif',
            fontWeight: 400,
        },
        button: {
            fontFamily: 'Raleway, Arial, sans-serif',
            textTransform: 'capitalize',
        },
    },
    spacing: (factor) => `${0.25 * factor}rem`,
});

export default theme;
