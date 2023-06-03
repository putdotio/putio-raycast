import { List } from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { useState } from "react";
import { withPutioClient } from "./api/withPutioClient";
import { searchFiles } from "./api/files";
import { FileListItem } from "./components/FileListItem";

const SearchFiles = () => {
  const [searchText, setSearchText] = useState("");
  const { isLoading, data } = usePromise(searchFiles, [searchText], {
    execute: searchText !== "",
  });

  return (
    <List
      isLoading={isLoading || searchText === ""}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder="Search in put.io"
      throttle
    >
      <List.Section title="Results" subtitle={data?.total.toString()}>
        {data?.files.map((file) => (
          <FileListItem key={file.id} file={file} />
        ))}
      </List.Section>
    </List>
  );
};

export default function Command() {
  return withPutioClient(<SearchFiles />);
}
