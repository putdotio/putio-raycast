import { List } from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { useState } from "react";
import { withPutioClient, getPutioClient } from "./core/withPutioClient";
import { IFile } from "@putdotio/api-client";

const fetchFiles = async (id: number) => {
  const response = await getPutioClient().Files.Query(id);
  return response.data.files as IFile[];
};

const Files = () => {
  const [fileId, setFileId] = useState<number>(0);
  const { isLoading, data, mutate } = usePromise(fetchFiles, [fileId]);

  return (
    <List isLoading={isLoading}>
      {data?.map((file) => (
        <List.Item key={file.id} title={file.name} />
      ))}
    </List>
  );
};

export default function Command() {
  return withPutioClient(<Files />);
}
