import { useRef, useState, type DragEvent } from 'react';
import { Link } from 'react-router-dom';
import { ScreenHead } from '../components/AppShell';
import { FeeSplit } from '../components/FeeSplit';
import { FileList, ObjectViewer } from '../components/ObjectViewer';
import { ComingSoon, Forging, useSimulatedSubmit } from '../components/RecordFlow';
import { formatBytes, formatMeowe, formatUsd } from '../format';
import { MINT_QUOTE } from '../services/pricing';
import {
  fileKind,
  isIndexHtml,
  isTextBundleFile,
  kindLabel,
  mimeForName,
  objectKind,
} from '../services/objects';
import type { Item, ObjectKind } from '../services/types';
import { usePageTitle } from '../usePageTitle';

interface PickedFile {
  name: string;
  mime: string;
  size: number;
  localUrl: string;
  text: string | null;
}

export function MintPage() {
  usePageTitle('Mint an item — The Forge');
  const flow = useSimulatedSubmit();
  const folderRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<PickedFile[]>([]);
  const [mainFileName, setMainFileName] = useState('');
  const [over, setOver] = useState(false);
  const [name, setName] = useState('');
  const [blurb, setBlurb] = useState('');
  const [urn, setUrn] = useState('');
  const [license, setLicense] = useState('');
  const [max, setMax] = useState('1');
  const [royalty, setRoyalty] = useState('');
  const [attrKey, setAttrKey] = useState('');
  const [attrValue, setAttrValue] = useState('');
  const [attributes, setAttributes] = useState<Record<string, string>>({});

  const kind: ObjectKind = objectKind(files, mainFileName);
  const ready = files.length > 0 && name.trim().length >= 2 && Boolean(mainFileName);
  const draft = ready ? draftItem() : null;

  async function addFiles(list: File[], relativeNames?: string[]) {
    const picked = await Promise.all(
      list.map(async (file, index) => {
        const name = tidyPath(relativeNames?.[index] || file.webkitRelativePath || file.name);
        const mime = file.type || mimeForName(name);
        const text =
          isTextBundleFile(name) && file.size <= 1_000_000 ? await file.text() : null;
        return {
          name,
          mime,
          size: file.size,
          localUrl: URL.createObjectURL(file),
          text,
        } satisfies PickedFile;
      }),
    );
    setFiles((current) => {
      const next = [...current];
      for (const file of picked) {
        const at = next.findIndex((entry) => entry.name === file.name);
        if (at >= 0) {
          URL.revokeObjectURL(next[at].localUrl);
          next[at] = file;
        } else {
          next.push(file);
        }
      }
      const index = next.find((file) => isIndexHtml(file.name));
      setMainFileName((currentMain) =>
        next.some((file) => file.name === currentMain)
          ? currentMain
          : (index?.name ?? next[0]?.name ?? ''),
      );
      return next;
    });
  }

  async function onDrop(event: DragEvent) {
    event.preventDefault();
    setOver(false);
    const dropped = await filesFromDrop(event.dataTransfer);
    if (dropped.length > 0) await addFiles(dropped.map((entry) => entry.file), dropped.map((entry) => entry.name));
  }

  function removeFile(nameToRemove: string) {
    setFiles((current) => {
      const gone = current.find((file) => file.name === nameToRemove);
      if (gone) URL.revokeObjectURL(gone.localUrl);
      const next = current.filter((file) => file.name !== nameToRemove);
      setMainFileName((currentMain) =>
        currentMain === nameToRemove ? (next.find((file) => isIndexHtml(file.name))?.name ?? next[0]?.name ?? '') : currentMain,
      );
      return next;
    });
  }

  function addAttribute() {
    const key = attrKey.trim();
    const value = attrValue.trim();
    if (!key || !value) return;
    setAttributes((current) => ({ ...current, [key]: value }));
    setAttrKey('');
    setAttrValue('');
  }

  function draftItem(): Item {
    const royaltyPercent = royalty.trim() === '' ? null : Number(royalty);
    const maxNumber = Number(max);
    return {
      id: 'draft',
      name: name.trim(),
      blurb: blurb.trim(),
      art: null,
      localImageUrl: null,
      creatorHandle: 'you',
      ownerHandle: 'you',
      previewMeowe: null,
      cid: 'pending',
      dogeTxid: 'pending',
      forgedHere: true,
      address: 'pending',
      urn: urn.trim() || 'Assigned when you mint',
      uri: null,
      img: null,
      attributes,
      license: license.trim() || null,
      max: Number.isFinite(maxNumber) ? maxNumber : 1,
      qty: 1,
      creators: ['you'],
      royalties: royaltyPercent && royaltyPercent > 0 ? { you: royaltyPercent } : {},
      mintedLabel: 'Not minted yet',
      kind,
      files: files.map((file) => ({ ...file, cid: 'pending' })),
      mainFileName,
    };
  }

  return (
    <div className="fill pad">
      <ScreenHead title="Mint an item" backTo="/store" backLabel="My store" />
      {flow.step === 'edit' ? (
        <form
          className="card flow"
          onSubmit={(event) => {
            event.preventDefault();
            if (ready) flow.setStep('quote');
          }}
        >
          <div
            className={over ? 'drop over' : 'drop'}
            onDragEnter={(event) => {
              event.preventDefault();
              setOver(true);
            }}
            onDragOver={(event) => {
              event.preventDefault();
              setOver(true);
            }}
            onDragLeave={() => setOver(false)}
            onDrop={(event) => void onDrop(event)}
          >
            <p>Drop files here, or choose them.</p>
            <div className="btn-row">
              <label className="btn btn-primary">
                Add files
                <input
                  className="sr-only"
                  type="file"
                  multiple
                  onChange={(event) => {
                    const list = [...(event.target.files ?? [])];
                    event.target.value = '';
                    if (list.length) void addFiles(list);
                  }}
                />
              </label>
              <button className="btn btn-ghost" type="button" onClick={() => folderRef.current?.click()}>
                Add a folder
              </button>
            </div>
            <input
              ref={(node) => {
                folderRef.current = node;
                node?.setAttribute('webkitdirectory', '');
              }}
              className="sr-only"
              type="file"
              multiple
              onChange={(event) => {
                const list = [...(event.target.files ?? [])];
                event.target.value = '';
                if (list.length) void addFiles(list);
              }}
            />
            <p className="micro">
              Images (including gif, webp, and svg), video (mp4, webm), audio (mp3, wav, ogg), PDF,
              an app folder with index.html, or any other file. Your files stay on your device in
              demo mode.
            </p>
          </div>

          {files.length > 0 ? (
            <>
              <p>
                Detected: <strong>{kindLabel(kind)}</strong>
              </p>
              <fieldset className="file-pick">
                <legend>Main file</legend>
                {files.map((file) => (
                  <label key={file.name} className="file-choice">
                    <input
                      type="radio"
                      name="main"
                      checked={file.name === mainFileName}
                      onChange={() => setMainFileName(file.name)}
                    />
                    <span>
                      {file.name} · {kindLabel(fileKind(file.name, file.mime))} · {formatBytes(file.size)}
                    </span>
                    <button type="button" onClick={() => removeFile(file.name)}>
                      Remove
                    </button>
                  </label>
                ))}
              </fieldset>
              {draft ? (
                <>
                  <ObjectViewer item={draft} />
                  <FileList files={draft.files} mainFileName={draft.mainFileName} />
                </>
              ) : null}
            </>
          ) : null}

          <label className="field">
            <span>Name</span>
            <input value={name} maxLength={60} required onChange={(event) => setName(event.target.value)} />
          </label>
          <label className="field">
            <span>URN</span>
            <input
              value={urn}
              maxLength={180}
              placeholder="Leave blank to use the main file"
              onChange={(event) => setUrn(event.target.value)}
            />
          </label>
          <label className="field">
            <span>Description</span>
            <textarea
              value={blurb}
              maxLength={500}
              rows={3}
              onChange={(event) => setBlurb(event.target.value)}
            />
          </label>
          <label className="field">
            <span>License</span>
            <input value={license} maxLength={40} onChange={(event) => setLicense(event.target.value)} />
          </label>
          <label className="field">
            <span>Maximum quantity</span>
            <input
              value={max}
              inputMode="numeric"
              onChange={(event) => setMax(event.target.value.replace(/[^\d]/g, ''))}
            />
          </label>
          <label className="field">
            <span>Your royalty percent</span>
            <input
              value={royalty}
              inputMode="decimal"
              placeholder="Optional"
              onChange={(event) => setRoyalty(event.target.value.replace(/[^\d.]/g, ''))}
            />
          </label>
          <div className="field">
            <span>Attribute</span>
            <div className="attr-add">
              <input
                value={attrKey}
                placeholder="Name"
                maxLength={40}
                onChange={(event) => setAttrKey(event.target.value)}
              />
              <input
                value={attrValue}
                placeholder="Value"
                maxLength={80}
                onChange={(event) => setAttrValue(event.target.value)}
              />
              <button className="btn btn-ghost" type="button" onClick={addAttribute}>
                Add
              </button>
            </div>
            {Object.entries(attributes).map(([key, value]) => (
              <p key={key} className="micro">
                {key}: {value}{' '}
                <button
                  type="button"
                  onClick={() =>
                    setAttributes((current) => {
                      const next = { ...current };
                      delete next[key];
                      return next;
                    })
                  }
                >
                  Remove
                </button>
              </p>
            ))}
          </div>
          <button className="btn btn-primary btn-block" type="submit" disabled={!ready}>
            See the price
          </button>
        </form>
      ) : null}

      {flow.step === 'quote' && draft ? (
        <div className="card flow">
          <ObjectViewer item={draft} />
          <h2>{draft.name}</h2>
          {draft.blurb ? <p>{draft.blurb}</p> : null}
          <p className="micro">
            {kindLabel(draft.kind)} · {draft.files.length} file{draft.files.length === 1 ? '' : 's'} · main{' '}
            {draft.mainFileName}
          </p>
          <p className="micro">Your files stay on your device in demo mode.</p>
          <p className="price-xl">{formatUsd(MINT_QUOTE.usd)}</p>
          <p>{formatMeowe(MINT_QUOTE.meowe)} MEOWE</p>
          <FeeSplit quote={MINT_QUOTE} heading={`On this item · ${formatUsd(MINT_QUOTE.usd)}`} />
          {flow.error ? (
            <p className="alert" role="alert">
              {flow.error}
            </p>
          ) : null}
          <div className="btn-row">
            <button className="btn btn-ghost" type="button" onClick={() => flow.setStep('edit')}>
              Back
            </button>
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => {
                const royaltyPercent = royalty.trim() === '' ? null : Number(royalty);
                const maxNumber = Number(max);
                void flow.submit({
                  action: 'mint',
                  name: name.trim(),
                  blurb: blurb.trim(),
                  urn: urn.trim(),
                  uri: null,
                  license: license.trim() || null,
                  max: Number.isFinite(maxNumber) ? maxNumber : 1,
                  attributes,
                  royaltyPercent:
                    royaltyPercent !== null && Number.isFinite(royaltyPercent) ? royaltyPercent : null,
                  mainFileName,
                  files,
                  quote: MINT_QUOTE,
                });
              }}
            >
              Mint it (demo)
            </button>
          </div>
        </div>
      ) : null}

      {flow.step === 'forging' ? <Forging phase={flow.phase} /> : null}

      {flow.step === 'done' && flow.receipt ? (
        <ComingSoon>
          <Link className="btn btn-primary" to={`/item/${flow.receipt.entityId}`}>
            See the item
          </Link>
          <Link className="btn btn-ghost" to="/store">
            Back to my store
          </Link>
        </ComingSoon>
      ) : null}
    </div>
  );
}

