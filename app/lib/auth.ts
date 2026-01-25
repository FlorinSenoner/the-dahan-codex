import { auth } from "@clerk/tanstack-react-start/server";
import { createServerFn } from "@tanstack/react-start";

export const getAuthData = createServerFn({ method: "GET" }).handler(
  async () => {
    const authData = await auth();

    return {
      userId: authData.userId,
      sessionId: authData.sessionId,
    };
  },
);
