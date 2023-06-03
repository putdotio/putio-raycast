import { List, Icon } from "@raycast/api";
import { IFile } from "@putdotio/api-client";
import { filesize } from "filesize";
import { FileListItemActions } from "./FileListItemActions";

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

export const FileListItem = ({ file }: { file: IFile }) => (
  <List.Item
    id={file.id.toString()}
    title={file.name}
    icon={getIcon(file)}
    actions={<FileListItemActions file={file} />}
    accessories={[
      {
        text: filesize(file.size).toString(),
        icon: Icon.HardDrive,
      },
    ]}
  />
);
