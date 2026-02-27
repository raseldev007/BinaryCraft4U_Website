/**
 * BDT (Bangladeshi Taka) currency formatting utility
 */

/**
 * Format a number as Bangladeshi Taka
 * @example formatBDT(1500) => "৳1,500"
 * @example formatBDT(1500, true) => "৳1,500.00"
 */
export function formatBDT(amount: number, showDecimals = false): string {
    if (isNaN(amount) || amount == null) return "৳0";
    const formatted = new Intl.NumberFormat("en-BD", {
        minimumFractionDigits: showDecimals ? 2 : 0,
        maximumFractionDigits: showDecimals ? 2 : 0,
    }).format(amount);
    return `৳${formatted}`;
}

/**
 * Format a discount percentage
 */
export function formatDiscount(price: number, discountPrice: number): string {
    if (!discountPrice || discountPrice >= price) return "";
    const pct = Math.round(((price - discountPrice) / price) * 100);
    return `${pct}% OFF`;
}

/**
 * Get effective price (discount price if available)
 */
export function effectivePrice(price: number, discountPrice?: number): number {
    if (discountPrice && discountPrice > 0 && discountPrice < price) return discountPrice;
    return price;
}
