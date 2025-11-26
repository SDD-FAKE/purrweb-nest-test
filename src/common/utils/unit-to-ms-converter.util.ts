const multipliers = {s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000} as const;

export const convertUnitToMs = (unitTime: `${number}${"s"|"m"|"h"|"d"}` | number): number => {
    if(typeof unitTime === 'number') return unitTime;

    const unit = unitTime[unitTime.length - 1] as keyof typeof multipliers;
    const value = Number(unitTime.slice(0, -1));
    if(Number.isNaN(value)) return NaN;

    const multiplier = multipliers[unit];
    if(!multiplier) return NaN;

    return value * multiplier;
};
