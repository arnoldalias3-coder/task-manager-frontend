function LoadingSpinner({ text }) {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      <p>{text}</p>
    </div>
  );
}

export default LoadingSpinner;