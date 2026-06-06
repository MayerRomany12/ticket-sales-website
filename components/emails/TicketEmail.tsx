import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Hr,
} from "@react-email/components";

interface TicketEmailProps {
  customerName: string;
  eventName: string;
  eventDate: string;
  eventLocation: string;
  ticketCode: string;
  qrCodeUrl: string; // Base64 data URI or public URL
}

export const TicketEmail = ({
  customerName,
  eventName,
  eventDate,
  eventLocation,
  ticketCode,
  qrCodeUrl,
}: TicketEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your Ticket for {eventName} is here!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>TicketVault</Heading>
          <Text style={text}>Hi {customerName},</Text>
          <Text style={text}>
            Thank you for your purchase! Your ticket for <strong>{eventName}</strong> is confirmed.
          </Text>

          <Section style={ticketBox}>
            <Heading as="h2" style={h2}>
              {eventName}
            </Heading>
            <Text style={ticketDetail}>
              <strong>Date:</strong> {eventDate}
            </Text>
            <Text style={ticketDetail}>
              <strong>Location:</strong> {eventLocation}
            </Text>
            <Hr style={hr} />
            <Text style={ticketDetail}>
              <strong>Ticket Code:</strong> {ticketCode}
            </Text>
            
            <Section style={qrCodeSection}>
              <Img
                src={qrCodeUrl}
                width="200"
                height="200"
                alt="QR Code"
                style={qrCodeImage}
              />
            </Section>
            <Text style={hintText}>
              Present this QR code at the entrance.
            </Text>
          </Section>

          <Text style={footer}>
            If you have any questions, please reply to this email.
          </Text>
          <Text style={footer}>
            © {new Date().getFullYear()} TicketVault MVP.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default TicketEmail;

const main = {
  backgroundColor: "#f4f4f5",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "600px",
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  marginTop: "40px",
  marginBottom: "40px",
};

const h1 = {
  color: "#4f46e5",
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "0 0 20px",
};

const h2 = {
  color: "#18181b",
  fontSize: "20px",
  fontWeight: "bold",
  margin: "0 0 16px",
};

const text = {
  color: "#3f3f46",
  fontSize: "16px",
  lineHeight: "24px",
};

const ticketBox = {
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
  padding: "24px",
  marginTop: "24px",
  marginBottom: "24px",
};

const ticketDetail = {
  color: "#334155",
  fontSize: "15px",
  margin: "8px 0",
};

const hr = {
  borderColor: "#e2e8f0",
  margin: "20px 0",
};

const qrCodeSection = {
  textAlign: "center" as const,
  marginTop: "24px",
};

const qrCodeImage = {
  margin: "0 auto",
  borderRadius: "8px",
};

const hintText = {
  color: "#64748b",
  fontSize: "13px",
  textAlign: "center" as const,
  marginTop: "12px",
};

const footer = {
  color: "#94a3b8",
  fontSize: "13px",
  textAlign: "center" as const,
  marginTop: "8px",
};
