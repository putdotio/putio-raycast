import { Action, ActionPanel, Detail, Icon, openExtensionPreferences, showToast } from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { useReducer, type ReactElement } from "react";
import PutioAPI, { IAccountInfo } from "@putdotio/api-client";
import { localizeError, localizedErrorToToastOptions } from "./localizeError";
import { getAuthToken } from "../utils";

type AccountSession = {
  token: string;
  client: PutioAPI;
  accountInfo: IAccountInfo;
};

let accountSession: AccountSession | null = null;

async function loadAccountSession(token: string): Promise<AccountSession> {
  const client = new PutioAPI({ clientID: 6311 });
  client.setToken(token);
  const response = await client.Account.Info();
  if (!response.data.info) {
    throw new Error("Account information is missing");
  }
  return { token, client, accountInfo: response.data.info };
}

function AccountBootstrap({
  token,
  children,
  refreshPreferences,
}: {
  token: string;
  children: ReactElement;
  refreshPreferences: () => void;
}) {
  const { data, error, isLoading, revalidate } = usePromise(loadAccountSession, [token], {
    onData: (session) => {
      if (session.token !== getAuthToken()) {
        refreshPreferences();
        return;
      }
      accountSession = session;
    },
    onError: (error) => {
      if (token !== getAuthToken()) {
        refreshPreferences();
        return;
      }
      showToast(localizedErrorToToastOptions(localizeError(error)));
    },
  });

  if (isLoading) {
    return <Detail isLoading />;
  }

  if (error) {
    const localized = localizeError(error);
    return (
      <Detail
        markdown={`# ${localized.message}\n\n${localized.recoverySuggestion.description}`}
        actions={
          <ActionPanel>
            <Action
              title="Retry"
              icon={Icon.ArrowClockwise}
              onAction={() => {
                if (getAuthToken() !== token) {
                  refreshPreferences();
                } else {
                  revalidate();
                }
              }}
            />
            <Action title="Open Extension Preferences" icon={Icon.Gear} onAction={openExtensionPreferences} />
          </ActionPanel>
        }
      />
    );
  }

  return data ? children : <Detail isLoading />;
}

function AccountBoundary({ children }: { children: ReactElement }) {
  const [, refreshPreferences] = useReducer((revision: number) => revision + 1, 0);
  const token = getAuthToken();
  return (
    <AccountBootstrap key={token} token={token} refreshPreferences={refreshPreferences}>
      {children}
    </AccountBootstrap>
  );
}

export const withPutioClient = (component: ReactElement) => <AccountBoundary>{component}</AccountBoundary>;

function getAccountSession() {
  if (!accountSession || accountSession.token !== getAuthToken()) {
    throw new Error("put.io account must be authenticated");
  }
  return accountSession;
}

export const getPutioClient = () => getAccountSession().client;

export const getPutioAccountInfo = () => getAccountSession().accountInfo;
