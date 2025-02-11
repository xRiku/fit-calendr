import * as React from "react";

interface EmailTemplateProps {
  code: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  code,
}) => (
  <div>
    <h2>Your code is {code}</h2>
  </div>
);
