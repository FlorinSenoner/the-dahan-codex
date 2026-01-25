import { getAuth } from "@clerk/tanstack-start/server";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

export const getAuthData = createServerFn({ method: "GET" }).handler(
  async () => {
    const request = getRequest();
    const auth = await getAuth(request);

    return {
      userId: auth.userId,
      sessionId: auth.sessionId,
    };
  },
);
