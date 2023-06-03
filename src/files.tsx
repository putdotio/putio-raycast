import { useEffect } from "react";
import { List, showToast, Toast, Detail } from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { IFile } from "@putdotio/api-client";
import { FileListItem } from "./components/FileListItem";
import { withPutioClient, getPutioClient } from "./core/withPutioClient";

const fetchFiles = async (id: number) => {
  const response = await getPutioClient().Files.Query(id, {
    streamUrl: true,
    mp4StreamUrl: true,
  });

  return {
    parent: response.data.parent,
    files: response.data.files,
  } as {
    parent: IFile;
    files: IFile[];
  };
};

export const Files = ({ id = 0, name = "Your Files" }: { id?: IFile["id"]; name?: IFile["name"] }) => {
  const { isLoading, data, error } = usePromise(fetchFiles, [id]);

  useEffect(() => {
    if (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Something went wrong",
      });
    }
  }, [error]);

  if (!data) {
    return <List isLoading={isLoading} navigationTitle={name} searchBarPlaceholder={`Fetching...`} />;
  }

  switch (data.parent.file_type) {
    case "FOLDER":
      return (
        <List navigationTitle={name} searchBarPlaceholder={`Search in ${name}`}>
          {data.files.map((file) => (
            <FileListItem key={file.id} file={file} />
          ))}
        </List>
      );

    default:
      return <Detail markdown={`# ${data.parent.name}`} />;
  }
};

export default function Command() {
  return withPutioClient(<Files />);
}
