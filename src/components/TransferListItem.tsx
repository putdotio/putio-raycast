import { ActionPanel, Color, Icon, List } from "@raycast/api";
import { getProgressIcon, useCachedPromise } from "@raycast/utils";
import type { IFile, Transfer } from "@putdotio/api-client";
import { filesize } from "filesize";
import { FileListItemNavigationActions } from "./FileListItemActions";
import { fetchFiles } from "../api/files";

const TransferListItemFileActions = ({ fileId }: { fileId: IFile["id"] }) => {
  const { data: fileData } = useCachedPromise(fetchFiles, [fileId]);
  return fileData ? <FileListItemNavigationActions file={fileData.parent} /> : null;
};

export const TransferListItem = ({ transfer }: { transfer: Transfer }) => (
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
    actions={
      <ActionPanel title={transfer.name}>
        {transfer.file_id && <TransferListItemFileActions fileId={transfer.file_id} />}
      </ActionPanel>
    }
  />
);
