import { useMutation } from "react-admin";

const useDeleteMedia = (data = {}, options = {}) =>
  useMutation(
    { type: "deleteMedia", resource: "media", payload: { data } },
    options
  );

export default useDeleteMedia;
