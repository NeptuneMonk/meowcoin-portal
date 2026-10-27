import { useEffect, useMemo, useState } from 'react';
import { formatBytes } from '../format';
import { fileKind, kindLabel, packAppHtml } from '../services/objects';
import type { Item, ObjectFile } from '../services/types';

export function ObjectViewer({ item }: { item: Item }) {
  const images = item.files.filter((file) => fileKind(file.name, file.mime) === 'image' && file.localUrl);
  const [imageName, setImageName] = useState(item.mainFileName);
  const main = item.files.find((file) => file.name === item.mainFileName) ?? item.files[0];
  const shownImage =
    images.find((file) => file.name === imageName) ??
    images.find((file) => file.name === item.mainFileName) ??
    images[0];

  if (item.kind === 'image' && shownImage?.localUrl) {
    return (
      <div className="media-frame">
        <img src={shownImage.localUrl} alt="" />
        {images.length > 1 ? (
          <div className="gallery" role="list">
            {images.map((file) => (
              <button
                key={file.name}
                type="button"
                className={file.name === shownImage.name ? 'on' : ''}
                onClick={() => setImageName(file.name)}
              >
                <img src={file.localUrl ?? ''} alt="" />
                <span className="sr-only">{file.name}</span>
              </button>
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  if (item.kind === 'video' && main?.localUrl) {
    return (
      <div className="media-frame">
        <video controls src={main.localUrl} />
      </div>
    );
  }

  if (item.kind === 'audio' && main?.localUrl) {
    return (
      <div className="media-frame">
        <audio controls src={main.localUrl} />
      </div>
    );
  }

  if (item.kind === 'pdf' && main?.localUrl) {
    return (
      <iframe className="pdf-frame" title={item.name} src={main.localUrl} />
    );
  }

  if (item.kind === 'app') {
    return <AppLaunch item={item} />;
  }

  if (main?.localUrl) {
    return (
      <p>
        <a className="btn btn-ghost" href={main.localUrl} download={baseName(main.name)}>
          Download {baseName(main.name)}
        </a>
      </p>
    );
  }

  return null;
}

function AppLaunch({ item }: { item: Item }) {
  const packed = useMemo(() => packAppHtml(item.files, item.mainFileName), [item]);
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (src) URL.revokeObjectURL(src);
    };
  }, [src]);

  if (!packed) {
    return <p className="micro">This demo could not pack that app for a preview.</p>;
  }

  return (
    <div className="media-frame">
      {src ? (
        <iframe
          className="app-frame"
          title={item.name}
          sandbox="allow-scripts"
          referrerPolicy="no-referrer"
          src={src}
        />
      ) : (
        <button
          className="btn btn-primary"
          type="button"
          onClick={() => {
            const blob = new Blob([packed], { type: 'text/html' });
            setSrc(URL.createObjectURL(blob));
          }}
        >
          Launch
        </button>
      )}
    </div>
  );
}

export function FileList({ files, mainFileName }: { files: readonly ObjectFile[]; mainFileName: string }) {
  if (files.length === 0) return null;
  return (
    <ul className="file-list">
      {files.map((file) => {
        const kind = fileKind(file.name, file.mime);
        return (
          <li key={file.name}>
            <span className={`type-icon type-${kind}`} aria-hidden="true">
              {kindLabel(kind).slice(0, 3).toUpperCase()}
            </span>
            <span className="file-name">
              {file.name}
              {file.name === mainFileName ? <small> Main</small> : null}
            </span>
            <span className="file-size">{formatBytes(file.size)}</span>
            {file.localUrl ? (
              <a href={file.localUrl} download={baseName(file.name)}>
                Save
              </a>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

function baseName(name: string): string {
  return name.split(/[/\\]/).pop() ?? name;
}
