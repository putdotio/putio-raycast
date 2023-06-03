import { ActionPanel, Icon, List } from "@raycast/api";
import type { IHistoryEvent } from "@putdotio/api-client";
import { filesize } from "filesize";
import { format } from "timeago.js";
import { TransferListItemFileActions } from "./TransferListItem";

export const HistoryListItem = ({ event }: { event: IHistoryEvent }) => {
  switch (event.type) {
    case "transfer_completed":
      return (
        <List.Item
          title={event.transfer_name}
          accessories={[
            {
              text: format(event.created_at + "Z"),
            },
            {
              text: filesize(event.transfer_size).toString(),
              icon: Icon.HardDrive,
            },
          ]}
          actions={
            <ActionPanel title={event.transfer_name}>
              <TransferListItemFileActions fileId={event.file_id} />
            </ActionPanel>
          }
        />
      );

    case "file_shared":
      return (
        <List.Item
          title={event.file_name}
          accessories={[
            {
              text: format(event.created_at + "Z"),
            },
            {
              text: event.sharing_user_name,
              icon: Icon.Person,
            },
          ]}
        />
      );

    default:
      return <List.Item title={event.type} />;
  }
};
