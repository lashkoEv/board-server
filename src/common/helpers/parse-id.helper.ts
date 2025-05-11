export const parseIds = (raw: any[]): (number | null)[] =>
    raw.map((v) => (v === '__null__' || v === 'null' ? null : +v));
