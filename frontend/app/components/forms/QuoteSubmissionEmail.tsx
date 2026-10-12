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

import {
  Row,
  body,
  container,
  heading,
  hr,
  labelStyle,
  link,
  messageStyle,
  section,
  valueStyle,
} from './ContactSubmissionEmail'

export type QuoteSubmissionEmailProps = {
  eventType: string
  city: string
  date: string
  guests?: string
  booths: string[]
  extras: string[]
  notes?: string
  fullName: string
  company?: string
  email: string
  phone: string
  contactMethod: string
  consent: boolean
  notifications: boolean
  /** The site language the visitor used. */
  language: string
  sourceTitle?: string
  sourceUrl?: string
}

const list = (items: string[]) => (items.length ? items.join(', ') : 'None selected')

export function QuoteSubmissionEmail(p: QuoteSubmissionEmailProps) {
  const preview = `New quote request from ${p.fullName}: ${p.eventType} in ${p.city}`

  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>New quote request</Heading>

          {(p.sourceTitle || p.sourceUrl) && (
            <Section style={section}>
              <Text style={labelStyle}>Source page</Text>
              {p.sourceTitle ? <Text style={valueStyle}>{p.sourceTitle}</Text> : null}
              {p.sourceUrl ? (
                <Text style={valueStyle}>
                  <Link href={p.sourceUrl} style={link}>
                    {p.sourceUrl}
                  </Link>
                </Text>
              ) : null}
            </Section>
          )}

          <Hr style={hr} />

          <Row label="Event type">{p.eventType}</Row>
          <Row label="City">{p.city}</Row>
          <Row label="Event date">{p.date}</Row>
          <Row label="Expected guests">{p.guests ?? 'Not given'}</Row>
          <Row label="Booths">{list(p.booths)}</Row>
          <Row label="Extras">{list(p.extras)}</Row>
          {p.notes ? (
            <Section style={section}>
              <Text style={labelStyle}>Notes</Text>
              <Text style={messageStyle}>{p.notes}</Text>
            </Section>
          ) : null}

          <Hr style={hr} />

          <Row label="Full name">{p.fullName}</Row>
          {p.company ? <Row label="Company">{p.company}</Row> : null}
          <Row label="Email">
            <Link href={`mailto:${p.email}`} style={link}>
              {p.email}
            </Link>
          </Row>
          <Row label="Mobile">
            <Link href={`tel:${p.phone.replace(/[^+\d]/g, '')}`} style={link}>
              {p.phone}
            </Link>
          </Row>
          <Row label="Preferred contact">{p.contactMethod}</Row>
          <Row label="Site language">{p.language}</Row>

          <Hr style={hr} />

          <Row label="Consent to process personal data">{p.consent ? 'Yes' : 'No'}</Row>
          <Row label="Notifications opt-in">{p.notifications ? 'Yes' : 'No'}</Row>
        </Container>
      </Body>
    </Html>
  )
}

export default QuoteSubmissionEmail
