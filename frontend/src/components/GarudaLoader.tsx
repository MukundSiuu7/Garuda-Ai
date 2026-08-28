interface GarudaLoaderProps {
  label?: string;
}

function GarudaLoader({ label = "Loading Garuda-AI" }: GarudaLoaderProps) {
  return (
    <div className="garuda-loader" role="status" aria-live="polite">
      <div className="garuda-loader-orbit">
        <span className="garuda-loader-ring" />
        <img src="/garuda(512).svg" alt="" className="garuda-loader-logo" />
      </div>
      <strong>{label}</strong>
      <span className="garuda-loader-progress" />
    </div>
  );
}

export default GarudaLoader;
