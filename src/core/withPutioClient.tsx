import { getPreferenceValues } from "@raycast/api";
import { Detail, environment, MenuBarExtra } from "@raycast/api";
import { useState, useMemo } from "react";
import PutioAPI, { IAccountInfo } from "@putdotio/api-client";

let putioClient: PutioAPI | null = null;
let accountInfo: IAccountInfo | null = null;

export const withPutioClient = (component: JSX.Element) => {
  const [x, forceRerender] = useState(0);

  useMemo(() => {
    (async function () {
      const { token } = getPreferenceValues<Preferences>();
      putioClient = new PutioAPI({ clientID: 6311 });
      putioClient.setToken(token);

      const accountInfoResponse = await putioClient.Account.Info();
      accountInfo = accountInfoResponse.data.info;

      forceRerender(x + 1);
    })();
  }, []);

  if (!accountInfo) {
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
  if (!accountInfo || !putioClient) {
    throw new Error("getPutioClient must be used when authenticated");
  }

  return putioClient;
};

export const getPutioAccountInfo = () => {
  if (!accountInfo || !putioClient) {
    throw new Error("getPutioAccountInfo must be used when authenticated");
  }

  return accountInfo;
};
