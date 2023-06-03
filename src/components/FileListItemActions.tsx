import { ActionPanel, Action, Icon } from "@raycast/api";
import { useCachedPromise } from "@raycast/utils";
import { IFile } from "@putdotio/api-client";
import { Files } from "../files";
import { getPutioAccountInfo, getPutioClient } from "../api/withPutioClient";

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

export const FileListItemNavigationActions = ({ file }: { file: IFile }) => {
  const { data: urls } = useCachedPromise(fetchFileURLs, [file]);

  return (
    <>
      {file.file_type === "FOLDER" ? (
        <Action.Push title="Open" target={<Files id={file.id} name={file.name} />} icon={Icon.ArrowRight} />
      ) : null}

      {urls?.browser && <Action.OpenInBrowser title="Open in Browser" url={urls.browser} icon="putio.png" />}
      {urls?.download && <Action.OpenInBrowser title="Download in Browser" url={urls.download} icon="putio.png" />}

      {urls?.browser && (
        <Action.CopyToClipboard
          title="Copy URL"
          content={urls.browser}
          shortcut={{ modifiers: ["cmd", "shift"], key: "c" }}
        />
      )}

      {urls?.download && (
        <Action.CopyToClipboard
          title="Copy Download URL"
          content={urls.download}
          shortcut={{ modifiers: ["cmd", "shift"], key: "d" }}
        />
      )}

      {urls?.stream && <Action.CopyToClipboard title="Copy Stream URL" content={urls.stream} />}
      {urls?.mp4Stream && <Action.CopyToClipboard title="Copy MP4 Stream URL" content={urls.mp4Stream} />}
    </>
  );
};

export const FileListItemMutationActions = ({ file }: { file: IFile }) => {
  const accountInfo = getPutioAccountInfo();

  return (
    <>
      {file.is_shared ? null : (
        <ActionPanel.Section>
          <Action title="Rename" icon={Icon.Pencil} shortcut={{ modifiers: ["cmd"], key: "r" }} />

          <Action
            title={accountInfo.settings.trash_enabled ? "Send to Trash" : "Delete"}
            icon={accountInfo.settings.trash_enabled ? Icon.Trash : Icon.DeleteDocument}
            style={Action.Style.Destructive}
            shortcut={{ modifiers: ["cmd"], key: "backspace" }}
          />
        </ActionPanel.Section>
      )}
    </>
  );
};
