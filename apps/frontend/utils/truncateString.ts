export function truncateString(
  str: string,
  firstPortionLength: number,
  endPortionLength: number,
) {
  if (str.length <= firstPortionLength + endPortionLength) return str; //No truncation need

  const firstPortion = str.slice(0, firstPortionLength);
  const endPortion = str.slice(-endPortionLength);

  return `${firstPortion}...${endPortion}`;
}
