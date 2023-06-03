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
          icon={Icon.SaveDocument}
          accessories={[
            {
              text: format(event.created_at),
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

    default:
      return <List.Item title={event.type} />;
  }
};
