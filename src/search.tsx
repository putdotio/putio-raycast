import { List } from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { useState } from "react";
import { getPutioClient, withPutioClient } from "./core/withPutioClient";
import { FileListItem } from "./components/FileListItem";

const searchFiles = async (keyword: string) => {
  const response = await getPutioClient().Files.Search(keyword);
  return response.data;
};

const Search = () => {
  const [searchText, setSearchText] = useState("");
  const { isLoading, data } = usePromise(searchFiles, [searchText], {
    execute: searchText !== "",
  });

  return (
    <List
      isLoading={isLoading || searchText === ""}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder="Search in put.io..."
      throttle
    >
      <List.Section title="Results" subtitle={data?.total.toString()}>
        {data?.files.map((file) => (
          <FileListItem file={file} />
        ))}
      </List.Section>
    </List>
  );
};

export default function Command() {
  return withPutioClient(<Search />);
}
