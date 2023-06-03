import { List, Icon, ActionPanel } from "@raycast/api";
import type { IFile } from "@putdotio/api-client";
import { filesize } from "filesize";
import { FileListItemNavigationActions, FileListItemMutationActions } from "./FileListItemActions";
import { useMemo } from "react";

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

export const FileListItem = ({ file, onMutate }: { file: IFile; onMutate: () => void }) => {
  const accessories = useMemo(() => {
    let accessories = [
      {
        icon: Icon.HardDrive,
        text: filesize(file.size).toString(),
      },
    ];

    if (file.is_shared && file.sender_name) {
      accessories = [
        {
          icon: Icon.Person,
          text: file.sender_name,
        },
        ...accessories,
      ];
    }

    return accessories;
  }, [file]);

  return (
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
      accessories={accessories}
    />
  );
};
