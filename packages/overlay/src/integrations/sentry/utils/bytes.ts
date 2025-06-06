export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const dm = decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Number.parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
}
