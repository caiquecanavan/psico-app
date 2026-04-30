// Configuração adicional do Tailwind (já incluída no HTML)
// Este arquivo serve como referência para customizações futuras

tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                'primary': '#002271',
                'primary-light': '#0B369B',
                'secondary': '#295bb2',
                'tertiary': '#00226f',
                'background': '#CFDEE7',
                'surface': '#ffffff',
                'error': '#ba1a1a',
                'success': '#10b981',
                'warning': '#f59e0b'
            },
            fontFamily: {
                'sans': ['Plus Jakarta Sans', 'sans-serif']
            },
            borderRadius: {
                'xl': '0.75rem',
                '2xl': '1rem',
                '3xl': '1.5rem'
            }
        }
    }
}