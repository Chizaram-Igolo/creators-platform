export default function Toast({ heading, body }) {
  return (
    <>
      {heading && <strong style={{ fontSize: "1.1em" }}>{heading}</strong>}
      <div style={{ fontSize: "1.1em" }}>{body}</div>
    </>
  );
}
