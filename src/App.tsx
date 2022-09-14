import { ChangeEvent, FormEvent, useState } from 'react';
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import reactLogo from './assets/react.svg';
import './App.css';

const { VITE_APP_ACCESSKEYID, VITE_APP_SECRETACCESSKEY, VITE_APP_ENDPOINT, VITE_APP_REGION, VITE_APP_BUCKET } = import.meta.env;

console.log(VITE_APP_ACCESSKEYID, VITE_APP_SECRETACCESSKEY, VITE_APP_ENDPOINT, VITE_APP_REGION, VITE_APP_BUCKET)

function App() {
    const [file, setFile] = useState<File>();
    /* const [imagePreviewUrl, setImagePreviewUrl] = useState<string | ArrayBuffer | null | undefined>(); */

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        setFile(e.target.files[0]);
    }
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file) {
            alert("please select a file");
            return;
        }

        const upload = new Upload({
            client: new S3Client({
                region: VITE_APP_REGION,
                credentials: {
                    accessKeyId: VITE_APP_ACCESSKEYID,
                    secretAccessKey: VITE_APP_SECRETACCESSKEY
                },
                endpoint: VITE_APP_ENDPOINT,
            }),
            leavePartsOnError: false,
            params: {
                Bucket: VITE_APP_BUCKET,
                Key: `najish/test/${file.name}`,
                Body: file,
                ACL: "public-read"
            }
        })
        upload.on("httpUploadProgress", (progress) => {
            console.log(progress);
            if (progress.loaded !== undefined && progress.total !== undefined) {
                console.log(100 * progress.loaded / progress.total);
            }
        });
        const data = await upload.done();

        console.log(data);
    }
    /* useEffect(() => {
    const reader = new FileReader();

    reader.onloadend = () => {
        setImagePreviewUrl(reader.result);
    };

    reader.readAsDataURL(file!);
}, [file]) */
    return (
        <form className="App" onSubmit={handleSubmit}>
            <img style={{ height: "150px", paddingBottom: "30px" }} src={reactLogo} alt="logo" />
            <h1>Linode file upload | React</h1>
            <section>
                <input type="file" onChange={handleChange} accept="image/*" />
                <button type="submit">Upload</button>
            </section>
            {/* {file && <img src={imagePreviewUrl as string} alt="preview" />} */}
        </form>
    )
}

export default App
