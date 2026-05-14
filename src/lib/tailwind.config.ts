export default {
  theme: {
    extend: {
      animation: {
        blob: 'blob 10s infinite',
      },
      keyframes: {
        blob: {
          '0%, 100%': { transform: 'translate(0px, 0px)' },
          '33%': { transform: 'translate(30px, -50px)' },
          '66%': { transform: 'translate(-20px, 20px)' },
        },
      },
    },
  },
}
