/* -------------------------------------------------------------------------- */
/*  Lines — renders string[] as <br/>-separated text                           */
/*  One array = one editable field (see InvitationData), so multiline copy      */
/*  stays a single data unit instead of hardcoded JSX line breaks.             */
/* -------------------------------------------------------------------------- */

import { Fragment } from "react";

export function Lines({ lines }: { lines: string[] }) {
  return (
    <>
      {lines.map((line, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {line}
        </Fragment>
      ))}
    </>
  );
}
