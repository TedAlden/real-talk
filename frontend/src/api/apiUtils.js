export const apiErrorResponse = (error) => {
  if (error.response) {
    // If error has a response, it means the request reached the backend but it
    // sent back an error.
    console.error("Backend error:", error);
    return {
      success: false,
      status: error.response.status,
      message: error.response.data.error,
    };
  } else {
    // Otherwise, it's an error with the request
    console.error("Error:", error);
    return { success: false, message: error };
  }
};
