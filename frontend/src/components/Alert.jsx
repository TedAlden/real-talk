export default function Alert({ type, title, message }) {
  const getDivColour = (type) => {
    switch (type) {
      case "info":
        return "bg-blue-50 text-blue-800 dark:bg-gray-800 dark:text-blue-400";
      case "danger":
        return "bg-red-50 text-red-800 dark:bg-gray-800 dark:text-red-400";
      case "success":
        return "bg-green-50 text-green-800 dark:bg-gray-800 dark:text-green-400";
      case "warning":
        return "bg-yellow-50 text-yellow-800 dark:bg-gray-800 dark:text-yellow-300";
      case "default":
        return "bg-gray-50 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      default:
        return "bg-gray-50 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div
      className={`mb-4 flex items-center rounded-lg p-4 text-sm ${getDivColour(type)}`}
      role="alert"
    >
      <svg
        className="me-3 inline h-4 w-4 shrink-0"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
      </svg>
      <span className="sr-only">Info</span>
      <div>
        <span className="font-medium">{title}</span> {message}
      </div>
    </div>
  );
}
