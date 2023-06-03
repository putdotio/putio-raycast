import { useMemo } from "react";
import { List } from "@raycast/api";
import type { IFile } from "@putdotio/api-client";

export const FileListItemDetail = ({ file }: { file: IFile }) => {
  const markdown = useMemo(() => {
    switch (file.file_type) {
      case "IMAGE":
      case "VIDEO":
        return `![${file.name}](${file.screenshot})`;

      default:
        return;
    }
  }, [file]);

  return (
    <List.Item.Detail
      markdown={markdown}
      metadata={
        <List.Item.Detail.Metadata>
          <List.Item.Detail.Metadata.Label title="Name" text={file.name} />
          <List.Item.Detail.Metadata.Label title="Size" text={file.size.toString()} />
          <List.Item.Detail.Metadata.Label title="Type" text={file.content_type} />
          <List.Item.Detail.Metadata.Label title="Created At" text={file.created_at.toString()} />
          <List.Item.Detail.Metadata.Label title="Modified At" text={file.updated_at.toString()} />
        </List.Item.Detail.Metadata>
      }
    />
  );
};
