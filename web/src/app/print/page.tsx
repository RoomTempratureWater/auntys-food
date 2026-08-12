import { prisma } from 'db';
import PrintButton from './PrintButton';

const dietStyles: Record<string, { label: string; color: string; bg: string; border: string; dot: string }> = {
  veg: { label: 'VEG', color: '#166534', bg: '#dcfce7', border: '#bbf7d0', dot: '#22c55e' },
  nonveg: { label: 'NON-VEG', color: '#991b1b', bg: '#fee2e2', border: '#fecaca', dot: '#ef4444' },
  egg: { label: 'EGG', color: '#854d0e', bg: '#fef9c3', border: '#fde68a', dot: '#eab308' },
};

function getDietCounts(bookings: { user: { diet_type: string } }[]) {
  const veg = bookings.filter(b => b.user.diet_type === 'veg').length;
  const nonveg = bookings.filter(b => b.user.diet_type === 'nonveg').length;
  const egg = bookings.filter(b => b.user.diet_type === 'egg').length;
  return { veg, nonveg, egg };
}

export default async function PrintLabelsPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date } = await searchParams;
  const queryDate = date ? new Date(date) : new Date();
  queryDate.setHours(0, 0, 0, 0);
  const nextDate = new Date(queryDate);
  nextDate.setDate(nextDate.getDate() + 1);

  const bookings = await prisma.mealSchedule.findMany({
    where: {
      date: {
        gte: queryDate,
        lt: nextDate,
      },
      status: 'booked',
    },
    include: {
      user: true,
    },
    orderBy: {
      type: 'asc',
    },
  });

  const lunchBookings = bookings.filter((b) => b.type === 'lunch');
  const dinnerBookings = bookings.filter((b) => b.type === 'dinner');

  const lunchCounts = getDietCounts(lunchBookings);
  const dinnerCounts = getDietCounts(dinnerBookings);

  const dateLabel = queryDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  function renderDietBadge(type: string) {
    const d = dietStyles[type] || dietStyles.veg;
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: 600, padding: '2px 6px', borderRadius: '4px', border: `1px solid ${d.border}`, background: d.bg, color: d.color, letterSpacing: '0.5px' }}>
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: d.dot, display: 'inline-block' }} />
        {d.label}
      </span>
    );
  }

  function renderDietSummary(counts: { veg: number; nonveg: number; egg: number }) {
    return (
      <span style={{ fontSize: '13px', color: '#71717a', marginLeft: '12px' }}>
        {counts.veg > 0 && <span style={{ color: '#166534', fontWeight: 500 }}>● {counts.veg} Veg</span>}
        {counts.veg > 0 && (counts.nonveg > 0 || counts.egg > 0) && <span> &nbsp;·&nbsp; </span>}
        {counts.nonveg > 0 && <span style={{ color: '#991b1b', fontWeight: 500 }}>● {counts.nonveg} Non-Veg</span>}
        {counts.nonveg > 0 && counts.egg > 0 && <span> &nbsp;·&nbsp; </span>}
        {counts.egg > 0 && <span style={{ color: '#854d0e', fontWeight: 500 }}>● {counts.egg} Egg</span>}
      </span>
    );
  }

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @media print {
            .no-print { display: none !important; }
            .label { break-inside: avoid; }
          }
        `,
        }}
      />

      <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", color: '#18181b', background: '#fff', padding: '32px', maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '4px' }}>Delivery Labels</h1>
        <p style={{ color: '#71717a', fontSize: '14px', marginBottom: '32px' }}>{dateLabel}</p>

        {/* Lunch Section */}
        <div style={{ fontSize: '16px', fontWeight: 600, padding: '8px 0', borderBottom: '2px solid #e4e4e7', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          ☀️ Lunch ({lunchBookings.length})
          {renderDietSummary(lunchCounts)}
        </div>
        {lunchBookings.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '36px' }}>
            {lunchBookings.map((b) => (
              <div key={b.id} className="label" style={{ border: '1.5px solid #e4e4e7', borderRadius: '10px', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600, fontSize: '15px' }}>{b.user.name}</span>
                  {renderDietBadge(b.user.diet_type)}
                </div>
                <div style={{ fontSize: '12px', color: '#52525b', marginBottom: '6px' }}>{b.user.address}</div>
                <div style={{ fontSize: '11px', color: '#71717a', fontFamily: 'monospace' }}>{b.user.phone_number}</div>
                {b.user.has_preferences && (
                  <div style={{ marginTop: '8px', fontSize: '11px', color: '#b45309', background: '#fef3c7', border: '1px solid #fde68a', padding: '3px 8px', borderRadius: '6px', display: 'inline-block', fontWeight: 500 }}>
                    ⚠ {b.user.preferences_text || 'Special Request'}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#a1a1aa', textAlign: 'center', padding: '32px' }}>No lunch bookings.</p>
        )}

        {/* Dinner Section */}
        <div style={{ fontSize: '16px', fontWeight: 600, padding: '8px 0', borderBottom: '2px solid #e4e4e7', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          🌙 Dinner ({dinnerBookings.length})
          {renderDietSummary(dinnerCounts)}
        </div>
        {dinnerBookings.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '36px' }}>
            {dinnerBookings.map((b) => (
              <div key={b.id} className="label" style={{ border: '1.5px solid #e4e4e7', borderRadius: '10px', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600, fontSize: '15px' }}>{b.user.name}</span>
                  {renderDietBadge(b.user.diet_type)}
                </div>
                <div style={{ fontSize: '12px', color: '#52525b', marginBottom: '6px' }}>{b.user.address}</div>
                <div style={{ fontSize: '11px', color: '#71717a', fontFamily: 'monospace' }}>{b.user.phone_number}</div>
                {b.user.has_preferences && (
                  <div style={{ marginTop: '8px', fontSize: '11px', color: '#b45309', background: '#fef3c7', border: '1px solid #fde68a', padding: '3px 8px', borderRadius: '6px', display: 'inline-block', fontWeight: 500 }}>
                    ⚠ {b.user.preferences_text || 'Special Request'}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#a1a1aa', textAlign: 'center', padding: '32px' }}>No dinner bookings.</p>
        )}

        <PrintButton />
      </div>
    </>
  );
}
