export const apiErrorResponse = (error) => {
  if (error.response) {
    //If error has a response, it means the request reached the backend but it sent back an error.
    console.error("Backend error:", error);
    const code = error.response.status;
    const message = error.response.data.error;
    return { success: false, error: `Status ${code}: ${message}` };
  } else {
    //Otherwise, it's an error with the request
    console.error("Error:", error);
    return { success: false, error: error };
  }
};
