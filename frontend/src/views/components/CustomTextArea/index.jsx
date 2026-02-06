import React from "react";
import lodash from "lodash";
import CKEditor from "@ckeditor/ckeditor5-react";
import { addField, Labeled, useTranslate, useInput } from "react-admin";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { API_URL } from "../../../constants/config";
import { TOKEN } from "../../../constants/auth";
import { makeStyles, ThemeProvider, useTheme } from "@material-ui/core/styles";
import clsx from "clsx";
import { useFormState } from "react-final-form";

const convertToMultiPart = (item) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(item);

    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

class UploadAdapter {
  constructor(loader, source) {
    this.loader = loader;
    this.source = source;
  }

  upload() {
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          this._initRequest();
          this._initListeners(resolve, reject, file);
          this._sendRequest(file);
        })
    );
  }

  abort() {
    if (this.xhr) {
      this.xhr.abort();
    }
  }

  // Initializes the XMLHttpRequest object using the URL passed to the constructor.
  _initRequest() {
    const xhr = (this.xhr = new XMLHttpRequest());

    xhr.open("POST", `${API_URL}/media`, true);
    xhr.responseType = "json";
    xhr.setRequestHeader(
      "Authorization",
      `Bearer ${localStorage.getItem(TOKEN)}`
    );
  }

  // Initializes XMLHttpRequest listeners.
  _initListeners(resolve, reject, file) {
    const xhr = this.xhr;
    const loader = this.loader;
    const genericErrorText = `Couldn't upload file: ${file.name}.`;

    xhr.addEventListener("error", () => reject(genericErrorText));
    xhr.addEventListener("abort", () => reject());
    xhr.addEventListener("load", () => {
      const response = xhr.response;

      if (!response || response.error) {
        return reject(
          response && response.error ? response.error.message : genericErrorText
        );
      }

      resolve({
        default: response.link,
      });
    });

    if (xhr.upload) {
      xhr.upload.addEventListener("progress", (evt) => {
        if (evt.lengthComputable) {
          loader.uploadTotal = evt.total;
          loader.uploaded = evt.loaded;
        }
      });
    }
  }

  // Prepares the data and sends the request.
  _sendRequest(file) {
    convertToMultiPart(file).then((converted) => {
      this.xhr.send(
        JSON.stringify({
          media: converted,
          title: file.name,
          entity_id: 77,
          entity_type: "editor",
          related_field: this.source,
          file_type: "image",
          meta: { editor_field: this.source },
        })
      );
    });
  }
}

const useStyles = makeStyles((theme) => ({
  error: {
    "& .ck-editor": {
      borderRadius: 5,
      border: "1px solid #e53935",
    },
  },
}));

const CustomTextArea = (props) => {
  const { values } = useFormState();
  const {
    input: { name, onChange, ...rest },
    meta: { touched, error },
    isRequired,
  } = useInput(props);
  const translate = useTranslate();
  const classes = useStyles();
  const hasError = touched && error;
  const label = props.isRequired ? `${props.label} *` : props.label;

  function CustomUploadAdapterPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return new UploadAdapter(loader, props.source);
    };
  }

  return (
    <div
      className={clsx("aor-ckeditor-input", {
        [classes.error]: hasError,
      })}
    >
      {props.label && <Labeled label={label} />}
      <CKEditor
        editor={ClassicEditor}
        config={{
          allowedContent: true,
          extraPlugins: [CustomUploadAdapterPlugin],
        }}
        data={lodash.get(values, props.source) || false}
        onChange={(event, editor) => {
          if (!editor.getData()) {
            onChange(null);
          } else {
            onChange(editor.getData());
          }
        }}
        onBlur={(event, editor) => {
          if (!editor.getData()) {
            onChange(null);
          } else {
            onChange(editor.getData());
          }
        }}
        {...props}
      />
      {touched && error && (
        <div style={{ color: "#e53935", paddingLeft: 10, fontSize: 11 }}>
          {translate(error)}
        </div>
      )}
    </div>
  );
};

CustomTextArea.defaultProps = {
  addField: true,
};

export default CustomTextArea;
// export default addField(CustomTextArea);
