import { useState } from 'react';
import { localImageUrl } from '../services/images';

export function ImagePick({
  label,
  onPick,
  quiet = false,
}: {
  label: string;
  onPick: (url: string) => void;
  quiet?: boolean;
}) {
  const [note, setNote] = useState<string | null>(null);

  return (
    <div className="image-pick">
      <label className="btn btn-ghost file-btn">
        {label}
        <input
          className="file-input"
          type="file"
          accept="image/*"
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = '';
            if (!file) return;
            if (!file.type.startsWith('image/')) {
              setNote('Pick an image file.');
              return;
            }
            if (file.size > 8_000_000) {
              setNote('That image is too big for this demo. Pick one under 8 MB.');
              return;
            }
            setNote(null);
            onPick(localImageUrl(file));
          }}
        />
      </label>
      {quiet ? null : <p className="micro">Your image stays on your device in demo mode.</p>}
      {note ? (
        <p className="alert" role="alert">
          {note}
        </p>
      ) : null}
    </div>
  );
}

export function LocalPreview({ src, alt, round = false }: { src: string; alt: string; round?: boolean }) {
  return <img className={round ? 'upload-preview round' : 'upload-preview'} src={src} alt={alt} />;
}
