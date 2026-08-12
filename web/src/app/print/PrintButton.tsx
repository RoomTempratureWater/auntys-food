'use client';

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        background: '#18181b',
        color: '#fff',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: 600,
        cursor: 'pointer',
      }}
      className="no-print"
    >
      🖨️ Print Labels
    </button>
  );
}
