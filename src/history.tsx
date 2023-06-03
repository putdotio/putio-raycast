import { useEffect } from "react";
import { Detail, List, Toast, showToast } from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { fetchHistoryEvents } from "./api/history";
import { getPutioAccountInfo, withPutioClient } from "./api/withPutioClient";
import { HistoryListItem } from "./components/HistoryListItem";

const HistoryList = () => {
  const { data: events, isLoading, error } = usePromise(fetchHistoryEvents);

  useEffect(() => {
    if (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Something went wrong",
      });
    }
  }, [error]);

  return (
    <List isLoading={isLoading}>
      {events
        ?.filter((e) => e.type === "transfer_completed")
        .map((event) => (
          <HistoryListItem key={event.id} event={event} />
        ))}
    </List>
  );
};

const History = () => {
  const accountInfo = getPutioAccountInfo();

  if (accountInfo.settings.history_enabled) {
    return <HistoryList />;
  }

  return <Detail markdown="History is disabled in your put.io account settings." />;
};

export default function Command() {
  return withPutioClient(<History />);
}
