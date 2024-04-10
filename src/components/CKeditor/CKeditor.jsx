import React, { useState,useRef } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import Link from '@ckeditor/ckeditor5-link/src/link'; // Import the Link plugin
// import AutoLink from '@ckeditor/ckeditor5-link/src/autolink'; 
// import FileRepository from '@ckeditor/ckeditor5-upload/src/filerepository';



const CKeditor=({value,onChange,picture,setNewForum})=>{
    const [editorData, setEditorData] = useState('');
    const [uploadedPicture, setUploadedPicture] = useState('');
    const editorRef = useRef();
    

    function toBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    function UploadAdapter(loader) {    
            return {
                upload: () => {
                    return new Promise(async (resolve, reject) => {
                        const file = await loader.file;
                        const base64 = await toBase64(file);
                        setUploadedPicture(base64);
                        // picture(base64);
                        setNewForum((prevForum) => ({ ...prevForum, picture: base64 }));
                        const body = new FormData();
                        loader.file.then((file) => {
                            body.append('picture', base64);
                            const formDataObject = {};
                            for (let pair of body.entries()) {
                                const key = pair[0];
                                const value = pair[1];
    
    
                                formDataObject[key] = value;
                                console.log("FORMDATAOBJECT:", formDataObject)
                            }
    
                        })
                    })
                }
            }
        }

    function UploadPlugin(editor) {
        editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
            return UploadAdapter(loader);
        };
    }

    const handleReady = editor => {
        console.log('Editor is ready to use!', editor);
        editorRef.current = editor; 
    };

    const handleChange = (event, editor) => {
        let htmlValue = editor.getData(); // Get the HTML content with styles

        // Log the HTML content with styles
        // console.log("HTML value", htmlValue);
        htmlValue = htmlValue.replace(/<a href=/g, '<a style="text-decoration: underline;" href=');
      
        setEditorData(htmlValue);
        onChange(htmlValue);
    };
    return (
        <div className="App">
            <CKEditor
                editor={ClassicEditor}
                config={{
                    extraPlugins: [UploadPlugin],
                    // plugins: [ Link,AutoLink,FileRepository],
                    // toolbar: [ 'link', /* ... */ ],
                }}
                value=""
                onReady={handleReady}
                onChange={handleChange}
            />
        </div>
    );
}


export default CKeditor