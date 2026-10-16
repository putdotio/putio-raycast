import { getPutioClient } from "./withPutioClient";
import { toError } from "./localizeError";

export const fetchHistoryEvents = async () => {
  const response = await getPutioClient()
    .Events.Query()
    .catch((error) => {
      throw toError(error);
    });
  return response.data.events;
};
