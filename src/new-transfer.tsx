import { useMemo, useState } from "react";
import { ActionPanel, Form, Action, showToast, Toast, useNavigation } from "@raycast/api";
import { withPutioClient } from "./core/withPutioClient";
import { useAddTransfers } from "./hooks/transfers";
import { TransferErrorList } from "./components/TransferErrorList";

const NewTransfer = () => {
  const [method, setMethod] = useState<string>("paste-links");
  const addTransfers = useAddTransfers();
  const navigation = useNavigation();

  const content = useMemo(() => {
    switch (method) {
      case "paste-links":
        return (
          <Form.TextArea
            autoFocus
            id="links"
            title="Links"
            placeholder="Paste torrent links, magnet links, direct links or links to video pages from popular video sites."
          />
        );

      case "upload-files":
        return <Form.FilePicker id="files" />;

      default:
        return null;
    }
  }, [method]);

  return (
    <Form
      navigationTitle="New transfer"
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title="Add Transfers"
            onSubmit={async (values) => {
              if (values.method === "paste-links") {
                const toast = await showToast({
                  title: "Adding transfers...",
                  style: Toast.Style.Animated,
                });

                const result = await addTransfers(values.links);

                switch (result.type) {
                  case "success":
                    toast.title = "Transfers added";
                    toast.style = Toast.Style.Success;
                    toast.primaryAction = {
                      title: "View transfers",
                      onAction: (toast) => {
                        toast.hide();
                      },
                    };
                    break;

                  case "failure":
                    toast.title = "Failed to add transfer";
                    toast.message = result.error.error_type;
                    toast.style = Toast.Style.Failure;
                    break;

                  case "multi-failure":
                  case "partial-success":
                    toast.title =
                      result.type === "multi-failure" ? "Failed to add transfers" : "Some transfers failed to add";
                    toast.style = Toast.Style.Failure;
                    toast.primaryAction = {
                      title: "View errors",
                      onAction: (toast) => {
                        toast.hide();
                        navigation.push(<TransferErrorList errors={result.errors} />);
                      },
                    };
                    break;

                  default:
                    break;
                }
              }

              return false;
            }}
          />
        </ActionPanel>
      }
    >
      <Form.Dropdown id="method" title="Method" value={method} onChange={setMethod}>
        <Form.Dropdown.Item value="paste-links" title="Paste links" />
        <Form.Dropdown.Item value="upload-files" title="Upload files" />
      </Form.Dropdown>

      {content}
    </Form>
  );
};

export default function Command() {
  return withPutioClient(<NewTransfer />);
}
