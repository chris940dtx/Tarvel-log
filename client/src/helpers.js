export const withAuth =
  (...data) =>
  async (config) => {
    const token = config.headers.Authorization?.split(" ")[1];

    const verified = token ? await verifyToken(token) : false;

    if (env.USE_AUTH && !verified) {
      return [401, { message: "Unauthorized" }];
    }

    return typeof data[0] === "function" ? data[0](config) : data;
  };