function tidyPath(path: string): string {
  const parts = path.split(/[/\\]/).filter(Boolean);
  if (parts.length > 1) return parts.slice(1).join('/');
  return parts[0] ?? path;
}

async function filesFromDrop(data: DataTransfer): Promise<{ file: File; name: string }[]> {
  const entries = [...data.items]
    .map((item) => item.webkitGetAsEntry?.() ?? null)
    .filter((entry): entry is FileSystemEntry => Boolean(entry));
  if (entries.length === 0) {
    return [...data.files].map((file) => ({ file, name: file.name }));
  }
  const found: { file: File; name: string }[] = [];
  for (const entry of entries) {
    found.push(...(await readEntry(entry, '')));
  }
  return found;
}

async function readEntry(entry: FileSystemEntry, prefix: string): Promise<{ file: File; name: string }[]> {
  if (entry.isFile) {
    const file = await new Promise<File>((resolve, reject) => {
      (entry as FileSystemFileEntry).file(resolve, reject);
    });
    const relative = prefix ? `${prefix}${file.name}` : file.name;
    return [{ file, name: relative }];
  }
  if (!entry.isDirectory) return [];
  const reader = (entry as FileSystemDirectoryEntry).createReader();
  const children: FileSystemEntry[] = [];
  let batch: FileSystemEntry[] = [];
  do {
    batch = await new Promise((resolve, reject) => reader.readEntries(resolve, reject));
    children.push(...batch);
  } while (batch.length > 0);
  const nested = await Promise.all(
    children.map((child) => readEntry(child, `${prefix}${entry.name}/`)),
  );
  return nested.flat();
}
