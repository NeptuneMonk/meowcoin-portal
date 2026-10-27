import coin from '../assets/coin.webp';

/** Meowecoin token mark from meoweco.in. Decorative. */
export function SpinningCoin() {
  return (
    <div className="coin-stage" aria-hidden="true">
      <div className="coin-rotor">
        <img className="coin-face" src={coin} alt="" width={480} height={480} />
        <img className="coin-face coin-face-back" src={coin} alt="" width={480} height={480} />
      </div>
    </div>
  );
}
