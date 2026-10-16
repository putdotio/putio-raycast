import {
  APIErrorByStatusCodeLocalizer,
  GenericErrorLocalizer,
  createLocalizeError,
  LocalizedError,
} from "@putdotio/utilities";
import { Toast } from "@raycast/api";

const authErrorLocalizer: APIErrorByStatusCodeLocalizer = {
  kind: "api_status_code",
  status_code: 401,
  localize: () => ({
    message: "You are not authorized",
    recoverySuggestion: {
      type: "instruction",
      description: "Please login again.",
    },
  }),
};

const notFoundErrorLocalizer: APIErrorByStatusCodeLocalizer = {
  kind: "api_status_code",
  status_code: 404,
  localize: () => ({
    message: "Resource not found",
    recoverySuggestion: {
      type: "instruction",
      description: "The resource you are looking for does not exist.",
    },
  }),
};

const genericErrorLocalizer: GenericErrorLocalizer = {
  kind: "generic",
  localize: () => ({
    message: "Something went wrong",
    recoverySuggestion: {
      type: "instruction",
      description: "Please try again.",
    },
  }),
};

const localizePutioError = createLocalizeError([authErrorLocalizer, notFoundErrorLocalizer, genericErrorLocalizer]);

// The put.io client rejects with plain objects, and @raycast/utils hooks replace
// any non-Error rejection with `new Error(String(error))`. Wrap the original in
// an Error before it reaches a hook so localizeError can still read it.
class PutioRequestError extends Error {
  constructor(cause: unknown) {
    super("put.io request failed", { cause });
    this.name = "PutioRequestError";
  }
}

export const toError = (error: unknown): Error => (error instanceof Error ? error : new PutioRequestError(error));

export const localizeError = (error: unknown) =>
  localizePutioError(error instanceof PutioRequestError ? error.cause : error);

type LocalizedErrorToToastOptions = {
  title: Toast.Options["title"];
  message: NonNullable<Toast.Options["message"]>;
  style: NonNullable<Toast.Options["style"]>;
  primaryAction?: Toast.Options["primaryAction"];
};

export const localizedErrorToToastOptions = (error: LocalizedError): LocalizedErrorToToastOptions => {
  const { message, recoverySuggestion } = error;

  const toastOptions: LocalizedErrorToToastOptions = {
    title: message,
    message: recoverySuggestion.description,
    style: Toast.Style.Failure,
  };

  if (recoverySuggestion.type === "action") {
    toastOptions.primaryAction = {
      title: recoverySuggestion.trigger.label,
      onAction: () => recoverySuggestion.trigger.callback(),
    };
  }

  return toastOptions;
};
