import { ActionPanel, Action } from "@raycast/api";
import { useCachedPromise } from "@raycast/utils";
import { IFile } from "@putdotio/api-client";
import { Files } from "../files";
import { getPutioClient } from "../core/withPutioClient";

const fetchFileDownloadURL = async (file: IFile) => {
  switch (file.file_type) {
    case "IMAGE":
    case "VIDEO": {
      const response = await getPutioClient().get(`/files/${file.id}/url`);
      return response.data.url as string;
    }

    default:
      return null;
  }
};

const fetchFileURLs = async (file: IFile) => {
  const download = await fetchFileDownloadURL(file);

  return {
    download,
    browse: `https://put.io/files/${file.id}`,
    stream: file.stream_url,
    mp4Stream: file.mp4_stream_url,
  };
};

export const FileListItemActions = ({ file }: { file: IFile }) => {
  const { data: urls } = useCachedPromise(fetchFileURLs, [file]);

  return (
    <ActionPanel>
      {file.file_type === "FOLDER" ? <Action.Push title="Open" target={<Files id={file.id} />} /> : null}
      {urls?.download && <Action.CopyToClipboard title="Copy Download URL" content={urls.download} />}
      {urls?.stream && <Action.CopyToClipboard title="Copy Stream URL" content={urls.stream} />}
      {urls?.mp4Stream && <Action.CopyToClipboard title="Copy MP4 Stream URL" content={urls.mp4Stream} />}
      {urls?.browse && <Action.OpenInBrowser title="Open in put.io" url={urls.browse} />}
    </ActionPanel>
  );
};
