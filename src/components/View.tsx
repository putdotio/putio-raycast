import { withPutioClient } from "../core/withPutioClient";

export default function View({ children }: { children: JSX.Element }) {
  return withPutioClient(children);
}
