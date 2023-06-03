import { ActionPanel, Color, Icon, List } from "@raycast/api";
import { getProgressIcon, useCachedPromise } from "@raycast/utils";
import type { IFile, Transfer } from "@putdotio/api-client";
import { filesize } from "filesize";
import { format } from "timeago.js";
import { FileListItemNavigationActions } from "./FileListItemActions";
import { fetchFiles } from "../api/files";
import { useMemo } from "react";

export const TransferListItemFileActions = ({ fileId }: { fileId: IFile["id"] }) => {
  const { data: fileData } = useCachedPromise(fetchFiles, [fileId]);
  return fileData ? <FileListItemNavigationActions file={fileData.parent} /> : null;
};

export const TransferListItem = ({ transfer }: { transfer: Transfer }) => {
  const statusText = useMemo(() => {
    if (transfer.status === "COMPLETED") {
      return `completed ${format(transfer.finished_at || transfer.created_at)}`;
    }

    return transfer.status.toLowerCase();
  }, [transfer]);

  return (
    <List.Item
      key={transfer.id}
      title={transfer.name}
      accessories={[
        {
          text: statusText,
        },
        {
          text: filesize(transfer.size).toString(),
          icon: Icon.HardDrive,
        },
      ]}
      icon={getProgressIcon(transfer.percent_done / 100, Color.Green)}
      actions={
        <ActionPanel title={transfer.name}>
          {transfer.userfile_exists && transfer.file_id && <TransferListItemFileActions fileId={transfer.file_id} />}
        </ActionPanel>
      }
    />
  );
};
