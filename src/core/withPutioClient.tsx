import { getPreferenceValues } from "@raycast/api";
import { Detail, environment, MenuBarExtra } from "@raycast/api";
import { useState, useMemo } from "react";
import PutioAPI from "@putdotio/api-client";

let putioClient: null | PutioAPI = null;
let authenticated = false;

export const withPutioClient = (component: JSX.Element) => {
  const [x, forceRerender] = useState(0);

  useMemo(() => {
    (async function () {
      const { token } = getPreferenceValues<Preferences>();
      putioClient = new PutioAPI({ clientID: 6311 });
      await putioClient.Auth.ValidateToken(token);
      putioClient.setToken(token);
      authenticated = true;
      forceRerender(x + 1);
    })();
  }, []);

  if (!authenticated) {
    if (environment.commandMode === "view") {
      return <Detail isLoading />;
    } else if (environment.commandMode === "menu-bar") {
      return <MenuBarExtra isLoading />;
    }

    return null;
  }

  return component;
};

export const getPutioClient = () => {
  if (!authenticated || !putioClient) {
    throw new Error("getPutioClient must be used when authenticated");
  }

  return putioClient;
};
