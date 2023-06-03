import { ActionPanel, Color, Icon, List, Action } from "@raycast/api";
import { getProgressIcon } from "@raycast/utils";
import type { Transfer } from "@putdotio/api-client";
import { filesize } from "filesize";

type Props = {
  transfer: Transfer;
};

const TransferListItemActions = ({ transfer }: Props) => (
  <ActionPanel title={transfer.name}>
    {transfer.file_id ? (
      <Action.OpenInBrowser icon="putio.png" url={`https://put.io/files/${transfer.file_id}`} />
    ) : null}
  </ActionPanel>
);

export const TransferListItem = ({ transfer }: Props) => (
  <List.Item
    key={transfer.id}
    title={transfer.name}
    accessories={[
      {
        text: transfer.status || "",
      },
      {
        text: filesize(transfer.size).toString(),
        icon: Icon.HardDrive,
      },
    ]}
    icon={getProgressIcon(transfer.percent_done / 100, Color.Green)}
    actions={<TransferListItemActions transfer={transfer} />}
  />
);
