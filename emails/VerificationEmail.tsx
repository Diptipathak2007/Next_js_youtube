import React from "react";
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Button,
} from "@react-email/components";

interface VerificationEmailProps {
  userName: string;
  verificationLink: string;
}

const VerificationEmail: React.FC<VerificationEmailProps> = ({
  userName,
  verificationLink,
}) => {
  return (
    <Html>
      <Head />
      <Preview>Verify your email address</Preview>
      <Body style={{ fontFamily: "Arial, sans-serif" }}>
        <Container>
          <Section>
            <Text style={{ fontSize: "20px", fontWeight: "bold" }}>
              Welcome, {userName}!
            </Text>
            <Text>
              Thank you for signing up. Please verify your email address to
              activate your account.
            </Text>
            <Button
              href={verificationLink}
              style={{
                backgroundColor: "#1a73e8",
                color: "#fff",
                padding: "10px 20px",
                borderRadius: "4px",
                textDecoration: "none",
              }}
            >
              Verify Email
            </Button>
            <Text>If you did not create an account, please ignore this email.</Text>
            <Text>Best regards,<br />The Team</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default VerificationEmail;
