import { useMutation } from "react-admin";

const useUploadMedia = (data = {}, options = {}) =>
  useMutation(
    { type: "uploadMedia", resource: "media", payload: { data } },
    options
  );

export default useUploadMedia;
