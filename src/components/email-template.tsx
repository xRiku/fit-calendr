import * as React from "react";

interface EmailTemplateProps {
  code: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  code,
}) => (
  <div>
    <h1 className="font-normal text-base">Your code is {code}</h1>
  </div>
);
