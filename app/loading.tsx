export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#05070d]">
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: '2px solid oklch(0.7 0.18 280 / 0.12)',
          borderTopColor: 'oklch(0.78 0.18 280)',
          animation: 'spin 0.5s ease-in infinite',
          filter: 'drop-shadow(0 0 6px oklch(0.75 0.16 280 / 0.85))',
        }}
      />
    </div>
  )
}
