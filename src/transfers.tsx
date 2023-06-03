import { useEffect, useRef } from "react";
import { List, Toast, showToast } from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { withPutioClient } from "./api/withPutioClient";
import { fetchTransfers } from "./api/transfers";
import { TransferListItem } from "./components/TransferListItem";

export const Transfers = () => {
  const intervalRef = useRef<NodeJS.Timeout>();

  const { isLoading, data, error, revalidate } = usePromise(fetchTransfers, [], {
    onData: () => {
      if (!intervalRef.current) {
        intervalRef.current = setInterval(revalidate, 3000);
      }
    },
  });

  useEffect(() => {
    if (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Something went wrong",
      });
    }
  }, [error]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <List isLoading={isLoading} searchBarPlaceholder="Search in transfers">
      {data?.transfers.map((transfer) => (
        <TransferListItem key={transfer.id} transfer={transfer} />
      ))}
    </List>
  );
};

export default function Command() {
  return withPutioClient(<Transfers />);
}