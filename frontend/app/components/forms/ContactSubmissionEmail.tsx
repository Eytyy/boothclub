import * as React from 'react'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

export type ContactSubmissionEmailProps = {
  fullName: string
  email: string
  company?: string
  phone?: string
  message: string
  consent: boolean
  notifications: boolean
  sourceTitle?: string
  sourceUrl?: string
}

function Row({label, children}: {label: string; children: React.ReactNode}) {
  return (
    <Section style={row}>
      <Text style={labelStyle}>{label}</Text>
      <Text style={valueStyle}>{children}</Text>
    </Section>
  )
}

export function ContactSubmissionEmail({
  fullName,
  email,
  company,
  phone,
  message,
  consent,
  notifications,
  sourceTitle,
  sourceUrl,
}: ContactSubmissionEmailProps) {
  const preview = `New contact form submission from ${fullName}`

  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>New contact form submission</Heading>

          {(sourceTitle || sourceUrl) && (
            <Section style={section}>
              <Text style={labelStyle}>Source page</Text>
              {sourceTitle ? <Text style={valueStyle}>{sourceTitle}</Text> : null}
              {sourceUrl ? (
                <Text style={valueStyle}>
                  <Link href={sourceUrl} style={link}>
                    {sourceUrl}
                  </Link>
                </Text>
              ) : null}
            </Section>
          )}

          <Hr style={hr} />

          <Row label="Full name">{fullName}</Row>
          <Row label="Email">
            <Link href={`mailto:${email}`} style={link}>
              {email}
            </Link>
          </Row>
          {company ? <Row label="Company">{company}</Row> : null}
          {phone ? <Row label="Phone">{phone}</Row> : null}

          <Section style={section}>
            <Text style={labelStyle}>Message</Text>
            <Text style={messageStyle}>{message}</Text>
          </Section>

          <Hr style={hr} />

          <Row label="Consent to process personal data">{consent ? 'Yes' : 'No'}</Row>
          <Row label="Notifications opt-in">{notifications ? 'Yes' : 'No'}</Row>
        </Container>
      </Body>
    </Html>
  )
}

const body = {
  backgroundColor: '#f6f6f6',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  margin: '0',
  padding: '24px 0',
} as const

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #e5e5e5',
  borderRadius: '8px',
  margin: '0 auto',
  maxWidth: '560px',
  padding: '32px',
} as const

const heading = {
  color: '#111111',
  fontSize: '22px',
  fontWeight: '600',
  lineHeight: '1.3',
  margin: '0 0 24px',
} as const

const section = {
  margin: '0 0 16px',
} as const

const row = {
  margin: '0 0 12px',
} as const

const labelStyle = {
  color: '#666666',
  fontSize: '12px',
  fontWeight: '600',
  letterSpacing: '0.04em',
  margin: '0 0 4px',
  textTransform: 'uppercase' as const,
} as const

const valueStyle = {
  color: '#111111',
  fontSize: '15px',
  lineHeight: '1.5',
  margin: '0',
  whiteSpace: 'pre-wrap' as const,
  wordBreak: 'break-word' as const,
} as const

const messageStyle = {
  ...valueStyle,
  borderLeft: '3px solid #e5e5e5',
  paddingLeft: '12px',
} as const

const hr = {
  borderColor: '#e5e5e5',
  borderTop: '1px solid #e5e5e5',
  margin: '20px 0',
} as const

const link = {
  color: '#111111',
  textDecoration: 'underline',
} as const

export default ContactSubmissionEmail
