export const calculateDiscountPrice = (
    price: number,
    discountPercentage: number,
) => {
    return price * (discountPercentage / 100);
};
