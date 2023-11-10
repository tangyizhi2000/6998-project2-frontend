import React, { useState } from 'react';
import axios from 'axios';
import ContentLayout from "@cloudscape-design/components/content-layout";
import Container from "@cloudscape-design/components/container";
import Header from "@cloudscape-design/components/header";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Link from "@cloudscape-design/components/link";
import Button from "@cloudscape-design/components/button";
import Alert from "@cloudscape-design/components/alert";
import FileUpload from "@cloudscape-design/components/file-upload";
import FormField from "@cloudscape-design/components/form-field";
import AttributeEditor from "@cloudscape-design/components/attribute-editor";
import Input from "@cloudscape-design/components/input";
import Tabs from "@cloudscape-design/components/tabs";
import AttributeEditorExample from "./ChangableAttributeEditor";

export default function UploadPhotos() {

    const [photo, setPhoto] = React.useState([]);

    const [items, setItems] = useState([
      { label: '',},
    ]);

    function handleSubmit(event) {
      event.preventDefault()
      var url = 'https://aqc18ezxgh.execute-api.us-east-1.amazonaws.com/GET_OK/b2-photos/';
      url = url + photo[0].name;
      var labels = "";
      for(var i = 0; i < items.length; ++i){
        if(items[i].key != ""){
          labels = labels + items[i].key + ",";
        }
      }
      if(labels[labels.length-1] == ','){
        labels = labels.substring(0,labels.length-1);
      }
      const config = {
        headers: {
          'content-type': 'image/png',
          'x-amz-meta-customLabels': labels,
        },
      };
      console.log("sending request to", url, "with labels:", labels);
      axios.put(url, photo[0], config).then((response) => {
        console.log(response.data);
      });
    }

    return (
        <SpaceBetween size='m'>
            <FormField
              label="Upload photos"
              description="Please upload photos, and don't forget to add one or more labels for this photo"
            >
              <FileUpload
                onChange={({ detail }) => setPhoto(detail.value)}
                value={photo}
                i18nStrings={{
                  uploadButtonText: e =>
                    e ? "Choose files" : "Choose photo",
                  dropzoneText: e =>
                    e
                      ? "Drop files to upload"
                      : "Drop file to upload",
                  removeFileAriaLabel: e =>
                    `Remove file ${e + 1}`,
                  limitShowFewer: "Show fewer files",
                  limitShowMore: "Show more files",
                  errorIconAriaLabel: "Error"
                }}
                showFileLastModified
                showFileSize
                showFileThumbnail
                tokenLimit={3}
                constraintText={
                  <React.Fragment>
                    Please upload photos only
                  </React.Fragment>
                }
              />
            </FormField>
            <AttributeEditorExample items={items} setItems={setItems}/>
            <Button variant="primary" onClick={handleSubmit}>Submit Photos and Labels</Button>
        </SpaceBetween>
    );
}