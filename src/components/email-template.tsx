import * as React from "react";

interface EmailTemplateProps {
  code: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  code,
}) => (
  <div>
    <p>Your verification code is {code}</p>
  </div>
);
