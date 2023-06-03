import { useState } from "react";
import { ActionPanel, Form, Action, showToast, Toast, useNavigation } from "@raycast/api";
import { withPutioClient } from "./api/withPutioClient";
import { addTransfers } from "./api/transfers";
import { Transfers } from "./transfers";
import { TransferErrorList } from "./components/TransferErrorList";

const NewTransfer = () => {
  const [method, setMethod] = useState<string>("paste-links");
  const navigation = useNavigation();

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
                        navigation.push(<Transfers />);
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
                      result.type === "multi-failure" ? "Failed to add transfers" : "Failed to add some transfers";
                    toast.style = Toast.Style.Failure;
                    toast.primaryAction = {
                      title: "View errors",
                      onAction: (toast) => {
                        toast.hide();
                        navigation.push(<TransferErrorList errors={result.errors} />);
                      },
                    };
                    toast.secondaryAction = {
                      title: "View transfers",
                      onAction: (toast) => {
                        toast.hide();
                        navigation.push(<Transfers />);
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

      {method === "paste-links" ? (
        <Form.TextArea
          autoFocus
          id="links"
          title="Links"
          placeholder="Paste torrent links, magnet links, direct links or links to video pages from popular video sites."
        />
      ) : (
        <Form.FilePicker id="files" />
      )}
    </Form>
  );
};

export default function Command() {
  return withPutioClient(<NewTransfer />);
}
