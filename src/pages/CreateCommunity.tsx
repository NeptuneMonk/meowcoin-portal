import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ScreenHead } from '../components/AppShell';
import { FeeSplit } from '../components/FeeSplit';
import { ComingSoon, Forging, useSimulatedSubmit } from '../components/RecordFlow';
import { formatMeowe, formatUsd } from '../format';
import { COMMUNITY_QUOTE } from '../services/pricing';
import { usePageTitle } from '../usePageTitle';

export function CreateCommunity() {
  usePageTitle('Create community — The Forge');
  const flow = useSimulatedSubmit();
  const [name, setName] = useState('');
  const [topic, setTopic] = useState('');
  const ready = name.trim().length >= 2;

  return (
    <div className="fill pad">
      <ScreenHead title="Create community" backTo="/communities" backLabel="Communities" />
      {flow.step === 'edit' ? (
        <form
          className="card flow"
          onSubmit={(event) => {
            event.preventDefault();
            if (ready) flow.setStep('quote');
          }}
        >
          <label className="field">
            <span>Name</span>
            <input
              value={name}
              maxLength={32}
              required
              onChange={(event) => setName(event.target.value)}
            />
          </label>
          <label className="field">
            <span>What is it about?</span>
            <textarea
              value={topic}
              maxLength={140}
              rows={3}
              onChange={(event) => setTopic(event.target.value)}
            />
          </label>
          <p className="micro">A new community starts with one text channel, #general.</p>
          <button className="btn btn-primary btn-block" type="submit" disabled={!ready}>
            See the price
          </button>
        </form>
      ) : null}

      {flow.step === 'quote' ? (
        <div className="flow">
          <h2>{name.trim()}</h2>
          {topic.trim() ? <p>{topic.trim()}</p> : null}
          <p className="price-xl">{formatUsd(COMMUNITY_QUOTE.usd)}</p>
          <p>{formatMeowe(COMMUNITY_QUOTE.meowe)} MEOWE</p>
          <FeeSplit
            quote={COMMUNITY_QUOTE}
            heading={`On this community · ${formatUsd(COMMUNITY_QUOTE.usd)}`}
          />
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
              onClick={() =>
                void flow.submit({
                  action: 'community',
                  name: name.trim(),
                  topic: topic.trim(),
                  quote: COMMUNITY_QUOTE,
                })
              }
            >
              Create it (demo)
            </button>
          </div>
        </div>
      ) : null}

      {flow.step === 'forging' ? <Forging phase={flow.phase} /> : null}

      {flow.step === 'done' && flow.receipt ? (
        <ComingSoon>
          <Link className="btn btn-primary" to={`/c/${flow.receipt.entityId}`}>
            Open {name.trim()}
          </Link>
        </ComingSoon>
      ) : null}
    </div>
  );
}
