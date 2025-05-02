import { useQueryClient, useQuery } from "@tanstack/react-query";
import { getUsersByQuery } from "../api/userService";

export function useCacheUpdater() {
  const queryClient = useQueryClient();

  return async (userIds) => {
    const missingIds = Array.from(
      new Set(userIds.filter((id) => !queryClient.getQueryData(["user", id]))),
    );

    if (missingIds.length === 0) return;
    try {
      const response = await getUsersByQuery("id", missingIds.join(","));
      if (!response || response.success === false) {
        throw new Error(`Failed to fetch users: ${missingIds.join(", ")}`);
      }

      response.data.forEach((user) => {
        const userData = {
          _id: user._id,
          ...user
        };
        queryClient.setQueryData(["user", user._id], userData);
      });

      return { fetchedCount: response.data.length };
    } catch (error) {
      console.error("Error updating user cache:", error);
      return { fetchedCount: 0 };
    }
  };
}

export function useCachedUser(userId) {
  const { data: user } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => null,
    enabled: false,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return user || null;
}
