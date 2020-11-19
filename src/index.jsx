import React from 'react';
import ReactDOM from 'react-dom';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
const ffmpeg = createFFmpeg({ log: true });
import "./style.css";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);


if (import.meta.hot) {
  import.meta.hot.accept();
}

function App() {
  const [video, setvideo] = React.useState(null);
  const [ready, setReady] = React.useState(null);

  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  };

  React.useEffect(() => {
    load();
  }, []);

  return ready ? (
    <main className="container">
      <h1>Video -> Gif using Web Assembly</h1>
      <input
        type="file"
        id="upload-file"
        name="upload-file"
        onChange={(e) => {
          setvideo(e.target.files[0]);
          debugger;
        }}
      />
      {video && <LoadVideo src={video} />}
    </main>
  ) : (
    <p>Please wait loading resources</p>
  );
}

function LoadVideo({ src }) {
  const [gif, setGif] = React.useState(null);

  const handleGifConverter = async (_) => {
    ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(src));
    await ffmpeg.run(
      '-i',
      'test.mp4',
      '-t',
      '2.5',
      '-ss',
      '2.0',
      '-f',
      'gif',
      'out.gif',
    );
    const data = await ffmpeg.FS('readFile', 'out.gif');
    const url = URL.createObjectURL(
      new Blob([data.buffer], { type: 'image/gif' }),
    );
    setGif(url);
  };

  return (
    <>
      <video
        width="300"
        height="300"
        src={URL.createObjectURL(src)}
        autoPlay
      ></video>
      <button onClick={handleGifConverter}>Convert to gif</button>
      <br />
      {gif && <img src={gif}></img>}
    </>
  );
}
