import type { IFile } from "@putdotio/api-client";
import { getPutioClient } from "./withPutioClient";

export const fetchFiles = async (id: number) => {
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

export const searchFiles = async (keyword: string) => {
  const response = await getPutioClient().Files.Search(keyword);
  return response.data;
};
