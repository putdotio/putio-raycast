import { IFile } from "@putdotio/api-client";
import { ActionPanel, Form, Action, useNavigation, showToast, Toast } from "@raycast/api";
import { renameFile } from "./api/files";

export const RenameFile = (props: { file: IFile; onSuccess: () => void }) => {
  const navigation = useNavigation();

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title="Rename"
            onSubmit={async (values) => {
              const toast = await showToast({
                style: Toast.Style.Animated,
                title: "Renaming file...",
              });

              try {
                await renameFile(props.file.id, values.name);

                toast.style = Toast.Style.Success;
                toast.title = "File renamed";

                navigation.pop();
                props.onSuccess();
              } catch (error) {
                toast.style = Toast.Style.Failure;
                toast.title = "Failed to rename file";
              }
            }}
          />
        </ActionPanel>
      }
    >
      <Form.TextField id="name" title="Name" defaultValue={props.file.name} />
    </Form>
  );
};
