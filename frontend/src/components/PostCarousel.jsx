import { Carousel, createTheme } from "flowbite-react";

// Custom theme configuration for carousel controls and indicators
const carouselTheme = createTheme({
  indicators: {
    active: {
      off: "bg-white/50 hover:bg-white shadow-lg dark:bg-gray-200/50 dark:hover:bg-gray-200",
      on: "bg-white dark:bg-gray-200 shadow-lg ",
    },
    base: "h-2 w-2 rounded-full",
    wrapper: "absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-3",
  },
  control: {
    base: "inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/30 group-hover:bg-white/50 group-focus:outline-none group-focus:ring-4 group-focus:ring-white sm:h-10 sm:w-10 dark:bg-gray-100/30 dark:group-hover:bg-gray-100/60 dark:group-focus:ring-gray-100/70",
    icon: "h-5 w-5 text-white sm:h-6 sm:w-6 dark:text-gray-900",
  },
});

/**
 * Displays post images either as a single image or in a carousel
 * @param {string[]} images - Array of image URLs to display
 */
function PostCarousel({ images }) {
  // Return null if no images
  if (images.length === 0) {
    return null;
  } 
  
  // Single image display
  else if (images.length === 1) {
    return (
      <div className="mt-4 flex h-96 w-full items-center justify-center rounded-md bg-gray-900">
        <img
          data-testid="post-image"
          src={images[0]}
          className="h-full object-contain"
        />
      </div>
    );
  } 
  
  // Multiple images carousel
  else {
    return (
      <Carousel
        data-testid="post-media"
        theme={carouselTheme}
        slide={false}
        className="mt-4 h-96 items-start"
      >
        {images.map((image, idx) => (
          <img
            data-testid="post-image"
            key={idx}
            src={image}
            className="h-full bg-gray-900 object-contain"
          />
        ))}
      </Carousel>
    );
  }
}

export default PostCarousel;
