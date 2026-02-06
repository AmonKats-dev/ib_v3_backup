import { useNotify, useRefresh, useMutation } from "react-admin";
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

const IntegrationFileUploader = ({
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
  noRefresh,
  params = {},
  ...props
}) => {
  const [files, setFiles] = useState([]);
  const [media, setMedia] = useState(null);
  const classes = useStyles(props);
  const notify = useNotify();

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

  const [mutate, { loading }] = useMutation();

  const uploadMedia = () => {
    mutate(
      {
        type: "integrationsUpload",
        resource,
        payload: {
          data: media,
        },
      },
      {
        onSuccess: (response) => {
          notify("File uploaded!");
          if (props.onFileUpload) {
            props.onFileUpload(response.data);
          }
        },
        onFailure: (error) => {
          notify(`Error on file uploading! ${error.message}`, "warning");
          setFiles([]);
          setMedia(null);

          if (props.onError) {
            props.onError();
          }
        },
      }
    );
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
      entity_id: props.entityId || (record && record.id),
      entity_type: resource,
      media: formattedFiles[0].rawFile,
      title: formattedFiles[0].title,
      meta: meta,
      record: record,
      ...params,
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
              <a href={item.link} target="_blank" rel="noopener noreferrer">
                {item.title}
              </a>
            </div>
          ) : null
        )}
    </div>
  );
};

export default IntegrationFileUploader;
