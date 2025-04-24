export default function getTimeAgo(date) {
  const now = new Date();
  const postDate = new Date(date);
  const diffInMin = (now - postDate) / (1000 * 60);
  const diffInHours = diffInMin / 60;
  const diffInDays = diffInHours / 24;

  if (diffInMin < 2) {
    return "Just now";
  } else if (diffInHours < 1) {
    const minutes = Math.floor(diffInMin);
    return `${minutes} minutes ago`;
  } else if (diffInDays < 1) {
    const hours = Math.floor(diffInHours);
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  } else if (diffInDays < 30) {
    const days = Math.floor(diffInDays);
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  } else {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const finalDate = postDate.toLocaleDateString(undefined, options);
    return `on ${finalDate}`;
  }
}
