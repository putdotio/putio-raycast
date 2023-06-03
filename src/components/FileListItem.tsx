import { List, Icon, ActionPanel } from "@raycast/api";
import type { IFile } from "@putdotio/api-client";
import { filesize } from "filesize";
import { FileListItemNavigationActions, FileListItemMutationActions } from "./FileListItemActions";

const getIcon = (file: IFile) => {
  switch (file.file_type) {
    case "FOLDER":
      return Icon.Folder;

    case "VIDEO":
      return Icon.Video;

    case "AUDIO":
      return Icon.Music;

    case "IMAGE":
      return Icon.Image;

    default:
      return Icon.Document;
  }
};

export const FileListItem = ({ file, onMutate }: { file: IFile; onMutate: () => void }) => (
  <List.Item
    id={file.id.toString()}
    title={file.name}
    icon={getIcon(file)}
    actions={
      <ActionPanel title={file.name}>
        <FileListItemNavigationActions file={file} />
        <FileListItemMutationActions file={file} onMutate={onMutate} />
      </ActionPanel>
    }
    accessories={[
      {
        text: filesize(file.size).toString(),
        icon: Icon.HardDrive,
      },
    ]}
  />
);
