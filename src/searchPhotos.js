import * as React from "react";
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
import TextContent from "@cloudscape-design/components/text-content";
import Cards from "@cloudscape-design/components/cards";
import Box from "@cloudscape-design/components/box";

import logoS3 from './logoS3.png';
import logoCF from './logoCloudFront.png';

import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";


export default function SearchPhotos() {
    const [query, setQuery] = React.useState("");
    const { transcript, resetTranscript } = useSpeechRecognition();
    const [items, setItems] = React.useState([]);

    function startRecording() {
        resetTranscript();
        SpeechRecognition.startListening({
            continuous: true,
        });
    }
    function stopRecording() {
        SpeechRecognition.stopListening();
        setQuery(transcript);
        resetTranscript();
    }

    function sendRequest() {
        setItems([]);
        // send requests to backend
        var url = "https://aqc18ezxgh.execute-api.us-east-1.amazonaws.com/GET_OK/search?q=";
        url += query;
        console.log("sending requests to", url);
        const requestOptions = {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        };
        fetch(url, requestOptions)
            .then((response) => {
                return response.json();
            })
            .then((json_response)=>{
                var all_photos = [];
                console.log(Object.keys(json_response), json_response['list']);
                for(var i = 0; i < json_response['list'].length; ++i){
                    all_photos.push({
                        name: "",
                        description: json_response['list'][i],
                    });
                }
                setItems(all_photos)
                console.log(all_photos, items);
            });
    };

    return (
        <SpaceBetween size='m'>
            <TextContent>
                <p>
                    <strong>Please enter your search query, or use the button below to transcribe from voice</strong>
                </p>
            </TextContent>
            <Input
                onChange={({ detail }) => setQuery(detail.value)}
                value={query}
                placeholder="Please enter your search query"
                type="search"
            />
            <SpaceBetween size="m" direction="horizontal">
                <Button onClick={startRecording}>Start Recording</Button>
                <Button onClick={stopRecording}>Stop Recording</Button>
            </SpaceBetween>
            <Button variant="primary" onClick={sendRequest}>Submit Search Query</Button>
            <TextContent>
                <p>
                    <strong>Search Results are displayed below</strong>
                </p>
            </TextContent>
            <Cards
                cardDefinition={{
                    header: item => (item.name),
                    sections: [
                    {
                        id: "description",
                        content: item => (<img src={item.description} width="100" height="100"/>)
                    },
                    ]
                }}
                cardsPerRow={[
                    { cards: 1 },
                    { minWidth: 500, cards: 2 }
                ]}
                items={items}
                loadingText="Loading photos"
                empty={
                    <Box
                    margin={{ vertical: "xs" }}
                    textAlign="center"
                    color="inherit"
                    >
                    <SpaceBetween size="m">
                        <b>No Photos Found</b>
                    </SpaceBetween>
                    </Box>
                }
            />
        </SpaceBetween>
    );
}