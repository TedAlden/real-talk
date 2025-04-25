/**
 * Returns the current date and time in the format dd/mm/yyyy hh:mm:ss.
 */
export function getTimestamp() {
  const date = new Date();
  const d = date.getDate().toString().padStart(2, "0");
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const y = date.getFullYear();
  const h = date.getHours().toString().padStart(2, "0");
  const min = date.getMinutes().toString().padStart(2, "0");
  const s = date.getSeconds().toString().padStart(2, "0");

  return `${d}/${m}/${y} ${h}:${min}:${s}`;
}
