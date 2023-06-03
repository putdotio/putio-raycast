import { ActionPanel, Action, Icon } from "@raycast/api";
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
    browser: `https://put.io/files/${file.id}`,
    stream: file.stream_url,
    mp4Stream: file.mp4_stream_url,
  };
};

export const FileListItemActions = ({ file }: { file: IFile }) => {
  const { data: urls } = useCachedPromise(fetchFileURLs, [file]);

  return (
    <ActionPanel title={file.name}>
      {file.file_type === "FOLDER" ? (
        <Action.Push title="Open" target={<Files id={file.id} name={file.name} />} icon={Icon.ArrowRight} />
      ) : null}

      {urls?.browser && <Action.OpenInBrowser title="Open in put.io" url={urls.browser} icon="putio.png" />}
      {urls?.download && <Action.OpenInBrowser title="Download in put.io" url={urls.download} icon="putio.png" />}

      <ActionPanel.Section title="URLs">
        {urls?.browser && <Action.CopyToClipboard title="Copy URL" content={urls.browser} />}
        {urls?.download && <Action.CopyToClipboard title="Copy Download URL" content={urls.download} />}
        {urls?.stream && <Action.CopyToClipboard title="Copy Stream URL" content={urls.stream} />}
        {urls?.mp4Stream && <Action.CopyToClipboard title="Copy MP4 Stream URL" content={urls.mp4Stream} />}
      </ActionPanel.Section>
    </ActionPanel>
  );
};