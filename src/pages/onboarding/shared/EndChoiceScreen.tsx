import { useNavigate } from "react-router-dom";
import { SCORES, NORTHGATE } from "./northgate-mock";

type Props = {
  demoName: string;
  vaultView: React.ReactNode; // demo-specific knowledge bank preview
  onEnterVault: () => void;
};

export function EndChoiceScreen({ demoName, vaultView, onEnterVault }: Props) {
  const nav = useNavigate();
  return (
    <div className="ob-finale">
      <div className="label">DAY 1 COMPLETE · {demoName.toUpperCase()}</div>
      <div className="num">{SCORES.gestalt.toFixed(1)}</div>
      <div className="label">GESTALT SCORE</div>
      <h2>{NORTHGATE.company} · your knowledge bank is live.</h2>
      <p>
        Gold = confirmed value. Red = blind spots costing you exit value. You created
        a permanent intelligence record. Tomorrow we turn red into gold.
      </p>
      <div style={{ width: "100%", maxWidth: 880, margin: "16px auto 0" }}>{vaultView}</div>
      <div className="choice">
        <button className="primary" onClick={onEnterVault}>ENTER VAULT</button>
        <button className="ghost" onClick={() => nav("/client/1")}>GO TO DASHBOARD</button>
      </div>
    </div>
  );
}
