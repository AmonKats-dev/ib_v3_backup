import {
  useNotify,
  useRefresh,
  useMutation,
  useDataProvider,
} from "react-admin";
import React, { useState, useEffect } from "react";
import { DeleteOutline } from "@material-ui/icons";
import lodash from "lodash";
import { makeStyles } from "@material-ui/core/styles";
import { useDropzone } from "react-dropzone";
import useDeleteMedia from "../../../data/providers/useDeleteMedia";
import useUploadMedia from "../../../data/providers/useUploadMedia";

const useStyles = makeStyles(
  (theme) => ({
    dropZone: {
      width: 250,
      margin: 10,
      border: "1px dotted",
      background: theme.palette.background.default,
      cursor: "pointer",
      padding: theme.spacing(1),
      textAlign: "center",
      color: theme.palette.getContrastText(theme.palette.background.default),
    },
    preview: {},
    removeButton: {},
    deleteIcon: {
      cursor: "pointer",
      marginRight: 10,
    },
    fileItem: {
      lineHeight: "35px",
      display: "flex",
      alignItems: "center",
    },
  }),
  { name: "RaFileInput" }
);

const FileUploader = ({
  record,
  resource,
  accept,
  maxSize,
  minSize,
  multiple,
  tag,
  meta,
  label,
  onDelete,
  noRefreshOnDelete,
  ...props
}) => {
  const [files, setFiles] = useState([]);
  const [media, setMedia] = useState(null);
  const [deleteFile, setDeleteFile] = useState(null);
  const classes = useStyles(props);
  const notify = useNotify();
  const refresh = useRefresh();
  const dataProvider = useDataProvider();

  useEffect(() => {
    if (record && record.files) {
      const propsFiles = lodash
        .sortBy(
          record.files &&
            record.files.filter((item) => {
              const fileMeta =
                item.meta && typeof item.meta === "string"
                  ? JSON.parse(item.meta)
                  : item.meta;

              return fileMeta && fileMeta.relatedField === meta.relatedField;
            }),
          "id"
        )
        .reverse();

      setFiles(multiple ? propsFiles : propsFiles[0] ? [propsFiles[0]] : []);
    }
  }, [record]);

  useEffect(() => {
    if (media && props.approvedUploading) {
      uploadMedia();
    }
  }, [media, props.approvedUploading]);

  useEffect(() => {
    if (deleteFile) deleteMedia();
  }, [deleteFile]);

  const [mutate, { loading }] = useMutation();

  const uploadMedia = () => {
    mutate(
      {
        type: "uploadMedia",
        resource: "media",
        payload: {
          data: media,
        },
      },
      {
        onSuccess: (response) => {
          if (response.data) {
            setFiles([response.data]);
            notify("File uploaded!");
            if (props.onFileUpload) {
              if (props.entityIds && props.entityIds.length > 1) {
                dataProvider.custom("media", {
                  method: "POST",
                  query: {
                    entity_ids: props.entityIds,
                    entity_type: response.data.entity_type,
                    filename: response.data.filename,
                    meta: response.data.meta,
                    title: response.data.title,
                  },
                });
              }
              props.onFileUpload(response.data);
            } else {
              refresh();
            }
          }
        },
        onFailure: (error) =>
          notify(
            `Error on file uploading, please try again later! ${error.message}`,
            "warning"
          ),
      }
    );
  };

  const [deleteMedia] = useDeleteMedia(deleteFile, {
    onSuccess: (response) => {
      const propsFiles = lodash
        .sortBy(
          record.files &&
            record.files.filter((item) => {
              const fileMeta =
                item.meta && typeof item.meta === "string"
                  ? JSON.parse(item.meta)
                  : item.meta;

              return fileMeta && fileMeta.relatedField === meta.relatedField;
            }),
          "id"
        )
        .reverse();
      notify("File was deleted!", "success");

      if (onDelete && noRefreshOnDelete) {
        onDelete(deleteFile.id);
      } else {
        refresh();
        onDelete(deleteFile.id);
      }

      setFiles(multiple ? propsFiles : propsFiles[0] ? [propsFiles[0]] : []);
    },
    onFailure: ({ error }) => {
      notify(error.message, "error");
      notify("File wasn`t deleted!", "error");
    },
  });

  const removeMedia = (id) => (event) => {
    if (id) {
      setDeleteFile({ id, record, entity_type: resource });
    } else {
      setFiles([]);
      props.onFileDelete();
    }
  };

  const transformFile = (file) => {
    if (!(file instanceof File)) {
      return file;
    }

    const preview = URL.createObjectURL(file);
    const transformedFile = {
      rawFile: file,
      link: preview,
      title: file.name,
    };

    return transformedFile;
  };

  const transformFiles = (files) => {
    if (!files) {
      return props.multiple ? [] : null;
    }

    if (Array.isArray(files)) {
      return files.map(transformFile);
    }

    return transformFile(files);
  };

  const onDrop = (newFiles, rejectedFiles, event) => {
    const formattedFiles = transformFiles(newFiles);
    setFiles([formattedFiles[0]]);
    if (props.onFileSelect) {
      props.onFileSelect(true);
    }
    setMedia({
      entity_id:
        props.entityId ||
        (props.entityIds && props.entityIds[0]) ||
        (record && record.id),
      entity_type: resource,
      media: formattedFiles[0].rawFile,
      title: formattedFiles[0].title,
      meta: meta,
      record: record,
    });
    // }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept,
    maxSize,
    minSize,
    multiple,
    onDrop,
  });

  return (
    <div className={classes.root}>
      {files.length === 0 && (
        <div
          data-testid="dropzone"
          className={classes.dropZone}
          {...getRootProps()}
        >
          <input
            {...getInputProps({
              ...props,
            })}
          />
          {props.placeholder}
        </div>
      )}

      {files &&
        files.map((item) =>
          item ? (
            <div className={classes.fileItem}>
              <DeleteOutline
                className={classes.deleteIcon}
                onClick={removeMedia(item.id)}
              />
              <a href={item.link} target="_blank" rel="noopener noreferrer">
                {item.title}
              </a>
            </div>
          ) : null
        )}
    </div>
  );
};

export default FileUploader;
